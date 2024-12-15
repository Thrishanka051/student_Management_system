const mongoose = require("mongoose");
const Subject = require("../modules/subject"); // Adjust to your Subject model
const Student = require("../modules/Student");

async function calculateZScoresAndRank() {
  try {
    // Fetch all subject documents
    const subjects = await Subject.find({});
    
    // Calculate mean and standard deviation for each subject
    const marks = {
      maths: [],
      chemistry: [],
      physics: []
    };
    
    subjects.forEach(subject => {
      marks.maths.push(subject.maths);
      marks.chemistry.push(subject.chemistry);
      marks.physics.push(subject.physics);
    });

    const calculateMean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const calculateStdDev = (arr, mean) =>
      Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length);

    const stats = {
      maths: {
        mean: calculateMean(marks.maths),
        stdDev: calculateStdDev(marks.maths, calculateMean(marks.maths))
      },
      chemistry: {
        mean: calculateMean(marks.chemistry),
        stdDev: calculateStdDev(marks.chemistry, calculateMean(marks.chemistry))
      },
      physics: {
        mean: calculateMean(marks.physics),
        stdDev: calculateStdDev(marks.physics, calculateMean(marks.physics))
      }
    };

    // Calculate Z-scores for each student
    const studentScores = subjects.map(subject => {
      const mathsZ = (subject.maths - stats.maths.mean) / stats.maths.stdDev;
      const chemistryZ = (subject.chemistry - stats.chemistry.mean) / stats.chemistry.stdDev;
      const physicsZ = (subject.physics - stats.physics.mean) / stats.physics.stdDev;

      const compositeZ = (mathsZ + chemistryZ + physicsZ) / 3; // Average of Z-scores

      return {
        studentId: subject.studentId,
        compositeZ
      };
    });

    // Rank students by composite Z-score
    const rankedStudents = studentScores.sort((a, b) => b.compositeZ - a.compositeZ);

    // Update rank and Z-score in the Student model
    await Promise.all(
        rankedStudents.map((student, index) =>
          Student.updateOne(
            { _id: student.studentId }, // Match student by ID
            { $set: { rank: index + 1, zScore: student.compositeZ } } // Update rank and Z-score
          )
        )
      );
  
    console.log("Ranked Students:", rankedStudents);
    return rankedStudents;
  } catch (error) {
    console.error("Error calculating Z-scores and ranking:", error);
  }
}

module.exports = { calculateZScoresAndRank };
