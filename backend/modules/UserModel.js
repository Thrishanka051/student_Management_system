const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  role:{
    type: String, enum: ['user', 'admin'], default: 'user' },
  
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

//before a document is saved (pre save) into the database, this middleware function will be executed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  try {
      const salt = await bcrypt.genSalt(12); //password is combined with 12 random sequence of characters(salt).
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (err) {
      next(err);
  }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};



/*userSchema.pre("save", async function () {  
  this.password = await bcrypt.hash(this.password, 12);
});*/

module.exports = mongoose.model("User", userSchema);