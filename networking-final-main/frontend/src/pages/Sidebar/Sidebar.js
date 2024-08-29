import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';

/**
 * Sidebar component provides navigation and theme toggling functionality.
 * It displays different navigation links and allows the user to switch between light and dark modes.
 * The sidebar can also be toggled open or closed on smaller screens.
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { currentUser, setCurrentUser } = useUser(); // Access current user and function to set current user from context.
    const navigate = useNavigate(); // Hook to navigate between routes.
    const location = useLocation(); // Hook to access the current route.

    // Dark mode state
    const [darkMode, setDarkMode] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
            document.documentElement.classList.add(savedTheme);
        }
    }, []);

    /**
     * Toggles the dark mode state and updates localStorage with the current theme.
     */
    const toggleDarkMode = () => {
        const newTheme = darkMode ? 'light' : 'dark';
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', newTheme);
    };

    /**
     * Handles user logout by clearing the current user and navigating to the login page.
     */
    const handleLogout = () => {
        setCurrentUser(null);
        navigate('/login');
    };

    // Return null if no current user is found (user is not logged in).
    if (!currentUser) {
        return null;
    }

    return (
        <>
            {/* Overlay for sidebar when open on smaller screens */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar component */}
            <div
                className={`fixed lg:static inset-y-0 left-0 transform lg:transform-none transition-transform duration-200 ease-in-out bg-gray-800 text-white w-64 p-6 flex flex-col z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Section */}
                <div className="mb-6 flex justify-between items-center">
                    <img src="/logo.png" alt="Logo" className="w-full h-auto" />
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow">
                    <Link
                        to="/home"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/home' ? 'bg-gray-700' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to={`/profile/${currentUser.user_id}`}
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === `/profile/${currentUser.user_id}` ? 'bg-gray-700' : ''}`}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/settings"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/settings' ? 'bg-gray-700' : ''}`}
                    >
                        Settings
                    </Link>
                    <Link
                        to="/notifications"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/notifications' ? 'bg-gray-700' : ''}`}
                    >
                        Notifications
                    </Link>
                    <Link
                        to="/messages"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/messages' ? 'bg-gray-700' : ''}`}
                    >
                        Messages
                    </Link>
                    <Link
                        to="/friends"
                        className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${location.pathname === '/friends' ? 'bg-gray-700' : ''}`}
                    >
                        Friends
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                    >
                        Logout
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`mt-auto px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                            darkMode
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
