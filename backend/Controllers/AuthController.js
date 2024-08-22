const User = require("../modules/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");


/* If you have a function that returns promises, use the async keyword when 
defining the function. Inside this function, for any operation that returns a promise, 
use the await keyword to wait for the promise to resolve*/

//if return a promise it's a asynchronous operation. we use await infront of them (inside async functions). also aync is indicate that it is a asynchronous function

module.exports.Signup = async (req, res, next) => {
    try {
      const { email, password, username, createdAt } = req.body;
      const existingUser = await User.findOne({ email }); // asynchronous operation
      if (existingUser) {
        return res.json({ message: "User already exists" });
      }

      let role = 'user';
      if(email===process.env.ADMIN_EMAIL){
        role= 'admin';
      }

      const user = await User.create({ email, password, username,role, createdAt });
      const token = createSecretToken(user._id, user.role);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res
        .status(201)
        .json({ message: "User signed in successfully", success: true, user });
      next();
    } catch (error) {
      console.error(error);
    }
  };

module.exports.Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id,user.role);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged  in successfully", success: true ,role:user.role});
       next()
    } catch (error) {
      console.error(error);
    }
  };