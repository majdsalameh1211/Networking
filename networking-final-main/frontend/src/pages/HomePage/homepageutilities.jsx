import axios from '../../api/axios';
import { Post } from '../../entities/Post';
import { Comment } from '../../entities/Comment';
import { Like } from '../../entities/Like';

/**
 * Fetches the username for a given user ID.
 * @param {string} userId - The ID of the user whose username is to be fetched.
 * @returns {Promise<string>} - A promise that resolves to the username, or 'Unknown User' if an error occurs.
 */
export const fetchUsername = async (userId) => {
    try {
        const response = await axios.get(`/user/${userId}`);
        return response.data.user_name;
    } catch (error) {
        console.error('Error fetching username:', error);
        return 'Unknown User';
    }
};

/**
 * Enriches posts data by adding the usernames and details of likes and comments.
 * @param {Array} posts - The list of posts to be enriched.
 * @param {Array} comments - The list of comments associated with the posts.
 * @param {Array} likes - The list of likes associated with the posts.
 * @returns {Promise<Array>} - A promise that resolves to an array of enriched posts.
 */
export const enrichPostsData = async (posts, comments, likes) => {
    const enrichedPosts = await Promise.all(posts.map(async (post) => {
        const username = await fetchUsername(post.user_id);
        const postLikes = await Promise.all(likes.filter(like => like.post_id === post._id.toString()).map(async (like) => {
            const likeUsername = await fetchUsername(like.user_id);
            return { ...like, username: likeUsername };
        }));
        const postComments = await Promise.all(comments.filter(comment => comment.post_id === post._id.toString()).map(async (comment) => {
            const commentUsername = await fetchUsername(comment.user_id);
            return {
                ...comment,
                username: commentUsername,
                comment_id: comment.comment_id,
            };
        }));

        return new Post(
            post.user_id,
            username,
            post._id.toString(),
            post.post_content,
            post.post_date,
            postLikes.map(like => new Like(like.post_id, like.user_id, like.username)),
            postComments
        );
    }));

    return enrichedPosts;
};

/**
 * Adds a new post to the user's feed.
 * @param {Object} currentUser - The current user object.
 * @param {string} postContent - The content of the post to be added.
 * @param {Array} posts - The list of existing posts.
 * @param {Function} setPosts - Function to update the list of posts.
 * @param {Function} setMessage - Function to update the message state.
 * @returns {Promise<boolean>} - A promise that resolves to true if the post was added successfully, or false if an error occurs.
 */
export const addPost = async (currentUser, postContent, posts, setPosts, setMessage) => {
    if (postContent.trim()) {
        const newPost = {
            user_id: currentUser.user_id,
            username: currentUser.user_name,
            post_content: postContent,
            post_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            likes_num: 0,
            comments_num: 0,
        };

        try {
            const response = await axios.post('/add-post', newPost);
            if (response.data.message === 'Post added successfully') {
                setMessage('Post added successfully');
                setPosts([
                    new Post(
                        currentUser.user_id,
                        currentUser.user_name,
                        response.data.post_id,
                        postContent,
                        new Date().toLocaleString(),
                        [],
                        []
                    ),
                    ...posts,
                ]);
                return true;
            } else {
                setMessage('Failed to add post');
                return false;
            }
        } catch (error) {
            console.error('Error adding post:', error);
            setMessage('Failed to add post');
            return false;
        }
    }
};

/**
 * Adds a like to a post.
 * @param {string} postId - The ID of the post to be liked.
 * @param {Object} currentUser - The current user object.
 * @param {Array} posts - The list of existing posts.
 * @param {Function} setPosts - Function to update the list of posts.
 */
export const addLike = async (postId, currentUser, posts, setPosts) => {
    try {
        const response = await axios.post('/add-like', { post_id: postId, user: currentUser });
        if (response.data.message.includes('successfully')) {
            const updatedPosts = posts.map(post => {
                if (post.post_id === postId) {
                    post.likes.push(new Like(postId, currentUser.user_id, currentUser.user_name));
                    post.likes_num += 1;
                }
                return post;
            });
            setPosts(updatedPosts);
        }
    } catch (error) {
        console.error('Error adding like:', error);
    }
};

/**
 * Fetches the latest data for a specific post.
 * @param {string} postId - The ID of the post to be updated.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated post data, or null if an error occurs.
 */
export const updatePost = async (postId) => {
    try {
        const response = await axios.get(`/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching updated post data:', error);
        return null;
    }
};

/**
 * Removes a like from a post.
 * @param {string} postId - The ID of the post to be unliked.
 * @param {Object} currentUser - The current user object.
 * @param {Array} posts - The list of existing posts.
 * @param {Function} setPosts - Function to update the list of posts.
 */
export const removeLike = async (postId, currentUser, posts, setPosts) => {
    try {
        const response = await axios.post('/remove-like', { post_id: postId, user: currentUser });
        if (response.data.message.includes('successfully')) {
            const updatedPost = await updatePost(postId);
            if (updatedPost) {
                const updatedPosts = posts.map(post =>
                    post.post_id === postId ? updatedPost : post
                );
                setPosts(updatedPosts);
            }
        }
    } catch (error) {
        console.error('Error removing like:', error);
    }
};

/**
 * Adds a comment to a post.
 * @param {string} postId - The ID of the post to be commented on.
 * @param {string} commentContent - The content of the comment.
 * @param {Object} currentUser - The current user object.
 * @param {Array} posts - The list of existing posts.
 * @param {Function} setPosts - Function to update the list of posts.
 * @param {Function} setMessage - Function to update the message state.
 */
export const addComment = async (postId, commentContent, currentUser, posts, setPosts, setMessage) => {
    const commentData = {
        post_id: postId,
        user_id: currentUser.user_id,
        comment_content: commentContent,
        comment_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
        const response = await axios.post('/add-comment', { ...commentData, user: currentUser });
        if (response.data.message === 'Comment added successfully') {
            const updatedPosts = posts.map(post => {
                if (post.post_id === postId) {
                    post.comments.push(new Comment(postId, currentUser.user_id, commentContent, `comment_${post.comments.length + 1}`, currentUser.user_name));
                    post.comments_num += 1;
                }
                return post;
            });
            setPosts(updatedPosts);
        } else {
            setMessage('Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        setMessage('Failed to add comment');
    }
};

/**
 * Deletes a comment from a post.
 * @param {string} postId - The ID of the post from which the comment is to be deleted.
 * @param {string} commentId - The ID of the comment to be deleted.
 * @param {string} userId - The ID of the user who made the comment.
 * @param {Array} posts - The list of existing posts.
 * @param {Function} setPosts - Function to update the list of posts.
 */
export const deleteComment = async (postId, commentId, userId, posts, setPosts) => {
    try {
        const response = await axios.post('/delete-comment', {
            post_id: postId,
            comment_id: commentId,
            user_id: userId,
        });

        if (response.data.message === 'Comment deleted successfully') {
            const updatedPost = await updatePost(postId);
            if (updatedPost) {
                const updatedPosts = posts.map(post =>
                    post.post_id === postId ? updatedPost : post
                );
                setPosts(updatedPosts);
            }
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};
