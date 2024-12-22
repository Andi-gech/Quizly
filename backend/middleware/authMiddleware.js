const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjcyYmU3YzhkYjgzMGVhNWZmOWQ1OSIsImlhdCI6MTczNDg2MTU3MywiZXhwIjoxNzM3NDUzNTczfQ.icmUulbxT631RI481bNSDHt_Nf6Or4fg0FSYQt99Gy4"
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
 
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
