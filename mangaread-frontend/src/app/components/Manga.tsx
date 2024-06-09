'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf: string;
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
        <h1 className="py-2 text-3xl text-black font-bold">Mangas</h1>
      </div>
      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6 justify-center pb-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        {loading ? (
          <div className="m-4">
            Loading....
          </div>
        ) : (
          mangas.map(({title, description, pdf}, _id) => (
            <Link href={`/${title}`} key={_id}>
              <motion.div
                className="flex flex-col items-center rounded-lg p-4 bg-gray-100 cursor-pointer bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 border border-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="md:w-44 md:h-40 w-24 h-24 mb-4">
                  <img
                    src={`/uploads/${pdf}`}
                    alt={title}
                    className="object-contain w-full h-full rounded-lg"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="md:text-xl text-center font-semibold mb-2 text-[#B70E28]">{title}</h1>
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
