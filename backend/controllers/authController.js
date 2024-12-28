const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendmail');
const VerificationCode = require('../models/VerificationCode');
const GenerateEmailCode = require('../utils/GenerateEmailcode');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    const codeode=GenerateEmailCode();
    const verfication=await VerificationCode.findOneAndUpdate({email:email},{code:codeode},{upsert:true,new:true})
    await verfication.save();
    const text = `Your verification code is ${codeode}`;
    const send=await sendMail(email, 'Verification Code', text);
   


    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.verifyEmail = async (req, res) => {
  
  const {  code } = req.body;
  console.log(code)
  try {
    const auth=await User.findById(req.user.id)
    
    const user = await VerificationCode.findOne
    ({ email: auth.email });
    if (!user||!auth) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    if (user.code !== code) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect code',
      });
    }
    auth.isVerified = true;
    await auth.save();
    const token = signToken(auth._id);
    res.status(200).json({
      status: 'success',
      message: 'Email verified',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      isVerified:user.isVerified,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
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




