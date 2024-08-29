import axios from '../../api/axios';

/**
 * Handles the login process for the user.
 * Sends the login request to the server and updates the authentication state based on the response.
 *
 * @param {Object} formData - The form data containing the user's email and password.
 * @param {Function} setCurrentUser - Function to set the current user in the context.
 * @param {Function} setAuth - Function to set the authentication state in the parent component.
 * @param {Function} navigate - Function to navigate to different routes.
 * @param {Function} setError - Function to set the error message if login fails.
 */
export const loginUser = async (formData, setCurrentUser, setAuth, navigate, setError) => {
  try {
    const response = await axios.post('/login', formData);
    if (response.data.message === 'Login successful') {
      setAuth(true);
      setCurrentUser(response.data.user);
      navigate('/home'); // Redirect to the home page on successful login.
    } else {
      setError('Invalid credentials'); // Set error message if credentials are invalid.
    }
  } catch (error) {
    setError('Invalid credentials'); // Handle errors from the request.
  }
};

/**
 * Handles input changes in the login form.
 * Updates the form data state as the user types in the input fields.
 *
 * @param {Object} e - The event object from the input field.
 * @param {Object} formData - The current state of the form data.
 * @param {Function} setFormData - Function to update the form data state.
 */
export const handleInputChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
