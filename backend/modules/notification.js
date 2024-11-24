const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'student' }, // Student who submitted the payment
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who will review
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
