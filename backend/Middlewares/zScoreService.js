const mongoose = require("mongoose");
const Subject = require("../modules/subject"); // Adjust to your Subject model
const Student = require("../modules/Student");

async function calculateZScoresAndRank() {
  try {
    // Fetch all subject documents
    const subjects = await Subject.find({});
    
    // Check if subjects data is available
    if (!subjects || subjects.length === 0) {
      console.error("No subjects found in the database");
      return;
    }

    // Initialize marks data
    const marks = {
      maths: [],
      chemistry: [],
      physics: []
    };

    // Populate marks arrays while validating data
    subjects.forEach(subject => {
      if (typeof subject.maths === "number" && !isNaN(subject.maths)) {
        marks.maths.push(subject.maths);
      } else {
        console.warn(`Invalid maths score for student ${subject.studentId}: ${subject.maths}`);
      }
      
      if (typeof subject.chemistry === "number" && !isNaN(subject.chemistry)) {
        marks.chemistry.push(subject.chemistry);
      } else {
        console.warn(`Invalid chemistry score for student ${subject.studentId}: ${subject.chemistry}`);
      }

      if (typeof subject.physics === "number" && !isNaN(subject.physics)) {
        marks.physics.push(subject.physics);
      } else {
        console.warn(`Invalid physics score for student ${subject.studentId}: ${subject.physics}`);
      }
    });

    // Helper functions to calculate mean and standard deviation
    const calculateMean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    const calculateStdDev = (arr, mean) =>
      Math.sqrt(arr.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / arr.length);

    // Calculate mean and standard deviation for each subject
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

    // Check if all standard deviations are zero (indicating no variation in marks)
    if (
      stats.maths.stdDev === 0 &&
      stats.chemistry.stdDev === 0 &&
      stats.physics.stdDev === 0
    ) {
      // If all standard deviations are zero, set Z-scores to 0 for all students
      const studentScores = subjects.map(subject => ({
        studentId: subject.studentId,
        compositeZ: 0 // All students get a Z-score of 0
      }));

      // Rank students by composite Z-score (all Z-scores are 0)
      const rankedStudents = studentScores.sort((a, b) => b.compositeZ - a.compositeZ);

      // Update rank and Z-score in the Student model
      await Promise.all(
        rankedStudents.map((student, index) =>
          Student.updateOne(
            { _id: student.studentId },
            { $set: { rank: index + 1, zScore: student.compositeZ } }
          )
        )
      );

      console.log("Ranked Students (All Z-scores are 0):", rankedStudents);
      return rankedStudents;
    } else {
      // Calculate Z-scores for each student
      const studentScores = subjects.map(subject => {
        // Handle cases where standard deviation is zero (division by zero error)
        const mathsZ = stats.maths.stdDev !== 0 ? (subject.maths - stats.maths.mean) / stats.maths.stdDev : 0;
        const chemistryZ = stats.chemistry.stdDev !== 0 ? (subject.chemistry - stats.chemistry.mean) / stats.chemistry.stdDev : 0;
        const physicsZ = stats.physics.stdDev !== 0 ? (subject.physics - stats.physics.mean) / stats.physics.stdDev : 0;

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
            { _id: student.studentId },
            { $set: { rank: index + 1, zScore: student.compositeZ } }
          )
        )
      );

      console.log("Ranked Students:", rankedStudents);
      return rankedStudents;
    }
  } catch (error) {
    console.error("Error calculating Z-scores and ranking:", error);
  }
}

module.exports = { calculateZScoresAndRank };
