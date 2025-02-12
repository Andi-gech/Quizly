const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const VerificationCode = require('../models/VerificationCode');
const sendMail = require('../utils/sendmail');
const AppError = require('../utils/appError');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified
      }
    }
  });
};

// Improved error handling
const handleErrors = (err, res) => {
  let error = { ...err };
  error.message = err.message;

  // MongoDB duplicate key
  if (err.code === 11000) {
    const message = 'Email already exists';
    return new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Token expired', 401);
  }

  return new AppError(error.message, 500);
};

exports.googleLogin = async (req, res, next) => {
  try {
    console.log(req.body)
    const { idToken } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();
    console.log('creating new user', googleId, email, name, picture);
     
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
console.log(user)
    if (user) {
      if (!user.googleId) {
        return next(new AppError('Account exists. Use email/password login.', 400));
      }
    } else {
      user = await User.create({
        username: name,
        email,
        googleId,
        provider: 'google',
        photo: picture,
        isVerified: true
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    console.log(err)
    next(handleErrors(err, res));
  }
};

exports.signup = async (req, res, next) => {
  try {
    console.log(req.body)
    const { username, email, password } = req.body;
    
    const newUser = await User.create({ 
      username,
      email,
      password
    });

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    await VerificationCode.create({
      email,
      code: verificationCode,
      expiresAt: Date.now() + process.env.VERIFICATION_CODE_EXPIRES * 60 * 1000
    });
console.log(email, verificationCode)
    await sendMail({
      email,
      subject: 'Your Verification Code',
      message: `Your verification code is ${verificationCode} (valid for ${process.env.VERIFICATION_CODE_EXPIRES} minutes)`
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(handleErrors(err, res));
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const verificationDoc = await VerificationCode.findOne({ email });
    const user = await User.findOne({ email });

    if (!verificationDoc || !user) {
      return next(new AppError('Invalid verification request', 400));
    }

    if (verificationDoc.code !== code) {
      return next(new AppError('Invalid verification code', 400));
    }

    if (verificationDoc.expiresAt < Date.now()) {
      return next(new AppError('Verification code expired', 400));
    }

    user.isVerified = true;
    await user.save();
    await VerificationCode.deleteOne({ email });

    createSendToken(user, 200, res);
  } catch (err) {
    next(handleErrors(err, res));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if account is verified
    if (!user.isVerified) {
      return next(new AppError('Please verify your email first', 403));
    }

    // 4) If everything ok, send token
    createSendToken(user, 200, res);
  } catch (err) {
    next(handleErrors(err, res));
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('No user with that email address', 404));
    }

    // 2) Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    await sendMail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}`
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    next(handleErrors(err, res));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (err) {
    next(handleErrors(err, res));
  }
};
exports.resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
      return next(new AppError('Account already verified', 400));
    }

    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    await VerificationCode.create({
      email,
      code: verificationCode,
      expiresAt: Date.now() + process.env.VERIFICATION_CODE_EXPIRES * 60 * 1000
    });

    await sendMail({
      email,
      subject: 'Your Verification Code',
      message: `Your verification code is ${verificationCode} (valid for ${process.env.VERIFICATION_CODE_EXPIRES} minutes)`
    });

    res.status(200).json({
      status: 'success',
      message: 'Verification code sent'
    });
  }
  catch (err) {
    next(handleErrors(err, res));
  }
}


exports.getme = async (req,res) =>{
  try{
    const id=req.user.id
    const authUser=await User.findById(id).select('-password')
   return res.status(200).json(authUser);

  }
  catch(err){
   return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}
exports.updateMe = async (req,res) =>{
  try{
    const id=req.user.id
    const authUser=await User.findByIdAndUpdate
    (id,{
      username:req.body.username
    },{
      new:true,
      runValidators:true
    })
   return res.status(200).json(authUser);
  }
  catch(err){
   return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}




