'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

interface Manga {
  _id: string;
  title: string;
  description: string;
  author: any;
  pdf: string;
  coverImage: string;
  genre: string;
  nsfw: boolean;
}

const MangaList: React.FC = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data: Manga[] = await response.json();
          setMangas(data);
          const genreList = Array.from(new Set(data.map((manga: Manga) => manga.genre)));
          setGenres(genreList);
        } else {
          throw new Error('Failed to fetch mangas');
        }
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre === selectedGenre ? null : genre);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMangas = mangas.filter((manga) => {
    const matchesTitle = manga.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? manga.genre === selectedGenre : true;
    return matchesTitle && matchesGenre;
  });

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 md:px-4">
      <div className="py-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-black dark:text-gray-100 font-bold">Mangas</h1>
      </div>
      <div className="flex flex-wrap w-full justify-center md:justify-start mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 border border-black"
          />
          <div className="absolute inset-y-0 right-3 flex items-center">
            {searchTerm && (
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
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
            )}
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap mb-6 justify-center md:justify-start">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`px-4 py-2 m-2 rounded-lg dark:text-white text-black border border-gray-900 ${selectedGenre === genre ? 'dark:bg-blue-600 bg-blue-400' : 'dark:bg-gray-600 bg-gray-300'} hover:dark:bg-blue-700 hover:bg-blue-400 focus:outline-none`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-12">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          filteredMangas.map(({ _id, title, description, pdf, coverImage, author }) => (
            <Link href={`/${title}`} key={_id}>
              <motion.div
                className="flex flex-col items-center rounded-lg p-4 bg-white dark:bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 dark:bg-opacity-10 border dark:border-gray-100 border-black shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="md:w-44 md:h-40 w-32 h-32 mb-4">
                  <img
                    src={`http://localhost:5000/${coverImage}`}
                    alt={title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg md:text-xl font-semibold mb-2 text-red-500">{title}</h1>
                  <p className="text-sm text-gray-500">{author.username}</p>
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MangaList;
