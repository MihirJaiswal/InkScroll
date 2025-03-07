'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import logo from '../../public/logo.png'
import Image from 'next/image';
import bg1 from '../../public/bg.jpg'
import bg2 from '../../public/bg2.jpg'

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
      <div className="absolute inset-0 bg-cover bg-center opacity-20 h-full -z-30" style={{ background: `url('/bg.jpg')`}}></div>
        <div className="relative max-w-md w-full mx-auto p-8 md:p-10 bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 border border-gray-100">
          <div className="flex flex-col items-center justify-center mb-8">
            <Image 
            src={logo}
             alt="Logo" 
             width={100}
             height={100}
             className="w-24 mb-4" /> {/* Adjust the width and height as needed */}
            <h1 className="text-2xl font-bold text-white font-sans">InkScroll</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-200 dark:text-gray-400 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg dark:bg-gray-700 bg-gray-900 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-200 dark:text-gray-400 mb-2" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-2 rounded-lg dark:bg-gray-700 bg-gray-900 text-white"
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
      <div className="w-full hidden md:block relative mx-16 mt-2" style={{ height: "78vh", width:"50vw", clipPath: "polygon(15% 0, 100% 0%, 100% 52%, 74% 52%, 75% 100%, 51% 50%, 17% 50%)" }}>
        <div className="absolute inset-0 bg-contain bg-center" style={{ background: `url('/bg2.jpg')` }}></div>
      </div>
    </div>
  );
};

export default Login;
