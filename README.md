📌 Networking - Social Media Platform
Networking is a full-stack social media web application that allows users to register, post, like, comment, follow other users, and engage in peer-to-peer messaging.

🚀 Live Demo: Networking on Vercel

📢 Features
✅ User Authentication

Sign up using email and password.
Secure login system with password recovery via security questions.
✅ User Interaction

Create posts and share content.
Like and comment on posts.
Follow/unfollow other users.
✅ Messaging & Notifications

Real-time peer-to-peer messaging with WebSockets.
Live notifications for likes, comments, and follows.
✅ User Profile Management

Edit personal details and profile picture.
Search for and follow friends.
✅ Dark Mode & Responsive UI

Smooth dark mode toggle for better accessibility.
Fully responsive layout for desktop and mobile.
🛠 Tech Stack
Frontend
React.js (Next.js)
Tailwind CSS for styling
Axios for API calls
React Router for navigation
Backend
Node.js with Express.js
MongoDB as the database
WebSockets for real-time messaging
JWT Authentication
Deployment
Frontend: Vercel
Backend: [Vercel & MongoDB Atlas]


🚀 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/majdsalameh1211/web_final_M.M..git
cd web_final_M.M.

2️⃣ Install Dependencies
📌 For Frontend
cd frontend
npm install


📌 For Backend
cd backend
npm install

3️⃣ Environment Variables
Create a .env file inside the backend folder and add:
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

4️⃣ Run the Application
📌 Start the Backend
cd backend
npm start

📌 Start the Frontend
cd frontend
npm run dev


🎯 API Endpoints
Authentication
POST /register - Create a new user account.
POST /login - Authenticate users.
Posts
POST /add-post - Create a new post.
GET /fetch-posts - Retrieve posts from friends.
Likes & Comments
POST /add-like - Like a post.
POST /remove-like - Unlike a post.
POST /add-comment - Add a comment.
Messaging
POST /send-message - Send a direct message.
GET /fetch-messages - Retrieve chat messages.
