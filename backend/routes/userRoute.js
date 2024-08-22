const express = require('express');
const router = express.Router();
const { userVerification } = require('../Middlewares/AuthMiddleware');
const User = require('../modules/UserModel');

router.get('/role', userVerification, (req, res) => {
  res.json({ role: req.user.role });
});

router.get('/id', userVerification, (req, res) => {
  res.json({ id: req.user._id });
});

router.post('/change-password',userVerification, async (req, res) => {
  const { user_Id, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
  }

  try {
      const user = await User.findById(user_Id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(oldPassword); // The bcrypt.compare method returns a promise, so it should be awaited.

      if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server error", error });
      
  }
});

module.exports = router;

