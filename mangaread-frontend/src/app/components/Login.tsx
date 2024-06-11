'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UploadManga from '../upload/page';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const router = useRouter();

  useEffect(() => {
    // Check if authToken is truthy and update isAuthenticated state accordingly
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, [authToken]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token); 
        console.log(data.token);
        router.push('/');
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgmain">
      <form onSubmit={handleSubmit} className="p-6 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-2 rounded-lg bg-gray-700 text-white"
            required
          />
        </div>
        <div className='mb-6'>
          <h3 className='text-s'>Don't have an account? <a href="/signup" className="text-blue-500 text-sm">Sign Up</a></h3>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
      </form>
      {/* Render UploadManga component if isAuthenticated is true */}
      {isAuthenticated && <UploadManga authToken={authToken} />} 
    </div>
  );
};

export default Login;
