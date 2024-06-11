'use client'
import React, { useState, useEffect } from 'react';

const UserMangaList: React.FC = () => {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    setAuthor(username || '');

    const fetchMangas = async () => {
      try {
        if (!authToken || !username) {
          throw new Error('Authentication token or username not found');
        }

        const response = await fetch('http://localhost:5000/api/mangas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': authToken,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch mangas');
        }

        const data = await response.json();
        const userMangas = data.filter((manga : any) => manga.author.username === username);
        setMangas(userMangas);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Your Mangas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mangas.map((manga) => (
          <div key={manga.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{manga.title}</h2>
            <p>{manga.description}</p>
            <p>Genre: {manga.genre}</p>
            <p>Updated At: {new Date(manga.updatedAt).toLocaleString()}</p>
            <img src={manga.coverImage} alt={manga.title} className="w-full h-40 object-cover mb-2 rounded" />
            {/* Render other manga details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMangaList;
