'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsSignedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsSignedIn(false);
  };

  return (
    <div className="bg-bgmain text-white p-4 shadow-lg">
      <nav className="flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold hover:text-gray-300 transition duration-300">Home</Link>
          <Link href="/latest" className="text-sm font-semibold hover:text-gray-300 transition duration-300">Read</Link>
          {isSignedIn && (
            <>
              <Link href="/my-manga" className="text-sm font-semibold hover:text-gray-300 transition duration-300">My Manga</Link>
              <Link href="/upload" className="text-sm font-semibold hover:text-gray-300 transition duration-300">Upload</Link>
            </>
          )}
        </div>
        <div>
          {isSignedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Login
              </Link>
              <Link href="/signup" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
