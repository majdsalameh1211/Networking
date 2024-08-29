import axios from '../../api/axios';

/**
 * Fetches the details of a user by their user ID and updates the state with the user data.
 * If an error occurs during the fetch, it updates the error state.
 *
 * @param {string} userId - The ID of the user whose details are to be fetched.
 * @param {Function} setUser - Function to update the state with the fetched user details.
 * @param {Function} setError - Function to update the state with an error message if the fetch fails.
 */
export const fetchUserDetails = async (userId, setUser, setError) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    setUser(response.data); // Update the state with the fetched user data.
  } catch (err) {
    setError('Error fetching user details'); // Update the state with an error message.
    console.error('Error fetching user details:', err); // Log the error to the console for debugging.
  }
};
