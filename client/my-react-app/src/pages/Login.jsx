import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/v1/login', {
        email,
        password,
      });

      console.log(response.data);
      setMessage(response.data.message || 'Login successful');
      const authToken = response.data.access_token.split(' ')[1];
      console.log('Auth token stored:', authToken);
      localStorage.setItem('authToken', authToken);
      
      // Navigate after setting message
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      console.log(err);
      setMessage('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 sm:p-0">
      <div className="w-full max-w-lg bg-blue-500 rounded-lg shadow-lg p-6 space-y-6 sm:space-y-10">
        <h2 className="text-4xl font-bold text-center text-gray-900">Login</h2>

        {message && (
          <p className="text-center text-white bg-green-600 p-2 rounded">
            {message}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-black text-lg font-semibold p-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border text-[16px] border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black font-semibold text-lg p-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border text-[16px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold text-white bg-black rounded-md transition hover:bg-gray-900 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-900">
            Don’t have an account? <a href="/signup" className="text-black hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
