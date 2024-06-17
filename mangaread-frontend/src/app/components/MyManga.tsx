'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UserMangaList: React.FC = () => {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [author, setAuthor] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const router = useRouter();

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
        router.push('/');
      }
    };

    fetchMangas();
  }, []);

  const handleDelete = async (mangaId: string) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/mangas/${mangaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': authToken ?? '',  
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete manga');
      }

      setMangas(mangas.filter((manga) => manga._id !== mangaId));
      setShowModal(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const openModal = (manga: any) => {
    setSelectedManga(manga);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedManga(null);
    setShowModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (mangas.length === 0) {
    return <div className='h-screen'>You don't have any uploaded manga.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-100 h-full">
      <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-12">Your Mangas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mangas.map((manga) => (
          <div key={manga._id} className="flex items-center justify-between gap-4 p-4 bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <Link href={`/${manga.title}`}>
              <div className='h-44'>
                <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="w-40 h-44 object-cover mb-2 rounded" />
              </div>
            </Link>
            <div>
              <h2 className="text-xl font-semibold mb-2">{manga.title}</h2>
              <p>Genre: {manga.genre}</p>
              <p>Updated At: {new Date(manga.updatedAt).toLocaleString()}</p>
              <div className="mt-2 flex gap-2">
                <Link href={`/edit/${manga._id}`}>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Edit</button>
                </Link>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => openModal(manga)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="dark:bg-gray-900 bg-white border border-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Confirm Delete</h2>
            <p className='text-black dark:text-white'>Are you sure you want to delete the manga titled "{selectedManga.title}"?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700" onClick={closeModal}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => handleDelete(selectedManga._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMangaList;
