const router= require("express").Router();
const student= require("../modules/Student");
const User = require('../modules/UserModel');
const bcrypt = require('bcrypt');
const {userVerification,roleMiddleware } = require("../Middlewares/AuthMiddleware");
const generatePassword = require('../util/generatePassword'); // import the generate password function
const Subject = require("../modules/subject");

router.post('/add', userVerification, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const password = generatePassword();
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      email:email,
      username: name, 
      password: password,
      role: 'user'
    });
    await user.save();

    // Create the student and link to the user
    const newStudent = new student({ name, age, email, user: user._id });
    await newStudent.save();

    res.json({ message: 'Student added', username: user.username, password });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})


router.route("/").get(userVerification,async(req,res)=>{
    
    await student.find().then((students)=>{
        //console.log('Students fetched:', students);
        res.json(students)
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.route("/update/:id").put(userVerification,async(req,res)=>{
    let userID = req.params.id;
    const {name, age}= req.body;
    const Student = await student.findById(userID);
    console.log(req.user._id.toString());
    console.log(Student.user.toString())

    /*req.user doesn't directly refer to the user who simply calls the router.
     It refers to the authenticated user associated with the current request, 
     if there is one.*/
    if(req.user.role !=='admin' && req.user._id.toString() !== Student.user.toString()){
        
        return res.status(403).json({message: 'Access denied. Insufficient permissions.'})
    }

    const updateStudent = {
        name,
        age
    };
    try {
        const studentUpdate = student.findByIdAndUpdate(userID, updateStudent);
        const userUpdate = User.findByIdAndUpdate(req.user._id, { username:name });
    
        await Promise.all([studentUpdate, userUpdate]);
    
        res.status(200).send({ status: 'User and student updated successfully.' });
      } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'Error with updating data', error: err.message });
      }
})

router.route("/delete/:id").delete(userVerification,roleMiddleware('admin'),async(req,res)=>{
    let userID= req.params.id;
   
    const Student = await student.findById(userID);

    try {
        const studentDelete = student.findByIdAndDelete(userID);
        const userDelete = User.findByIdAndDelete(Student.user);
        const subjectDelete = Subject.findOneAndDelete({ studentId: userID });

    await Promise.all([studentDelete, userDelete, subjectDelete]);
    
    res.status(200).send({ status: 'User and student deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: 'Error with deleting data', error: err.message });
  }
})

router.route("/get/:id").get(userVerification,async(req,res)=>{
    let userID=req.params.id;
    console.log(userID);
    await student.findById(userID).then((std)=>{
        res.status(200).send({status:"User fetched", user: std});
        //res.json(std);
    }).catch((err)=>{
        console.log(err.massage);
        res.status(500).send({status:"error in user fetching", error:err.massage});
    })
})

module.exports= router;