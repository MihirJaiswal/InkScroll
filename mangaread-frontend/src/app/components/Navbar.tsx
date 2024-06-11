'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsSignedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsSignedIn(false);
    window.location.reload();  // Refresh the page after logout
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-bgmain text-white p-4 shadow-lg ">
      <nav className="flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold hover:text-gray-300 transition duration-300 hidden md:block">Home</Link>
          {isSignedIn && (
            <>
              <Link href="/my-manga" className="text-sm font-semibold hover:text-gray-300 transition duration-300 hidden md:block">My Manga</Link>
              <Link href="/upload" className="text-sm font-semibold hover:text-gray-300 transition duration-300 hidden md:block">Upload</Link>
            </>
          )}
        </div>
        <div className="hidden md:flex">
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
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col items-center mt-2">
            <Link href="/" className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2">Home</Link>
            {isSignedIn && (
              <>
                <Link href="/my-manga" className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2">My Manga</Link>
                <Link href="/upload" className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2">Upload</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2">
                  Logout
                </button>
              </>
            )}
            {!isSignedIn && (
              <div className='flex justify-between items-center gap-4'>
                <Link href="/login" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
