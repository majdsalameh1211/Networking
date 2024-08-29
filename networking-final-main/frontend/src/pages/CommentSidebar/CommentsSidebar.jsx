import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './CommentsSidebar.css';

/**
 * CommentsSidebar component displays a sidebar with enriched content, such as comments or likes,
 * with usernames fetched from the server.
 *
 * @param {string} title - The title of the sidebar (e.g., "Comments" or "Likes").
 * @param {Array} content - The content to be displayed in the sidebar, typically an array of comments or likes.
 * @param {function} onClose - Function to be called when the sidebar is closed.
 */
const CommentsSidebar = ({ title, content, onClose }) => {
  const [enrichedContent, setEnrichedContent] = useState([]); // State to hold enriched content with usernames.

  useEffect(() => {
    console.log(content);

    /**
     * Fetch the username for a given userId.
     *
     * @param {string} userId - The ID of the user whose username is to be fetched.
     * @returns {Promise<string>} - A promise that resolves to the username.
     */
    const fetchUsername = async (userId) => {
      try {
        const response = await axios.get(`/user/${userId}`);
        return response.data.user_name;
      } catch (error) {
        console.error('Error fetching username:', error);
        return 'Unknown User';
      }
    };

    /**
     * Enrich the content by fetching usernames for each item in the content array.
     */
    const enrichContent = async () => {
      const enriched = await Promise.all(
        content.map(async (item) => {
          let username;

          if (title === 'Comments') { // Fetch username based on the title.
            username = await fetchUsername(item.user_id);
          } else {
            username = await fetchUsername(item.user);
          }

          return { ...item, username }; // Return the enriched item with the username added.
        })
      );
      setEnrichedContent(enriched); // Update the state with the enriched content.
    };

    enrichContent(); // Call the function to start enriching the content.
  }, [content, title]); // Effect dependency array includes content and title.

  return (
    <div className="sidebar-overlay">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2 className="sidebar-title">{title}</h2>
          <button onClick={onClose} className="sidebar-close-button">Close</button>
        </div>
        <div className="sidebar-content">
          {enrichedContent.map((item, index) => (
            <div key={index} className="sidebar-item">
              <strong>{item.username}:</strong> {item.comment_content || 'Liked'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsSidebar;
