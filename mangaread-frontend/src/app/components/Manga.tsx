'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Console } from 'console';

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf: string;
  coverImage: string;
  nsfw: boolean;
}

const MangaList: React.FC = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data = await response.json();
          setMangas(data);
          console.log(data)
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

  return (
    <div className="container mx-auto px-4 md:px-0">
      <div className="py-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-gray-100 font-bold">Mangas</h1>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          mangas.map(({ _id, title, description, pdf, coverImage}) => (
            <Link href={`/${title}`} key={title}>
              <motion.div
                className="flex flex-col items-center rounded-lg p-4 bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="md:w-44 md:h-40 w-32 h-32 mb-4">
                  <img
                    src={`/uploads/${coverImage}`}
                    alt={title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-lg md:text-xl font-semibold mb-2 text-[#B70E28]">{title}</h1>
                  <p className="text-sm text-gray-500">{description}</p>
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
