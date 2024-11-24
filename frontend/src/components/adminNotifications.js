import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
import NotificationDetails from './notificationDetails ';
import '../styles/notification.css';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/user/notifications/admin');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="admin-notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification._id}
            className={notification.isRead ? 'read' : 'unread'}
            onClick={() => handleNotificationClick(notification)}
          >
            {notification.isRead ? '✔️' : '🔔'} Payment slip submitted by {notification.senderId.name}
          </li>
        ))}
      </ul>

      {/* Display the details of the selected notification */}
      {selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminNotifications;
