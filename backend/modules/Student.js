const mongoose = require('mongoose');
const schema= mongoose.Schema;

const studentSchema = new schema(
    {
        name:{
            type:String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        email:{
            type:String,
            required: true
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
    }
)
const student = mongoose.model("student",studentSchema);


module.exports = student;