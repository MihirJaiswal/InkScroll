'use client';
import React, { useEffect, useState } from 'react';
import { FaStar, FaSearch, FaSort } from 'react-icons/fa'; // Importing FaSearch and FaSort icons
import Link from 'next/link';
import ShimmerCard from './Shimmer';

interface Manga {
  _id: string;
  title: string;
  coverImage: string;
  author: {
    username: string;
  };
  rating: number;
}

const FavoriteMangas: React.FC = () => {
  const [favorites, setFavorites] = useState<Manga[]>([]);
  const [filteredFavorites, setFilteredFavorites] = useState<Manga[]>([]); // State for filtered mangas
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortType, setSortType] = useState<'title' | 'rating' | 'sorthere'>('sorthere'); // State for sort type
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsSignedIn(true);
        try {
          const response = await fetch('http://localhost:5000/api/users/favorites', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch favorite mangas');
          }
          const data = await response.json();
          setFavorites(data);
          setFilteredFavorites(data); // Initialize filtered favorites with all favorites
          setIsLoading(false); // Data fetching is complete
        } catch (error) {
          console.error('Error fetching favorite mangas:', error);
          setIsLoading(false); // Error occurred, stop loading
        }
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    // Function to filter favorites based on search term
    const filteredMangas = favorites.filter(manga =>
      manga.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFavorites(filteredMangas);
  }, [favorites, searchTerm]);

  const handleSortChange = (type: 'title' | 'rating') => {
    setSortType(type);
    // Perform sorting based on the selected type
    const sortedMangas = [...filteredFavorites].sort((a, b) => {
      if (type === 'title') {
        return a.title.localeCompare(b.title);
      } else if (type === 'rating') {
        return b.rating - a.rating; // Sorting in descending order by rating
      }
      return 0;
    });
    setFilteredFavorites(sortedMangas);
  };

  if (!isSignedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Please sign in to view your favorite mangas.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 h-full mt-4">
      <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-gray-100 my-8 text-center">Your Favorite Mangas</h1>
      
      {/* Search bar */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by manga title..."
            className="px-4 py-2 w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {/* Sorting filter */}
      <div className="flex justify-center mb-4">
        <div className="relative dark:text-white text-gray-500">
          <select
            value={sortType}
            onChange={(e) => handleSortChange(e.target.value as 'title' | 'rating')}
            className="px-4 py-2 w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option>Sort Here</option>
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
          </select>
          <FaSort className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Loading indicator after search and sort */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <ShimmerCard count={5} />
        </div>
      )}

      {/* Grid of favorite mangas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 m-12">
        {filteredFavorites.map((manga) => (
          <div key={manga._id} className="flex flex-col justify-center items-center rounded-lg p-4 mt-4 mb-8 bg-white dark:bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 dark:bg-opacity-10 border dark:border-gray-100 border-black shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <Link href={`/manga/${manga.title}`}>
              <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="w-56 h-48 rounded-lg object-cover mb-4" />
            </Link>
            <h2 className="text-xl font-semibold text-black dark:text-gray-100 mb-2">{manga.title}</h2>
            <p className="text-gray-900 dark:text-gray-300 mb-2"><FaStar className="inline mr-1" /> {manga.rating}/5</p>
            <p className="text-gray-900 dark:text-gray-300">By {manga.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMangas;
