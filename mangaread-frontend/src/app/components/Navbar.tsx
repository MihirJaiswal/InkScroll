'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../../../public/Designer__53_-photoaidcom-cropped-removebg-preview (2).png';

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // State to hold user data

  useEffect(() => {
    // Check if user is signed in
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username')
    console.log(username)
    setIsSignedIn(!!authToken);

    // Fetch user data if signed in
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'x-auth-token': authToken || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData); // Set the entire user data
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error (e.g., redirect to login, clear auth tokens, etc.)
      }
    };

    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username')
    setIsSignedIn(false);
    // Optional: Redirect or reload to another page after logout
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-bgmain text-white p-4 shadow-lg">
      <nav className="flex justify-between items-center container mx-auto">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              className="w-10"
            />
            <span className="text-lg font-semibold text-white hidden md:block ml-2">
              Manga Sphere
            </span>
          </Link>

          {isSignedIn && (
            <>
              <Link
                href="/favourite"
                className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
              >
                Favorites
              </Link>
              <Link
                href="/upload"
                className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
              >
                Upload
              </Link>
              <Link
                href="/all-mangas"
                className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
              >
                Read
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex md:justify-between items-center gap-8">
              <Link href="/profile">
                <div className="md:flex items-center gap-2">
                  {user && user.profilePicture ? (
                    <div className='rounded-full '>
                    <img
                      src={`http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}`}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full ml-44"
                      style={{ borderRadius: '50%', height: '40px', width: '40px', objectFit: 'cover' }} // Apply border-radius: 50% inline
                    />
                  </div>
                  ) : (
                    <FaUserCircle className="text-3xl" />
                  )}
                </div>
              </Link>
              <div className='hidden md:flex'>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Logout
              </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 hidden md:block"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 hidden md:block"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMobileMenuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16m-7 6h7'
                }
              />
            </svg>
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col items-center mt-2">
            <Link
              href="/"
              className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2"
            >
              Home
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/mymangas"
                  className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2"
                >
                  My Manga
                </Link>
                <Link
                  href="/upload"
                  className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2"
                >
                  Upload
                </Link>
                <Link
                  href="/all-mangas"
                  className="text-sm font-semibold hover:text-gray-300 transition duration-300 py-2"
                >
                  Read
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2"
                >
                  Logout
                </button>
              </>
            )}
            {!isSignedIn && (
              <>
                <Link
                  href="/login"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
