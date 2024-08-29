import axios from '../../api/axios';

/**
 * Handles changes in form inputs and updates the formData state.
 * @param {Object} e - The event object from the input field.
 * @param {Object} formData - The current form data.
 * @param {Function} setFormData - Function to update the formData state.
 */
export const handleChange = (e, formData, setFormData) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

/**
 * Handles changes in the skill input field.
 * @param {Object} e - The event object from the skill input field.
 * @param {Function} setSkill - Function to update the skill state.
 */
export const handleSkillChange = (e, setSkill) => {
  setSkill(e.target.value);
};

/**
 * Adds a skill to the formData if it's not a duplicate.
 * @param {string} skill - The skill to be added.
 * @param {Object} formData - The current form data.
 * @param {Function} setFormData - Function to update the formData state.
 * @param {Function} setSkill - Function to reset the skill input field.
 * @param {Function} setError - Function to set an error message if the skill is a duplicate.
 */
export const addSkill = (skill, formData, setFormData, setSkill, setError) => {
  if (skill.trim() !== '' && !formData.skills.includes(skill.trim())) {
    setFormData({ ...formData, skills: [...formData.skills, skill.trim()] });
    setSkill('');
  } else if (formData.skills.includes(skill.trim())) {
    setError('Duplicate skill. Please add a different skill.');
  }
};

/**
 * Handles changes in the recovery questions and updates the formData state.
 * @param {Object} e - The event object from the recovery question input field.
 * @param {Object} formData - The current form data.
 * @param {Function} setFormData - Function to update the formData state.
 */
export const handleQuestionChange = (e, formData, setFormData) => {
  const { name, value } = e.target;
  if (name.startsWith('recovery_q1')) {
    setFormData({ ...formData, recovery_q1: { ...formData.recovery_q1, [name.split('.')[1]]: value } });
  } else if (name.startsWith('recovery_q2')) {
    setFormData({ ...formData, recovery_q2: { ...formData.recovery_q2, [name.split('.')[1]]: value } });
  }
};

/**
 * Validates the current step and moves to the next step in the registration process.
 * @param {number} step - The current step in the registration process.
 * @param {Function} setStep - Function to update the step state.
 * @param {Object} formData - The current form data.
 * @param {Function} setError - Function to set an error message if validation fails.
 */
export const handleNext = (step, setStep, formData, setError) => {
  if (step === 1 && formData.username && formData.first_name && formData.last_name && formData.gender && formData.email && formData.password && formData.phone_number && formData.education && formData.photo) {
    setStep(step + 1);
  } else if (step === 2) {
    setStep(step + 1);
  } else {
    setError('Please fill out all required fields');
  }
};

/**
 * Submits the registration data to the backend API and handles the response.
 * @param {Object} formData - The registration form data.
 * @param {Function} setCurrentUser - Function to set the current user in context after successful registration.
 * @param {Function} setSuccess - Function to set a success message upon successful registration.
 * @param {Function} setError - Function to set an error message if registration fails.
 * @param {Function} navigate - Function to navigate to the home page upon successful registration.
 */
export const handleRegister = async (formData, setCurrentUser, setSuccess, setError, navigate) => {
  if (formData.recovery_q1.question && formData.recovery_q1.answer && formData.recovery_q2.question && formData.recovery_q2.answer) {
    try {
      const response = await axios.post('/register', formData);
      setSuccess('Registration successful! You can now log in.');
      setError('');
      setCurrentUser(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('Error from backend:', error.response ? error.response.data : error.message);
      setError('Error registering user');
      setSuccess('');
    }
  } else {
    setError('Please fill out all required fields');
  }
};

/**
 * A list of predefined security questions for account recovery.
 */
export const questionOptions = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What was your favorite food as a child?",
  "What city were you born in?"
];
