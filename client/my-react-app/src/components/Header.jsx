import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Chat from './Chat';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isClearing, setIsClearing] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [times, setTimes] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const isLoggedIn = !!token;

  const fetchChatHistory = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/v1/get/send/chat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setChatHistory(data.chats);
        setTimes(data.timestamps && new Date(data.timestamps).toLocaleDateString())
      } else {
        console.error('Error fetching chat history:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchChatHistory();
    }
  }, [isLoggedIn]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setShowLogoutMessage(true);
    setIsSidebarOpen(false);
    setTimeout(() => {
      setShowLogoutMessage(false);
      navigate('/login');
    }, 2000);
  };

  // Start New Chat
  const handleNewChat = () => {
    setChatHistory([]);
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      navigate('/chat');
    }, 1000);
  };

  // Delete All Chat History
  const handleDeleteChat = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/delete/chat/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setChatHistory([]);
      } else {
        console.error('Error deleting chat:', await response.json());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="h-20 w-full">
        <div className="flex justify-between items-center p-6">
          <FaBars
            className="text-white text-3xl cursor-pointer"
            onClick={toggleSidebar}
          />
          <div className="flex justify-between items-center">
            <Link to="/">
              <img
                src="https://cdn.shopify.com/s/files/1/0403/5801/9230/t/11/assets/logo-animation-openai-08-Bqv_1250x.jpg?v=1681851367"
                alt="Logo"
                className="w-32 h-18"
              />
            </Link>
            <div className="flex gap-12">
              {isLoggedIn ? (
                <>
                  <button
                    className="text-white text-2xl bg-gray-700 h-12 w-28 rounded-lg"
                    onClick={handleNewChat}
                  >
                    New Chat
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white text-2xl bg-gray-700 h-12 w-28 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="text-white text-2xl bg-gray-700 h-12 w-28 rounded-lg">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="text-white text-2xl bg-gray-700 h-12 w-28 rounded-lg">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLogoutMessage && (
        <p className="text-red-500 font-bold text-center mt-4 text-4xl animate-pulse">
          Logout successful!
        </p>
      )}
      <Chat />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full min-w-[30rem] bg-black text-white transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-7 text-center">
          <h2 className="text-4xl font-light text-violet-400">CodeAI</h2>
          <button
            onClick={toggleSidebar}
            className="text-xl font-bold text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="flex justify-between p-4">
          <p className="text-3xl font-thin text-green-600">Delete All Response</p>
          <MdDelete
            className="text-red-500 cursor-pointer mt-2 text-2xl"
            onClick={handleDeleteChat}
          />
          <p className="text-lg font-thin text-white mt-2">
                     {times}
                    </p>
        </div>
        <div className="p-4 space-y-5 overflow-y-auto h-full">
          {isClearing ? (
            <p className="text-gray-500">Clearing chat history...</p>
          ) : isLoggedIn && chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className="p-2 bg-black rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-thin">
                      {chat.content && chat.role === 'user' ? chat.content : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chat history available.</p>
          )}
          
        </div>

      </div>
    </div>
  );
};

export default Header;
