'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface UserProfile {
  username: string;
  email: string;
  profilePicture?: string;
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
        console.log(token);
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
        console.log('Profile Image Path:', data.profilePicture); // Log profileImage
        console.log(data)
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
      console.log('Updated Profile:', updatedUser);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) return <div className='h-screen'>Loading...</div>;

  // Ensure the profile picture path is formatted correctly
  const profileImageUrl = user.profilePicture ? `http://localhost:5000/${user.profilePicture.replace(/\\/g, '/')}` : '/default-profile.png';
  console.log('Profile Image URL:', profileImageUrl); // Log the profile image URL

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 h-full mt-4">
        <div className="py-8">
          <h1 className="text-5xl font-bold text-gray-100 mb-12 text-center">User Profile</h1>
          <div className="flex flex-col items-center">
            <img 
              src={profileImageUrl} 
              alt={user.username} 
              className="w-32 h-32 rounded-full mb-4 object-cover" 
            />
            <div className="w-full md:w-1/2 bg-gray-800 p-8 rounded-lg shadow-md">
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
      <Footer />
    </div>
  );
};

export default ProfilePage;
