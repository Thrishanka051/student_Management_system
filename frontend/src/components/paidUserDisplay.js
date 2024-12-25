import React, { useEffect, useState } from 'react';
import { format, isThisMonth } from 'date-fns';
import axiosInstance from '../axiosConfig';
import '../styles/StudentPayments.css'; // Add CSS styles for the UI

const StudentPayments = () => {
  const [students, setStudents] = useState([]);
  const [paidStudents, setPaidStudents] = useState([]);
  const [notPaidStudents, setNotPaidStudents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch students data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get("/student/", { withCredentials: true }); // Replace with your API endpoint
        setStudents(response.data);
        categorizePayments(response.data);
      } catch (err) {
        setError('Error fetching students: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchStudents();
  }, []);

  // Categorize students into paid and not paid
  const categorizePayments = (studentsData) => {
    const paid = [];
    const notPaid = [];

    studentsData.forEach((student) => {
      if (!student.payments || student.payments.length === 0) {
        // No payments, mark as not paid
        notPaid.push({ ...student, paymentStatus: 'No Payment Record' });
      } else {
        const recentPayment = student.payments[student.payments.length - 1];
        const paymentDate = recentPayment.paymentDate ? new Date(recentPayment.paymentDate) : null;

        // Check if the paymentDate is valid
        if (paymentDate && paymentDate instanceof Date && !isNaN(paymentDate)) {
          const currentDate = new Date();

          // Check if the payment is from this month
          if (paymentDate.getMonth() !== currentDate.getMonth() || paymentDate.getFullYear() !== currentDate.getFullYear()) {
            // Payment is from a past month or invalid
            notPaid.push({ ...student, paymentStatus: 'Past Month' });
          } else if (recentPayment.status !== 'Approved') {
            // Payment is current month but not approved
            notPaid.push({ ...student, paymentStatus: recentPayment.status });
          } else {
            // Payment is current month and approved
            paid.push(student);
          }
        } else {
          // Invalid or missing payment date
          notPaid.push({ ...student, paymentStatus: 'Invalid Payment Date' });
        }
      }
    });

    setPaidStudents(paid);
    setNotPaidStudents(notPaid);
  };

  return (
    <div className="student-payments-container">
      {error && <div className="error-message">{error}</div>}

      <div className="students-column paid-students">
        <h2>Paid Students</h2>
        {paidStudents.length > 0 ? (
          paidStudents.map((student) => (
            <div className="student-card green" key={student._id.$oid}>
              <img src={student.image} alt={student.name} />
              <h3>{student.name}</h3>
              <p>Status: Paid</p>
              <p>Last Payment: {format(new Date(student.payments[student.payments.length - 1].paymentDate), 'MM/dd/yyyy')}</p>
            </div>
          ))
        ) : (
          <p>No students have paid for this month.</p>
        )}
      </div>

      <div className="students-column not-paid-students">
        <h2>Not Paid Students</h2>
        {notPaidStudents.length > 0 ? (
          notPaidStudents.map((student) => (
            <div
              className={`student-card ${
                student.payments.status === 'Pending'
                  ? 'dark-yellow'
                  : student.payments.status === 'Rejected'
                  ? 'red'
                  : 'red'
              }`}
              key={student._id.$oid}
            >
              <img src={student.image} alt={student.name} />
              <h3>{student.name}</h3>
              <p>Status: {student.paymentStatus}</p>
              {student.payments && student.payments.length > 0 && (
                <p>Last Payment: {format(new Date(student.payments[student.payments.length - 1].paymentDate), 'MM/dd/yyyy')}</p>
              )}
            </div>
          ))
        ) : (
          <p>All students have paid for this month.</p>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
