'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../public/Designer__53_-photoaidcom-cropped-removebg-preview (2).png'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setAuthToken(data.token);
        router.push('/');
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="py-28 flex items-center justify-center relative p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ background: `url('https://i.ibb.co/cCWJYC4/bg.jpg')` }}></div>
      <div className="relative z-10 bg-black p-8 rounded-lg shadow-lg max-w-md w-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100">
      <div className="flex flex-col items-center justify-center mb-8">
            <Image 
            src={logo}
             alt="Logo" 
             width={100}
             height={100}
             className="mr-2 w-16" /> {/* Adjust the width and height as needed */}
          </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
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
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">Sign Up</button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
