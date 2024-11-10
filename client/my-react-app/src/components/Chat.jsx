import React, { useState, useEffect } from 'react';
import { IoSendOutline } from "react-icons/io5";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');
      setLoading(true);
      setError(''); 

      const token = localStorage.getItem('authToken'); 

      if (!token) {
        setError('You are not authorized. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/v1/new/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        if (response.ok) {
          const assistantMessage = { text: data.chatResponse, sender: 'assistant' };
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } else {
          const errorMessage = { text: "Something went wrong. Please try again.", sender: 'assistant' };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          setError('Failed to send message, please try again later.');
        }
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { text: "Something went wrong. Please try again.", sender: 'assistant' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white p-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin animate-pulse mb-5 md:mb-10">
        What Can I Help You With?
      </h1>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-lg font-semibold mb-4">
          {error}
        </div>
      )}

      {/* Chat Container */}
      <div className="flex flex-col max-w-6xl w-full h-[70vh] bg-gray-900 rounded-lg ">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 font-semibold text-lg text-center">
              Start a conversation...
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg w-fit max-w-[70%] ${
                  msg.sender === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-600 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input Area (Fixed at Bottom) */}
        <div className="flex items-center p-4 border-t border-gray-800 bg-gray-900 sticky bottom-0">
          <input
            type="text"
            className="w-full p-3 rounded-lg text-[1.50rem] bg-gray-900 text-white outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-3 p-4 rounded-full bg-black text-white"
            disabled={loading}
          >
            <IoSendOutline className="text-[2rem]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
