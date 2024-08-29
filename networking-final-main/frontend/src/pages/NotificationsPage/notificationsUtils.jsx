import axios from '../../api/axios';

/**
 * Fetches notifications for a given user and updates the state with sorted notifications.
 * @param {string} userId - The ID of the user whose notifications are to be fetched.
 * @param {Function} setNotifications - Function to update the state with the fetched notifications.
 */
export const fetchNotifications = async (userId, setNotifications) => {
  try {
    const response = await axios.post('/fetch-notifications', { user_id: userId });
    // Sort notifications by date, with the most recent first
    const sortedNotifications = response.data.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(sortedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

/**
 * Marks a specific notification as seen and updates the state.
 * @param {string} notificationId - The ID of the notification to be marked as seen.
 * @param {Array} notifications - The current list of notifications.
 * @param {Function} setNotifications - Function to update the state with the modified notifications.
 */
export const markAsSeen = async (notificationId, notifications, setNotifications) => {
  try {
    const response = await axios.post('/mark-notification-seen', { notification_id: notificationId });
    if (response.data.message === 'Notification marked as seen') {
      // Update the notifications state by marking the specific notification as seen
      setNotifications(
        notifications.map(notification =>
          notification._id === notificationId ? { ...notification, seen: true } : notification
        )
      );
    }
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
};
