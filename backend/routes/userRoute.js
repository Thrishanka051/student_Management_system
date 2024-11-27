const express = require('express');
const router = express.Router();
const { userVerification } = require('../Middlewares/AuthMiddleware');
const User = require('../modules/UserModel');
const Notification = require('../modules/notification'); 
const Student = require('../modules/Student');



router.get('/role', userVerification, (req, res) => {
  res.json({ role: req.user.role });
});

router.get('/id', userVerification, (req, res) => {
  res.json({ id: req.user._id });
});

router.post('/change-password',userVerification, async (req, res) => {
  const { user_Id, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match" });
  }

  try {
      const user = await User.findById(user_Id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(oldPassword); // The bcrypt.compare method returns a promise, so it should be awaited.

      if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Server error", error });
      
  }
});

router.get('/notifications/admin', userVerification, async (req, res) => {
  try {
    const adminId = req.user._id; 
    const notifications = await Notification.find({ receiverId: adminId })
      .sort({ createdAt: -1 });  // First, get the notifications sorted

    // Now populate the fields after the query resolves
    const populatedNotifications = await Notification.populate(notifications, [
      { path: 'senderId', select: 'name email payments' },  // Populate senderId with name
      
    ]);

    // Map through notifications and add corresponding payment details
    const notificationsWithPayments = populatedNotifications.map(notification => {
      const student = notification.senderId;
      if (!student) return notification; // Skip if no student found

      // Find the matching payment in the student's payments array
      const payment = student.payments.find(p => p._id.toString() === notification.paymentId.toString());

      // Attach the payment details to the notification
      return {
        ...notification.toObject(),
        senderId: {
          _id: student._id,
          name: student.name,
          age: student.age,
          email: student.email,
          image: student.image,
        },
        paymentId: payment || null, // Add payment details or null if not found
      };
    });

    console.log('noti with pay', notificationsWithPayments)

    res.status(200).json(notificationsWithPayments);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/notifications/:id/approve-reject', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const notification = await Notification.findById(req.params.id);

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    const senderStudent = await Student.findById(notification.senderId);
    if (!senderStudent) return res.status(404).json({ message: 'sender Student not found' });

    console.log('sender', senderStudent);

    // Update the notification and payment status
    notification.status = status;
    notification.isRead = true;
    await notification.save();

    // Find the specific payment in the payments array
    const Payment = senderStudent.payments.find(
      (payment) => payment._id.toString() === notification.paymentId.toString()

  );

  console.log('element', Payment);

  if (!Payment) {
      return res.status(404).json({ message: 'Payment not found' });
  }

  // Update the status of the payment
  Payment.status = status;

  // Save the updated student document
  await senderStudent.save();

    res.status(200).json({ Payment, message: `Payment ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;

