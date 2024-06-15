'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname from next/navigation
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

const GenreMangas: React.FC = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // Use usePathname hook to get current pathname
  const genre = pathname.split('/').pop(); // Extract genre from the pathname
  console.log(genre)

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data: Manga[] = await response.json();
          const filteredMangas = data.filter((manga) => manga.genre === genre);
          setMangas(filteredMangas);
        } else {
          throw new Error('Failed to fetch mangas');
        }
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (genre) {
      fetchMangas();
    }
  }, [genre]);

  return (
    <div className="container mx-auto px-4 md:px-4 h-full">
      <div className="py-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-gray-100 font-bold">Mangas in {genre}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-12">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          mangas.map(({ _id, title, description, pdf, coverImage, author }) => (
            <Link href={`/${title}`} key={_id}>
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
      </div>
    </div>
  );
};

export default GenreMangas;
