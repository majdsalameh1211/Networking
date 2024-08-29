import axios from '../../api/axios';

/**
 * Fetches the list of friends for a given user.
 * @param {string} userId - The ID of the user whose friends are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of friends or an empty array if an error occurs.
 */
export const fetchFriends = async (userId) => {
  try {
    const response = await axios.post('/fetch-friends', { user_id: userId });
    return response.data.friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};

/**
 * Fetches the list of followers for a given user.
 * @param {string} userId - The ID of the user whose followers are to be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of followers or an empty array if an error occurs.
 */
export const fetchFollowers = async (userId) => {
  try {
    const response = await axios.post('/fetch-followers', { friend_id: userId });
    return response.data.followers;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

/**
 * Removes a friend from the current user's friend list.
 * @param {Object} currentUser - The current user object.
 * @param {string} friendId - The ID of the friend to be removed.
 * @returns {Promise<boolean>} - A promise that resolves to true if the friend was removed successfully, or false if an error occurs.
 */
export const removeFollow = async (currentUser, friendId) => {
  try {
    const response = await axios.post('/remove-follow', { user_id: currentUser.user_id, friend_id: friendId });
    return response.data.message === 'Friend removed successfully';
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
};

/**
 * Removes a follower from the current user's followers list.
 * @param {Object} currentUser - The current user object.
 * @param {string} followerId - The ID of the follower to be removed.
 * @returns {Promise<boolean>} - A promise that resolves to true if the follower was removed successfully, or false if an error occurs.
 */
export const removeFollower = async (currentUser, followerId) => {
  try {
    const response = await axios.post('/remove-follower', { user_id: currentUser.user_id, follower_id: followerId });
    return response.data.message === 'Follower removed successfully';
  } catch (error) {
    console.error('Error removing follower:', error);
    return false;
  }
};

/**
 * Follows a user by adding them to the current user's friend list and sending a notification.
 * @param {Object} currentUser - The current user object.
 * @param {string} userId - The ID of the user to be followed.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user was followed successfully, or false if an error occurs.
 */
export const followUser = async (currentUser, userId) => {
  try {
    const response = await axios.post('/follow', { user_id: currentUser.user_id, friend_id: userId });
    if (response.data.message === 'Friend added successfully') {
      const notificationContent = `${currentUser.user_name} started to follow you`;
      await axios.post('/add-follow-notification', { user_id: userId, notification_content: notificationContent });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding friend:', error);
    return false;
  }
};

/**
 * Searches for users by username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of users matching the search criteria, or an empty array if an error occurs.
 */
export const searchUsers = async (username) => {
  try {
    const response = await axios.post('/search-users', { username });
    return response.data.users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};
