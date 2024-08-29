import axios from '../../../api/axios';

/**
 * Fetches security questions based on the provided email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object>} - A promise that resolves with an object containing the security questions or an error.
 */
export const fetchSecurityQuestions = async (email) => {
  try {
    const response = await axios.post('/forgot-password', { email });
    if (response.data.questions) {
      return { questions: response.data.questions, error: null };
    } else {
      return { questions: null, error: 'Email not found.' };
    }
  } catch (error) {
    return { questions: null, error: 'Error retrieving recovery questions.' };
  }
};

/**
 * Verifies the answers to the security questions.
 * @param {string} email - The email address of the user.
 * @param {Object} answers - The user's answers to the security questions.
 * @returns {Promise<Object>} - A promise that resolves with an object indicating if the answers are correct or an error.
 */
export const verifyAnswers = async (email, answers) => {
  try {
    const response = await axios.post('/verify-answers', { email, answers });
    if (response.data.correct) {
      return { correct: true, error: null };
    } else {
      return { correct: false, error: 'Incorrect answers. Please try again.' };
    }
  } catch (error) {
    return { correct: false, error: 'Error verifying answers.' };
  }
};
