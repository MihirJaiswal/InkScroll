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

const RandomMangaList: React.FC = () => {
  const [randomMangas, setRandomMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data: Manga[] = await response.json();
          // Shuffle the array of mangas
          const shuffledMangas = shuffleArray(data);
          // Get the first 5 items from shuffled array
          const randomMangasSlice = shuffledMangas.slice(0, 5);
          setRandomMangas(randomMangasSlice);
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

  // Function to shuffle an array using Fisher-Yates algorithm
  const shuffleArray = (array: Manga[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <div className="container mx-auto px-4 md:px-4">
      <div className="py-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-gray-100 font-bold">Mangas</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-12">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          randomMangas.map(({ _id, title, description, pdf, coverImage, author }) => (
            <motion.div
              key={_id}
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
          ))
        )}
      </div>
      <Link href='/all-mangas'>
            <div className='flex items-center justify-center w-full my-12'>
            <p className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  Read More
                </p>
            </div>
        </Link>
    </div>
  );
};

export default RandomMangaList;
