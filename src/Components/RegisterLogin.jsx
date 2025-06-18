import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaMobileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegisterLogin = () => {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate("")

  const [registerData, setRegisterData] = useState({
    username: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(registerData));
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      alert(data.message || "Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        alert("Login successful");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Login error");
    }
    navigate("/dashboard")
  };

  return (
    <div className={`relative w-[750px] h-[450px] mx-auto my-20 bg-white border-2 border-black rounded-lg shadow-[0_0_20px_black] overflow-hidden transition-all duration-700 ${isActive ? 'register-active' : ''}`}>
      {/* Login Form */}
      <div className={`absolute top-0 ${isActive ? '-translate-x-full opacity-0 blur-sm' : 'translate-x-0 opacity-100 blur-0'} left-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all duration-700 `}>
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-semibold mb-6">Login</h2>
          <div className="mb-6 relative">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleLoginChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Email"
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleLoginChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Password"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer">Login</button>
          <div className="mt-4 text-sm text-center">
            <p>Don't have an account? <button type="button" className="text-blue-600 hover:underline cursor-pointer" onClick={() => setIsActive(true)}>Sign Up</button></p>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className={`absolute top-0 ${isActive ? 'translate-x-0 opacity-100 blur-0' : 'translate-x-full opacity-0 blur-sm'} right-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all duration-700`}>
        <form onSubmit={handleRegister}>
          <h2 className="text-2xl font-semibold mb-6">Register</h2>
          <div className="mb-6 relative">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                name="username" 
                required 
                onChange={handleRegisterChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Username"
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="number" 
                name="mobile" 
                required 
                onChange={handleRegisterChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Mobile"
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="email" 
                name="email" 
                required 
                onChange={handleRegisterChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Email"
              />
            </div>
          </div>
          <div className="mb-6 relative">
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="password" 
                name="password" 
                required 
                onChange={handleRegisterChange} 
                className="w-full border border-gray-300 pl-10 pr-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black" 
                placeholder="Password"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer">Register</button>
          <div className="mt-4 text-sm text-center">
            <p>Already have an account? <button type="button" className="text-blue-600 hover:underline cursor-pointer" onClick={() => setIsActive(false)}>Sign In</button></p>
          </div>
        </form>
      </div>

      {/* Info Panels */}
      <div className={`absolute right-0 top-0 w-1/2 h-full bg-black text-white flex flex-col justify-center px-10 text-left transition-all duration-700 ${isActive ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <h2 className="text-3xl font-bold mb-4">WELCOME BACK!</h2>
        <p className="text-sm">Login to continue your journey with us.</p>
      </div>

      <div className={`absolute left-0 top-0 w-1/2 h-full bg-black text-white flex flex-col justify-center px-10 text-left transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <h2 className="text-3xl font-bold mb-4">WELCOME!</h2>
        <p className="text-sm">Sign up and explore new opportunities with us.</p>
      </div>
    </div>
  );
};

export default RegisterLogin;