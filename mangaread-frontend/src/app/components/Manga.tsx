'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

  const filteredMangas = selectedGenre ? mangas.filter(manga => manga.genre === selectedGenre) : mangas;

  return (
    <div className="container mx-auto px-4 md:px-4">
      <div className="py-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-gray-100 font-bold">Mangas</h1>
      </div>
      <div className="flex justify-center md:justify-start mb-6">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`px-4 py-2 mr-2 rounded-lg ${selectedGenre === genre ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {genre}
          </button>
        ))}
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          filteredMangas.map(({ _id, title, description, pdf, coverImage, author }) => (
            <Link href={`/${title}`} key={title}>
              <motion.div
                className="flex flex-col items-center rounded-lg p-4 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
      </motion.div>
    </div>
  );
};

export default MangaList;
