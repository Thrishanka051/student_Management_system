const User = require("../modules/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false, message: 'no token provided. plz login' })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.status(401).send({ message: 'authorization denied' })
    } else {
      const user = await User.findById(data.id)
      req.user = user;
      
      if (user) {
        next();
      }
      else return res.status(401).send({ message: 'user not found' })
      
    }
  })
}


module.exports.roleMiddleware = (requiredRole) => {
  return (req, res, next) => {

    const userRole = req.user.role;

    if (userRole === requiredRole) {
      next(); // User has the required role, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
};

