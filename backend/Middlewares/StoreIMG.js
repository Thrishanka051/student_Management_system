const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../modules/Student');
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Set where to store the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  }
});

// Multer middleware for file handling
const upload = multer({ storage: storage });

// Update student with image handling
router.put('/student/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, age, marks } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    student.name = name;
    student.age = age;
    student.marks = JSON.parse(marks);

    // If image is uploaded, update image path
    if (req.file) {
      student.image = req.file.path; // Save the image path in the database
    }

    await student.save();
    res.status(200).send("Student updated successfully");
  } catch (error) {
    res.status(500).send("Error updating student: " + error.message);
  }
});

module.exports = router;
