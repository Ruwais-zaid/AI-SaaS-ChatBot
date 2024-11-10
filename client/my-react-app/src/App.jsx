import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx'
import Header from './components/Header.jsx';
import Register from './pages/Regsiter.jsx'
import NewChat from './components/NewChat.jsx';


const App = () => {
  ;
  return (
    <div className="bg-black min-h-screen w-full">
      <Router>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/chat" element={<NewChat/>}/>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
