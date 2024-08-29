import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import {
  fetchUserData,
  fetchUserSkills,
  handleEditClick,
  handleInputChange,
  handleSkillChange,
  addSkill,
  removeSkill,
  handleImageChange,
} from './settingsUtils';
import axios from '../../api/axios';

/**
 * SettingsPage component allows users to view and update their profile data and manage their skills.
 * It handles editing of user information, skill management, and photo upload functionality.
 */
const SettingsPage = () => {
  const { currentUser } = useUser(); // Retrieve the current user from context.
  const [userData, setUserData] = useState({}); // State to store user data.
  const [editingField, setEditingField] = useState(''); // State to track which field is being edited.
  const [skills, setSkills] = useState([]); // State to store the user's skills.
  const [newSkill, setNewSkill] = useState(''); // State to manage the new skill input.
  const [error, setError] = useState(null); // State to manage error messages.
  const [loading, setLoading] = useState(false); // State to manage loading status.

  /**
   * Fetch user data and skills when the component mounts.
   * Handles loading state and error management.
   */
  useEffect(() => {
    setLoading(true); // Start loading
    fetchUserData(currentUser.user_id, setUserData, setError).finally(() => setLoading(false));
    fetchUserSkills(currentUser.user_id, setSkills, setError);
  }, [currentUser.user_id]);

  /**
   * Handles photo upload and updates the user data with the new photo.
   * @param {Object} e - The event object from the file input.
   */
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('user_id', currentUser.user_id);

      try {
        const response = await axios.post('/upload-photo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          setUserData({ ...userData, photo: response.data.photo });
          setEditingField('');
        } else {
          setError('Failed to upload photo: ' + response.data.message);
        }
      } catch (err) {
        console.error('Error uploading photo:', err);
        setError('Error uploading photo: ' + err.message);
      }
    }
  };

  /**
   * Renders the field value appropriately, especially if the value is an object.
   * @param {any} value - The value to be rendered.
   * @returns {string} - Rendered field value.
   */
  const renderFieldValue = (value) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  };

  /**
   * Handles saving changes made to the user data.
   * Logic can be expanded based on requirements.
   */
  const handleSaveChanges = () => {
    // Logic to handle save changes if needed
    setEditingField('');
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {loading && <p>Loading...</p>} {/* Show loading state */}
      {error && <p className="error-message">{error}</p>} {/* Show error message if any */}

      {/* User Data Section */}
      <div className="settings-section">
        <h2 className="settings-subtitle">User Data</h2>
        <div className="settings-grid">
          {Object.entries(userData).map(([field, value]) => (
            field !== '_id' && field !== 'photo' && ( // Exclude 'photo' field from rendering
              <div key={field} className="settings-field-container">
                <div className="settings-field-title">
                  <h3>{field}</h3>
                  <button
                    onClick={() => handleEditClick(field, userData, setUserData, editingField, setEditingField, currentUser, setError)}
                    className="settings-button"
                  >
                    {editingField === field ? 'Done' : 'Edit'}
                  </button>
                </div>
                <div className="mt-2">
                  {editingField === field ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(e, field, userData, setUserData)}
                      className="settings-field-input"
                    />
                  ) : (
                    <p>{renderFieldValue(value)}</p>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div className="settings-section">
        <h2 className="settings-subtitle">Skills</h2>
        <div className="skills-container">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <p>{skill}</p>
              <button
                onClick={() => removeSkill(skill, setSkills, skills, currentUser, setError)}
                className="skill-button"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="add-skill-container">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => handleSkillChange(e, setNewSkill)}
              className="add-skill-input"
              placeholder="New Skill"
            />
            <button
              onClick={() => addSkill(newSkill, setSkills, skills, currentUser, setNewSkill, setError)}
              className="add-skill-button"
            >
              Add Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
