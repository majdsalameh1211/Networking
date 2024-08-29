import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import { fetchNotifications, markAsSeen } from './notificationsUtils';

/**
 * NotificationsPage component displays a list of notifications for the current user.
 * Users can mark notifications as seen, which will update the visual representation and state.
 */
function NotificationsPage() {
  const { currentUser } = useUser(); // Retrieve the current user from context.
  const [notifications, setNotifications] = useState([]); // State to store the list of notifications.

  /**
   * Fetch notifications for the current user when the component mounts or when the current user changes.
   */
  useEffect(() => {
    if (!currentUser) return;
    fetchNotifications(currentUser.user_id, setNotifications);
  }, [currentUser]);

  /**
   * Mark a notification as seen.
   * @param {string} notificationId - The ID of the notification to mark as seen.
   */
  const handleMarkAsSeen = (notificationId) => {
    markAsSeen(notificationId, notifications, setNotifications);
  };

  if (!currentUser) {
    return <div>Loading...</div>; // Display a loading message if the current user is not yet loaded.
  }

  return (
    <div className="notifications-page-container">
      <h1 className="notifications-page-title">Notifications</h1>
      <table className="notifications-page-table">
        <thead>
          <tr>
            <th>Notification Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map(notification => (
            <tr key={notification._id}>
              <td className={`notifications-page-content ${!notification.seen ? 'notifications-page-content-unseen' : ''}`}>
                {notification.notification_content}
              </td>
              <td>
                {!notification.seen && (
                  <button
                    onClick={() => handleMarkAsSeen(notification._id)}
                    className="notifications-page-button"
                  >
                    Mark as Seen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NotificationsPage;
