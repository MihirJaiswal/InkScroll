'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserMangaList from './MyManga';

interface UserProfile {
  username: string;
  email: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
  mangasUploaded: number;
}  

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'x-auth-token': token ?? "",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'x-auth-token': token ?? "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div className='h-screen'>Loading...</div>;

  const profileImageUrl = user.profilePicture ? `http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}` : '/default-profile.png';

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 h-full mt-4">
        <div className="py-8">
          <h1 className="text-5xl font-bold text-gray-100 mb-12 text-center">User Profile</h1>
          <div className="flex flex-col md:flex-row justify-between items-center md:mt-16 mb-12">
            <div className='w-full flex flex-col items-center my-8'>
              <img 
                src={profileImageUrl} 
                alt={user.username} 
                className="w-32 md:w-56 md:h-56 h-32 rounded-full mb-4 object-cover" 
              />
              <div className="text-center">
                <p className="text-white text-lg">{user.username}</p>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <div className="mt-4 flex space-x-8">
                <div className="text-center">
                  <p className="text-white text-lg font-semibold">{user.followersCount}</p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-lg font-semibold">{user.followingCount}</p>
                  <p className="text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-white text-lg font-semibold">{user.mangasUploaded}</p>
                  <p className="text-gray-400">Mangas Uploaded</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-900 p-8 rounded-2xl shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-500">
              <div className="mb-4">
                <label className="block text-white mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Profile Image</label>
                <input 
                  type="file" 
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  onChange={handleImageChange}
                />
              </div>
              <button 
                onClick={handleUpdateProfile} 
                className="w-full p-2 mt-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <UserMangaList/>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
