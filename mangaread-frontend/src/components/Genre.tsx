'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import ShimmerCard from './Shimmer';

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
  const [filteredMangas, setFilteredMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pathname = usePathname();
  const genre = pathname.split('/').pop();
  
  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data: Manga[] = await response.json();
          const filteredMangas = data.filter((manga) => manga.genre === genre);
          setMangas(filteredMangas);
          setFilteredMangas(filteredMangas);
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      setFilteredMangas(mangas.filter((manga) => manga.title.toLowerCase().includes(query.toLowerCase())));
    } else {
      setFilteredMangas(mangas);
    }
  };

  const handleSort = () => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    const sortedMangas = [...filteredMangas].sort((a, b) => {
      if (order === 'asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setFilteredMangas(sortedMangas);
  };

  return (
    <div className="container mx-auto px-4 md:px-4 h-full">
      <div className="mt-6 text-center md:text-left">
        <h1 className="py-2 mb-8 text-3xl dark:text-gray-100 text-black font-bold">Mangas in {genre}</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search mangas..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
            <FaSearch className="absolute top-2 left-3 text-gray-400" />
          </div>
          <button
            onClick={handleSort}
            className="ml-4 flex items-center justify-center py-2 px-4 border border-gray-700 dark:border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sortOrder === 'asc' ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            <span className="ml-2 text-black dark:text-gray-300">Sort</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-12">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            <ShimmerCard count={5}/>
          </div>
        ) : (
          filteredMangas.map(({ _id, title, description, pdf, coverImage, author }) => (
            <Link href={`/${title}`} key={_id}>
              <motion.div
                className="flex flex-col items-center rounded-lg p-4 bg-white dark:bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 dark:bg-opacity-10 border border-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
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
