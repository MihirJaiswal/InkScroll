'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
        const userMangas = data.filter((manga: any) => manga.author.username === username);
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

  if (mangas.length === 0) {
    return <div>You don't have any uploaded manga.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Your Mangas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mangas.map((manga) => (
          <Link href={`/${manga.title}`} key={manga.title}>
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className='h-44'>
                <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="w-40 h-44 object-cover mb-2 rounded" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{manga.title}</h2>
                <p>Genre: {manga.genre}</p>
                <p>Updated At: {new Date(manga.updatedAt).toLocaleString()}</p>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Edit</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserMangaList;
