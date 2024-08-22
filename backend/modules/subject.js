const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  maths: { type: Number, default:0},
  chemistry:{type : Number , default:0},
  physics:{type : Number, default:0}
  

});

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
