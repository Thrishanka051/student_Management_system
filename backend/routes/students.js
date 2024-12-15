const express = require("express");
const {io} = require('../server');
const router= require("express").Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const nodemailer = require('nodemailer');
const student= require("../modules/Student");
const User = require('../modules/UserModel');
const bcrypt = require('bcrypt');
const {userVerification,roleMiddleware } = require("../Middlewares/AuthMiddleware");
const generatePassword = require('../util/generatePassword'); // import the generate password function
const Subject = require("../modules/subject");
const Notification = require('../modules/notification')
console.log(io);
//const app = express();
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Set where to store the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  }
});

// Multer file filter to allow only image files
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const fileTypes = /jpeg|jpg|png/;
  // Test file extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Test MIME type
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png)')); // Reject the file
  }
};

// Multer middleware for file handling with the file filter applied
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Helper function to delete file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting file:', err);
    else console.log('File deleted:', filePath);
  });
};



router.post('/add', userVerification, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, age, email } = req.body;
    const password = generatePassword();
    //const hashedPassword = await bcrypt.hash(password, 10);

    console.log('user:',process.env.EMAIL, 'pass:',process.env.EMAIL_PASSWORD)

       // Configure nodemailer
       const transporter = nodemailer.createTransport({
        
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password or app password
        },
    });
  
    // Email content
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your Account Password',
        text: `Hi ${name},\n\nYour account has been created. Here is your password: ${password}\n\nPlease change it after logging in.`,
    };
  
    // Send email
    await transporter.sendMail(mailOptions);

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

router.route("/update/:id").put(userVerification, upload.single('image'),async(req,res)=>{
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

    if (req.file) {
      updateStudent.image = `/uploads/${req.file.filename}`; // Save the accessible URL path
 // Save the image path in the database
    }

    try {
        const studentUpdate = await student.findByIdAndUpdate(userID, updateStudent);
        const userUpdate = await User.findByIdAndUpdate(req.user._id, { username:name });

       
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

// Route to submit payment slip
router.post('/students/:id/upload-slip', upload.single('paymentSlip'), async (req, res) => {
  try {
    const studentId = req.params.id;
    const { transactionId, amount, paymentDate, payerName, status } = req.body;
    const slipPath = req.file.path; // Path to the uploaded slip

    // Find the student document
    const Student = await student.findById(studentId);
    if (!Student) return res.status(404).json({ message: 'Student not found' });

    // Ensure payments is an array
    Student.payments = Student.payments || [];

    // Check if there's a pending payment slip
    const pendingPaymentIndex = Student.payments.findIndex(payment => payment.status === 'Pending');

    // Create a new payment entry
    const newPayment = {
      transactionId,
      amount,
      paymentDate,
      payerName,
      status: status || 'Pending', // Default to 'Pending' if not specified
      slipPath,
    };

    //let notificationSent = false; // Flag to track whether a notification should be sent
    
    if (pendingPaymentIndex > -1) {
      // Delete the previous pending slip file
      const oldSlipPath = Student.payments[pendingPaymentIndex].slipPath;
      const oldPayId = Student.payments[pendingPaymentIndex]._id;
      // Find and delete the notification by paymentId
      await Notification.deleteOne({ paymentId: oldPayId });
      deleteFile(oldSlipPath);

      // Replace the existing pending payment with the new one
      Student.payments[pendingPaymentIndex] = newPayment;
    } else {
      // No pending payment, so add the new one to the payments array
      Student.payments.push(newPayment);
      notificationSent = true; // Send notification if it's a new payment
    }

    // If the slip is approved, handle LIFO storage for the last three verified slips
    if (status === 'Approved') {
      // Filter to keep only the last three verified payments in LIFO order
      Student.payments = Student.payments
        .filter(payment => payment.status === 'Approved') // Keep only verified payments
        .slice(-3); // Keep the last three
    }

    // Save the updated Student document
    const savedStudent= await Student.save();

    // Create a notification for the admin(s)
    if (true){
      const admins = await User.find({ role: 'admin' });
    const paymentId = savedStudent.payments[savedStudent.payments.length - 1]._id;

    for (const admin of admins) {
      await Notification.create({
        senderId:studentId,
        receiverId: admin._id,
        paymentId,
        status: 'Pending',
        isRead: false,
      });

      if (io) {
        io.emit('newNotification', {
          adminId: admin._id,
          paymentId,
          studentId,
          message: `New payment submitted by ${Student.name}`,
        });
      } else {
        console.log('WebSocket is not connected.');
      }

    }
    
    }

    res.status(200).json({ message: 'Payment slip submitted successfully', payment: newPayment });
  } catch (error) {
    console.error('Error submitting payment slip:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
