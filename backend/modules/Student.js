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
        image: {
            type: String, // This will store the path of the uploaded image
            default: 'http://localhost:8070/uploads/1728725895909.png'   // Optional: Default value if no image is uploaded
          },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
        }
)
const student = mongoose.model("student",studentSchema);

module.exports = student;