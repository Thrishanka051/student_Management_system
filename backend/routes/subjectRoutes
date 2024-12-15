const express = require('express');
const router = express.Router();
const { userVerification , roleMiddleware} = require('../Middlewares/AuthMiddleware');
const Subject = require('../modules/subject');
const Student = require('../modules/Student');
const { calculateZScoresAndRank } = require("../Middlewares/zScoreService");

router.get('/students',userVerification, async (req, res) => {

  //Student.find(): This part of the code is querying the database for all documents in the Student collection.
  //the lean() method is used to return plain JavaScript objects instead of Mongoose documents.
  //students: An array of plain JavaScript objects representing all documents in the Student collection.

  try {
    // Fetch all students and subjects
    const students = await Student.find().lean();
    const subjects = await Subject.find().lean();

    // Merge students with their corresponding marks
    const studentData = students.map(student => {
      const subject = subjects.find(sub => sub.studentId.toString() === student._id.toString());
      return { ...student, marks: subject ? subject : { maths: 0, chemistry: 0, physics: 0 } };
    });

    // Fetch or calculate rankedStudents array (this would be replaced by your actual logic)
    const rankedStudents = await calculateZScoresAndRank();
    // Create a map for quick lookups of rank
    const rankMap = new Map(rankedStudents.map((rank, index) => [rank.studentId, index]));

    // Sort studentData based on rankedStudents order
    /*const sortedStudentData = studentData.sort((a, b) => {
      const rankA = rankMap.get(a._id.toString()) ?? Infinity; // Default to Infinity if not ranked
      const rankB = rankMap.get(b._id.toString()) ?? Infinity;
      return rankA - rankB;
    });*/

    const sortedStudentData = rankedStudents.map(data => 
      studentData.find(student => student._id.toString() === data.studentId.toString())
  );

    // Send the sorted data
    res.send(sortedStudentData);
  } catch (err) {
    console.error("Error fetching and sorting student data:", err);
    res.status(500).send({ error: "An error occurred while processing student data." });
  }
  });

  router.post('/students/:id/marks', userVerification, roleMiddleware('admin'), async (req, res) => {
    const { id } = req.params;
    const { maths, chemistry, physics } = req.body;
  
    let subject = await Subject.findOne({ studentId: id });
  
    if (!subject) {
      subject = new Subject({ studentId: id, maths, chemistry, physics });
    } else {
      subject.maths = maths;
      subject.chemistry = chemistry;
      subject.physics = physics;
    }
  
    await subject.save();
    res.send(subject);
  });

  router.post('/marks',userVerification, roleMiddleware('admin'), async (req, res) => {
    const { students } = req.body;
    console.log(req.body);
  
    try {
      const updatePromises = students.map(student =>
        Subject.updateOne(
          { studentId: student._id },
          {
            $set: {
              maths:  student.marks.maths,
              chemistry:  student.marks.chemistry,
              physics:  student.marks.physics,
            },
          },
          { upsert: true } // This option creates a new document if no match is found
        )
      );
      
      await Promise.all(updatePromises);
  
      res.status(200).send('Marks updated successfully');
    } catch (error) {
      res.status(500).send('Error updating marks');
    }
  });




  module.exports= router;