'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../../../public/Designer__53_-photoaidcom-cropped-removebg-preview (2).png';
import { ModeToggle } from './Toggle';

const Navbar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsSignedIn(!!authToken);

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
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isSignedIn) {
      fetchUserData();
    }
  }, [isSignedIn]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsSignedIn(false);
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="dark:bg-bgmain bg-bgnav text-black dark:text-white p-4 shadow-lg sticky top-0 z-50">
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
            <span className="text-lg font-semibold text-black dark:text-white hidden md:block ml-2">
              Manga Sphere
            </span>
          </Link>

          {isSignedIn && (
            <>
              {pathname !== '/favourite' && (
                <Link
                  href="/favourite"
                  className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
                >
                  Favorites
                </Link>
              )}
              {pathname !== '/upload' && (
                <Link
                  href="/upload"
                  className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
                >
                  Upload
                </Link>
              )}
              {pathname !== '/all-mangas' && (
                <Link
                  href="/all-mangas"
                  className="text-sm hover:text-gray-300 transition duration-300 hidden md:block"
                >
                  Read
                </Link>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex md:justify-between items-center gap-8">
              <Link href="/profile">
                <div className="md:flex items-center gap-2">
                  {user && user.profilePicture ? (
                    <div className='rounded-full'>
                      <img
                        src={`http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}`}
                        alt="Profile"
                        width={100}
                        height={100}
                        className="rounded-full ml-44  border border-gray-700 "
                        style={{ borderRadius: '50%', height: '40px', width: '40px', objectFit: 'cover' }}
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
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 border border-black"
                >
                  Logout
                </button>
              </div>
              <div className='hidden md:block border border-gray-600 rounded-lg'>
              <ModeToggle/>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 hidden md:block border border-gray-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 hidden md:block border border-gray-900"
              >
                Sign Up
              </Link>
              <div className='border border-gray-900 rounded-lg'>
              <ModeToggle/>
              </div>
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
      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-bgmain transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none mb-4"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center mt-2">
            <Link
              href="/"
              className={`text-lg font-semibold hover:text-gray-300 transition duration-300 py-4 w-full text-center my-2 ${
                pathname === '/' ? 'bg-gray-700' : ''
              }`}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/favourite"
                  className={`text-lg font-semibold hover:text-gray-300 transition duration-300 py-4 w-full text-center mb-2 ${
                    pathname === '/favourite' ? 'bg-gray-700' : ''
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Favorites
                </Link>
                <Link
                  href="/upload"
                  className={`text-lg font-semibold hover:text-gray-300 transition duration-300 py-4 w-full text-center mb-2 ${
                    pathname === '/upload' ? 'bg-gray-700' : ''
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Upload
                </Link>
                <Link
                  href="/all-mangas"
                  className={`text-lg font-semibold hover:text-gray-300 transition duration-300 py-4 w-full text-center mb-4 ${
                    pathname === '/all-mangas' ? 'bg-gray-700' : ''
                  }`}
                  onClick={toggleMobileMenu}
                >
                  Read
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-4"
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
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 mt-2"
                  onClick={toggleMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
