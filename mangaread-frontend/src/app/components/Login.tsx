'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

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
        localStorage.setItem('authToken', data.token); // Store the token in local storage
        localStorage.setItem('username', data.username);
        console.log(data.token);
        console.log(data.username);
        router.push('/'); // Redirect to the upload page
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 mt-20" style={{ background: `url('https://i.ibb.co/cCWJYC4/bg.jpg')`}}></div>
        <div className="relative max-w-md w-full mx-auto p-8 md:p-16 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 border border-gray-100">
          <div className="flex flex-col items-center justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="mr-2 w-8 h-8" /> {/* Adjust the width and height as needed */}
            <h1 className="text-2xl font-bold text-white">Your Website Name</h1>
          </div>
          <form onSubmit={handleSubmit}>
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
            <div className="mb-6">
              <h3 className="text-s">Don't have an account? <a href="/signup" className="text-blue-500 text-sm">Sign Up</a></h3>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
          </form>
        </div>
      </div>
      <div className="w-full hidden md:block relative mx-16 mt-2" style={{ height: "90vh", width:"50vw", clipPath: "polygon(15% 0, 100% 0%, 100% 52%, 74% 52%, 75% 100%, 51% 50%, 17% 50%)" }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ background: `url('https://i.ibb.co/cCWJYC4/bg.jpg')` }}></div>
      </div>
    </div>
  );
};

export default Login;
