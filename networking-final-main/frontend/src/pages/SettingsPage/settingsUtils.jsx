import axios from '../../api/axios';

/**
 * Fetches the user data from the server based on the provided user ID.
 * @param {string} userId - The ID of the user whose data is to be fetched.
 * @param {Function} setUserData - Function to update the user data state.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const fetchUserData = async (userId, setUserData, setError) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    setUserData(response.data);
  } catch (error) {
    setError('Error fetching user data');
    console.error('Error fetching user data:', error);
  }
};

/**
 * Fetches the user's skills from the server.
 * @param {string} userId - The ID of the user whose skills are to be fetched.
 * @param {Function} setSkills - Function to update the skills state.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const fetchUserSkills = async (userId, setSkills, setError) => {
  try {
    const response = await axios.post('/fetch-skills', { user_id: userId });
    setSkills(response.data.skills);
  } catch (error) {
    setError('Error fetching user skills');
    console.error('Error fetching user skills:', error);
  }
};

/**
 * Handles the edit button click for a user data field.
 * If the field is being edited, it will update the user data on the server.
 * If the field is not being edited, it will enter edit mode.
 * @param {string} field - The field to be edited.
 * @param {Object} userData - The current user data.
 * @param {Function} setUserData - Function to update the user data state.
 * @param {string} editingField - The current field being edited.
 * @param {Function} setEditingField - Function to update the editingField state.
 * @param {Object} currentUser - The current logged-in user.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const handleEditClick = async (field, userData, setUserData, editingField, setEditingField, currentUser, setError) => {
  if (editingField === field) {
    try {
      let valueToUpdate = userData[field];

      // Check if the field being edited is the photo
      if (field === 'photo' && valueToUpdate instanceof File) {
        // Prepare form data for the image upload
        const formData = new FormData();
        formData.append('photo', valueToUpdate);
        formData.append('user_id', currentUser.user_id);

        // Upload the image to the server
        const uploadResponse = await axios.post('/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Use the URL of the uploaded image as the new value to update
        valueToUpdate = uploadResponse.data.photoUrl;
      }

      // Update the user data with the new value (photo URL or other field value)
      const response = await axios.post('/update-user', {
        user_id: currentUser.user_id,
        field,
        value: valueToUpdate,
      });

      if (response.data.success) {
        setUserData({ ...userData, [field]: response.data.value });
        setEditingField('');  // End editing mode after successful update
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Error updating user data');
      console.error('Error updating user data:', error);
    }
  } else {
    setEditingField(field);  // Enter editing mode
  }
};

/**
 * Handles changes in input fields and updates the user data state.
 * @param {Object} e - The event object from the input field.
 * @param {string} field - The field being edited.
 * @param {Object} userData - The current user data.
 * @param {Function} setUserData - Function to update the user data state.
 */
export const handleInputChange = (e, field, userData, setUserData) => {
  setUserData({ ...userData, [field]: e.target.value });
};

/**
 * Handles changes in the skill input field.
 * @param {Object} e - The event object from the skill input field.
 * @param {Function} setNewSkill - Function to update the new skill state.
 */
export const handleSkillChange = (e, setNewSkill) => {
  setNewSkill(e.target.value);
};

/**
 * Adds a new skill to the user's skill list on the server.
 * @param {string} newSkill - The new skill to be added.
 * @param {Function} setSkills - Function to update the skills state.
 * @param {Array} skills - The current list of skills.
 * @param {Object} currentUser - The current logged-in user.
 * @param {Function} setNewSkill - Function to reset the new skill input field.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const addSkill = async (newSkill, setSkills, skills, currentUser, setNewSkill, setError) => {
  if (newSkill.trim() !== '') {
    try {
      await axios.post('/add-skill', { user_id: currentUser.user_id, skill: newSkill });
      setSkills([...skills, newSkill]);
      setNewSkill('');
    } catch (error) {
      setError('Error adding skill');
      console.error('Error adding skill:', error);
    }
  }
};

/**
 * Removes a skill from the user's skill list on the server.
 * @param {string} skillToRemove - The skill to be removed.
 * @param {Function} setSkills - Function to update the skills state.
 * @param {Array} skills - The current list of skills.
 * @param {Object} currentUser - The current logged-in user.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const removeSkill = async (skillToRemove, setSkills, skills, currentUser, setError) => {
  try {
    await axios.post('/remove-skill', { user_id: currentUser.user_id, skill: skillToRemove });
    setSkills(skills.filter(skill => skill !== skillToRemove));
  } catch (error) {
    setError('Error removing skill');
    console.error('Error removing skill:', error);
  }
};

/**
 * Handles the image change event and updates the user's photo on the server.
 * @param {Object} event - The event object from the file input.
 * @param {string} userId - The ID of the user whose photo is to be updated.
 * @param {Function} setUserData - Function to update the user data state.
 * @param {Function} setError - Function to set an error message in case of failure.
 */
export const handleImageChange = async (event, userId, setUserData, setError) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    if (file.size <= 2 * 1024 * 1024) { // Check if file size is less than 2MB
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
          const response = await axios.post('/update-photo', {
            user_id: userId,
            photo: base64Image // Send the base64 string
          });

          if (response.data.success) {
            setUserData(prevUserData => ({
              ...prevUserData,
              photo: response.data.photo,
            }));
            setError(null);
          } else {
            setError(response.data.message);
          }
        } catch (err) {
          setError('Error updating user photo');
          console.error('Error updating user photo:', err);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError('File size should be less than 2MB');
    }
  } else {
    setError('Please select a valid image file');
  }
};
