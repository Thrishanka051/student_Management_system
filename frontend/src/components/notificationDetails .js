import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

const NotificationDetails = ({ notification, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleApproval = async (status) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/user/notifications/${notification._id}/approve-reject`, { status });
      alert(`Payment ${status.toLowerCase()} successfully`);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error approving/rejecting payment:', error);
      setLoading(false);
    }
  };

  if (!notification) return null;

  return (
    <div className="notification-details">
      <h3>Payment Details</h3>
      <p><strong>Payer Name:</strong> {notification.paymentId.payerName}</p>
      <p><strong>Transaction ID:</strong> {notification.paymentId.transactionId}</p>
      <p><strong>Amount:</strong> {notification.paymentId.amount}</p>
      <p><strong>Payment Date:</strong> {notification.paymentId.paymentDate}</p>
      <div className="receipt">
        <h4>Payment Receipt</h4>
        <img src={`http://localhost:8070/${notification.paymentId.slipPath.replace("\\", "/")}`} alt="Payment Receipt" />
      </div>

      <div className="actions">
        <button onClick={() => handleApproval('Approved')} disabled={loading}>
          Approve
        </button>
        <button onClick={() => handleApproval('Rejected')} disabled={loading}>
          Reject
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NotificationDetails;
