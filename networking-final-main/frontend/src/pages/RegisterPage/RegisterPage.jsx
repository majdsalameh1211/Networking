import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import {
  handleChange,
  handleSkillChange,
  addSkill,
  handleQuestionChange,
  handleNext,
  handleRegister,
  questionOptions,
} from './registerUtils';
import Webcam from 'react-webcam';

/**
 * RegisterPage component handles the user registration process across multiple steps.
 * It collects user information, including skills and recovery questions, and optionally captures a photo via webcam.
 */
const RegisterPage = () => {
  const [step, setStep] = useState(1); // State to manage the current step of the registration process.
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    password: '',
    phone_number: '',
    education: '',
    photo: '',
    skills: [],
    recovery_q1: { question: '', answer: '' },
    recovery_q2: { question: '', answer: '' }
  }); // State to manage the registration form data.
  const [skill, setSkill] = useState(''); // State to manage the skill input field.
  const [error, setError] = useState(''); // State to handle and display errors.
  const [success, setSuccess] = useState(''); // State to handle and display success messages.
  const [usingWebcam, setUsingWebcam] = useState(false); // State to toggle between webcam capture and file upload for photos.
  const webcamRef = useRef(null); // Reference to the webcam component.
  const navigate = useNavigate(); // Hook to navigate between routes.
  const { setCurrentUser } = useUser(); // Hook to set the current user in context after registration.

  /**
   * Handle image upload from file input.
   * @param {Object} e - The event object from the file input.
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, photo: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handle image capture from the webcam.
   */
  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, photo: imageSrc });
    setUsingWebcam(false); // Switch back to file upload after capturing the image.
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Register</h1>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form>
            <div className="register-field">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Gender</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={(e) => handleChange(e, formData, setFormData)}
                required
              />
            </div>
            <div className="register-field">
              <label>Photo</label>
              {usingWebcam ? (
                <div>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                  />
                  <button type="button" onClick={handleCapture} className="capture-button">
                    Capture Photo
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <button
                    type="button"
                    onClick={() => setUsingWebcam(true)}
                    className="webcam-button"
                  >
                    Use Webcam
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleNext(step, setStep, formData, setError)}
              className="register-button"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Add Skills */}
        {step === 2 && (
          <div>
            <h2 className="register-title">Your Skills</h2>
            <table className="skills-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.skills.map((skill, index) => (
                  <tr key={index}>
                    <td>{skill}</td>
                    <td></td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(e, setSkill)}
                      placeholder="Skill"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => addSkill(skill, formData, setFormData, setSkill, setError)}
                      className="add-skill-button"
                    >
                      Add Skill
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => handleNext(step, setStep, formData, setError)}
              className="register-button"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 3: Set Recovery Questions */}
        {step === 3 && (
          <div>
            <h2 className="register-title">Recovery Questions</h2>
            <div className="register-field">
              <label>Question 1</label>
              <select
                name="recovery_q1.question"
                value={formData.recovery_q1.question}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
              >
                <option value="" disabled>Select a question</option>
                {questionOptions.filter(q => q !== formData.recovery_q2.question).map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                name="recovery_q1.answer"
                value={formData.recovery_q1.answer}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
                placeholder="Answer"
                required
              />
            </div>
            <div className="register-field">
              <label>Question 2</label>
              <select
                name="recovery_q2.question"
                value={formData.recovery_q2.question}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
              >
                <option value="" disabled>Select a question</option>
                {questionOptions.filter(q => q !== formData.recovery_q1.question).map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              <input
                type="text"
                name="recovery_q2.answer"
                value={formData.recovery_q2.answer}
                onChange={(e) => handleQuestionChange(e, formData, setFormData)}
                placeholder="Answer"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleRegister(formData, setCurrentUser, setSuccess, setError, navigate)}
              className="register-button"
            >
              Finish Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;