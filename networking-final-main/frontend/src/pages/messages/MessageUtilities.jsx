import axios from '../../api/axios';

/**
 * Fetches the list of friends for a given user and updates the state.
 * @param {string} userId - The ID of the user whose friends are to be fetched.
 * @param {Function} setFriends - Function to update the state with the fetched friends.
 */
export const fetchFriends = async (userId, setFriends) => {
  try {
    const response = await axios.post('/fetch-friends', { user_id: userId });
    setFriends(response.data.friends);
    console.log('Fetched friends:', response.data.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
  }
};

/**
 * Initializes the chat history for a user by setting an empty array in the state.
 * Optionally, you can fetch chat history from the server if needed.
 * @param {string} userId - The ID of the user whose chat history is being fetched.
 * @param {Function} setChatHistories - Function to update the state with the chat history.
 */
export const fetchChatHistory = async (userId, setChatHistories) => {
  setChatHistories((prev) => ({ ...prev, [userId]: [] }));
  // Fetch chat history from the server here if needed
};

/**
 * Appends a new message to the chat history for a specific user.
 * @param {string} userId - The ID of the user to whom the message is being sent.
 * @param {Object} messageData - The message data to be appended.
 * @param {Function} setChatHistories - Function to update the state with the new message.
 */
export const appendMessageToHistory = (userId, messageData, setChatHistories) => {
  setChatHistories(prev => ({
    ...prev,
    [userId]: [...(prev[userId] || []), messageData],
  }));
};

/**
 * Handles the sending of a message by the current user to the selected user.
 * It sends the message via WebSocket, appends it to the chat history, and clears the input field.
 * @param {Object} currentUser - The current user object.
 * @param {Object} selectedUser - The selected user object to whom the message is being sent.
 * @param {Function} sendMessage - Function to send the message via WebSocket.
 * @param {Function} appendMessageToHistory - Function to append the message to the chat history.
 * @param {Function} setChatHistories - Function to update the chat history state.
 */
export const handleSendMessage = (currentUser, selectedUser, sendMessage, appendMessageToHistory, setChatHistories) => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  const messageData = {
    sender_id: currentUser.user_id,
    receiver_id: selectedUser._id,
    message,
    sender: 'You',
  };
 
  sendMessage(JSON.stringify(messageData));
  appendMessageToHistory(selectedUser._id, messageData, setChatHistories);
  messageInput.value = '';
};

/**
 * Searches for users by their username and updates the search results state.
 * @param {string} searchUsername - The username to search for.
 * @param {Function} setSearchResults - Function to update the state with the search results.
 */
export const searchUsers = async (searchUsername, setSearchResults) => {
  try {
    const response = await axios.post('/search-users', { username: searchUsername });
    setSearchResults(response.data.users);
  } catch (error) {
    console.error('Error searching users:', error);
  }
};

/**
 * Starts a chat with the selected user by setting the selected user state and fetching the chat history if needed.
 * @param {Object} user - The user object with whom the chat is being started.
 * @param {Function} setSelectedUser - Function to set the selected user in the state.
 * @param {Function} fetchChatHistory - Function to fetch the chat history for the selected user.
 * @param {Function} setChatHistories - Function to update the chat histories state.
 * @param {Object} chatHistories - The current chat histories state.
 */
export const startChat = (user, setSelectedUser, fetchChatHistory, setChatHistories, chatHistories) => {
  setSelectedUser(user);

  // Ensure chatHistories is defined and contains the user ID
  if (!chatHistories || !chatHistories[user._id]) {
    fetchChatHistory(user._id, setChatHistories);
  } else {
    console.log('Chat history already exists:', chatHistories[user._id]);
  }
};

/**
 * Processes incoming WebSocket data and appends it to the chat history if it is from the selected user.
 * Handles both Blob and string data formats.
 * @param {Object} message - The WebSocket message object.
 * @param {Object} selectedUser - The selected user object.
 * @param {Object} currentUser - The current user object.
 * @param {Function} appendMessageToHistory - Function to append the message to the chat history.
 * @param {Function} setChatHistories - Function to update the chat histories state.
 */
export const processWebSocketData = (
  message,
  selectedUser,
  currentUser,
  appendMessageToHistory,
  setChatHistories
) => {
  // Check if the message data is a Blob
  if (message.data instanceof Blob) {
    const reader = new FileReader();
    reader.onload = function() {
      try {
        const textData = reader.result;
        const data = JSON.parse(textData);

        // Ensure data is from the selected user
        if (data.sender_id === selectedUser._id) {
          appendMessageToHistory(data.sender_id, data, setChatHistories);
          console.log('Message appended to history:', data);
        } else {
          console.warn('Received message from a different user:', data.sender_id);
        }
      } catch (error) {
        console.error('Error parsing message from Blob:', error);
      }
    };
    reader.readAsText(message.data);
  } else if (typeof message.data === 'string') {
    // If the data is a string, parse it directly
    try {
      const data = JSON.parse(message.data);

      if (data.sender_id === selectedUser._id) {
        appendMessageToHistory(data.sender_id, data, setChatHistories);
        console.log('Message appended to history:', data);
      } else {
        console.warn('Received message from a different user:', data.sender_id);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  } else {
    console.error('Unexpected WebSocket message format:', message.data);
  }
};
