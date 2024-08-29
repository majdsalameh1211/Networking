import React, { useState, useEffect } from 'react';
import { 
    enrichPostsData, 
    addPost as addPostUtility,
    addLike,
    removeLike,
    addComment
} from './homepageutilities.jsx';
import CommentsSidebar from '../CommentSidebar/CommentsSidebar.jsx';
import { useUser } from '../UserContext.jsx';
import axios from '../../api/axios.jsx';

/**
 * HomePage component displays a user's professional network feed where they can view, like, comment on posts,
 * and add new posts. It also supports dark mode and infinite scrolling to load more posts.
 */
function HomePage() {
    const { currentUser } = useUser(); // Retrieve the current user from the user context.
    const [posts, setPosts] = useState([]); // State to store the posts displayed on the homepage.
    const [postContent, setPostContent] = useState(''); // State to manage the content of the new post input field.
    const [showSidebar, setShowSidebar] = useState(false); // State to control the visibility of the comments/likes sidebar.
    const [sidebarContent, setSidebarContent] = useState([]); // State to store the content to be displayed in the sidebar.
    const [sidebarTitle, setSidebarTitle] = useState(''); // State to manage the title of the sidebar (e.g., "Comments" or "Likes").
    const [message, setMessage] = useState(''); // State to display success or error messages.
    const [darkMode, setDarkMode] = useState(false); // State to manage dark mode theme.
    const [commentContents, setCommentContents] = useState({}); // State to manage the content of comment input fields for each post.
    const [likedPosts, setLikedPosts] = useState({}); // State to track which posts have been liked by the current user.
    const [skip, setSkip] = useState(0); // Track number of posts already loaded.
    const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts to load.

    const limit = 5; // Number of posts to fetch per request.

    /**
     * Load the theme (dark mode or light mode) from localStorage on component mount.
     */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    /**
     * Fetch posts data from the server when the component mounts or when the current user changes.
     */
    useEffect(() => {
        fetchPosts();
    }, [currentUser]);

    /**
     * Fetch posts from the server and enrich them with comments and likes data.
     */
    const fetchPosts = async () => {
        if (!hasMorePosts) return;

        try {
            const response = await axios.get('/fetch-data', {
                params: {
                    userId: currentUser.user_id,
                    limit,
                    skip
                }
            });

            const { posts, comments, likes } = response.data;
            const enrichedPosts = await enrichPostsData(posts, comments, likes);
            setPosts(prevPosts => [...prevPosts, ...enrichedPosts]);

            // Update likedPosts state based on initial data
            const userLikes = likes.reduce((acc, like) => {
                if (like.user === currentUser.user_id) {
                    acc[like.post_id] = true;
                }
                return acc;
            }, {});
            setLikedPosts(userLikes);

            if (posts.length < limit) {
                setHasMorePosts(false); // No more posts to load
            }

            setSkip(prevSkip => prevSkip + limit);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    /**
     * Add a new post to the feed.
     */
    const addPost = async () => {
        const success = await addPostUtility(currentUser, postContent, posts, setPosts, setMessage);
        if (success) {
            setPostContent(''); // Clear the post content input field after successful post.
        }
    };

    /**
     * Toggle the like status of a post.
     * @param {string} postId - The ID of the post to like/unlike.
     */
    const handleLikeToggle = async (postId) => {
        if (likedPosts[postId]) {
            await removeLike(postId, currentUser, posts, setPosts);
            setLikedPosts(prev => ({ ...prev, [postId]: false }));
        } else {
            await addLike(postId, currentUser, posts, setPosts);
            setLikedPosts(prev => ({ ...prev, [postId]: true }));
        }
    };

    /**
     * Add a comment to a post.
     * @param {string} postId - The ID of the post to comment on.
     */
    const handleAddComment = async (postId) => {
        if (commentContents[postId]?.trim()) {
            await addComment(postId, commentContents[postId], currentUser, posts, setPosts);
            setCommentContents(prev => ({ ...prev, [postId]: '' })); // Clear the comment input field after successful comment.
        }
    };

    /**
     * Handle changes in the comment input field for a specific post.
     * @param {string} postId - The ID of the post being commented on.
     * @param {string} content - The content of the comment.
     */
    const handleCommentChange = (postId, content) => {
        setCommentContents(prev => ({ ...prev, [postId]: content }));
    };

    /**
     * Show the comments sidebar with the comments of a specific post.
     * @param {Array} comments - The list of comments to display in the sidebar.
     */
    const showComments = (comments) => {
        setSidebarContent(comments);
        setSidebarTitle('Comments');
        setShowSidebar(true);
    };

    /**
     * Show the likes sidebar with the likes of a specific post.
     * @param {Array} likes - The list of likes to display in the sidebar.
     */
    const showLikes = (likes) => {
        setSidebarContent(likes);
        setSidebarTitle('Likes');
        setShowSidebar(true);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <h1 className="title">Welcome to Your Professional Network</h1>

            <div>
                {message && <p>{message}</p>}
                <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="What's on your mind?"
                />
                <button
                    onClick={addPost}
                    className="button bg-blue-600 text-white mt-2"
                >
                    Post
                </button>
            </div>
            <br></br>

            <div className="space-y-4">
                {posts.map(post => (
                    <div
                        key={post.post_id}
                        className={`post-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
                    >
                        <h2 className="post-title">{post.username}</h2>
                        <p className="post-content">{post.post_content}</p>
                        <div className="flex flex-wrap space-x-4">
                            <span
                                onClick={() => showLikes(post.likes)}
                                className="cursor-pointer text-blue-500 hover:underline"
                            >
                                Likes: {post.likes.length}
                            </span>
                            <span
                                onClick={() => showComments(post.comments)}
                                className="cursor-pointer text-blue-500 hover:underline"
                            >
                                Comments: {post.comments.length}
                            </span>
                        </div>
                        <div className="flex flex-col mt-4 space-y-4 items-start">
                            <div className="flex-grow w-full">
                                <textarea
                                    value={commentContents[post.post_id] || ''}
                                    onChange={(e) => handleCommentChange(post.post_id, e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-300 ease-in-out"
                                    placeholder="Add a comment..."
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleLikeToggle(post.post_id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
                                >
                                    {likedPosts[post.post_id] ? 'Unlike' : 'Like'}
                                </button>
                                <button
                                    onClick={() => handleAddComment(post.post_id)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
                                >
                                    Comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMorePosts && (
                <button onClick={fetchPosts} className="load-more-button mt-4">
                    Load More
                </button>
            )}

            {showSidebar && (
                <CommentsSidebar
                    title={sidebarTitle}
                    content={sidebarContent}
                    onClose={() => setShowSidebar(false)}
                />
            )}
        </div>
    );
}

export default HomePage;
