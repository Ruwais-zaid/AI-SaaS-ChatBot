import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState(null);
  const navigate  = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
      });

      if (response.ok) {
        setMessage('Registration successful!');
        navigate('/')
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('An error occurred during registration.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h2 className="text-5xl font-semibold text-white mb-6">Register</h2>
      <form
        onSubmit={handleRegister}
        className="bg-blue-900 p-8 rounded-lg shadow-md min-w-[40rem] space-y-6"
      >
        <div>
          <label className="block text-gray-300 mb-1 font-semibold text-lg">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-400 text-black focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 text-lg ">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-400 text-black font-semibold focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300  text-lg mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-400 text-black focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300  text-lg mb-1">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-2 rounded bg-gray-400  text-black focus:outline-none"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg text-lg  hover:bg-gray-800 transition"
        >
          Register
        </button>
        <a href="/login" className='text-center text-white mt-4  underline '>Already a account</a>
        {message && (
          <p className="text-center text-sm mt-4 text-gray-400">{message}</p>
        )}

      </form>
    </div>
  );
};

export default Register;
