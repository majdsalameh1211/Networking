import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserDetails } from './profileUtils';
import './ProfilePage.css';

/**
 * ProfilePage component fetches and displays the details of a user's profile.
 * It uses the user ID from the URL parameters to fetch the user's data.
 */
function ProfilePage() {
  const { userId } = useParams(); // Retrieve the user ID from the URL parameters.
  const [user, setUser] = useState(null); // State to store the user details.
  const [error, setError] = useState(''); // State to handle and display errors.

  /**
   * Fetch user details when the component mounts or when the userId changes.
   */
  useEffect(() => {
    fetchUserDetails(userId, setUser, setError);
  }, [userId]);

  // Display error message if an error occurred while fetching user details.
  if (error) {
    return <div className="profile-page-error">{error}</div>;
  }

  // Display loading message while user details are being fetched.
  if (!user) {
    return <div className="profile-page-loading">Loading...</div>;
  }

  // Render the user's profile information.
  return (
    <div className="profile-page-container">
      <h1 className="profile-page-title">Profile Page</h1>
      {user.photo && (
        <img src={user.photo} alt={`${user.user_name}'s profile`} className="profile-page-photo" />
      )}
      <p className="profile-page-info"><strong>User Name:</strong> {user.user_name}</p>
      <p className="profile-page-info"><strong>First Name:</strong> {user.first_name}</p>
      <p className="profile-page-info"><strong>Last Name:</strong> {user.last_name}</p>
      <p className="profile-page-info"><strong>Email:</strong> {user.email}</p>
      <p className="profile-page-info"><strong>Phone Number:</strong> {user.phone_number}</p>
      <p className="profile-page-info"><strong>Education:</strong> {user.education}</p>
      <p className="profile-page-info"><strong>Gender:</strong> {user.gender}</p>
    </div>
  );
}

export default ProfilePage;
