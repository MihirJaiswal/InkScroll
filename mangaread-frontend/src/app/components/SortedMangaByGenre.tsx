'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Manga {
  _id: string;
  title: string;
  description: string;
  genre: string;
  coverImage: string;
}

const MangaByGenre: React.FC = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (!response.ok) {
          throw new Error('Failed to fetch manga');
        } else {
          const data: Manga[] = await response.json();
          setMangas(data);

          // Extract unique genres
          const uniqueGenres = Array.from(new Set(data.map(manga => manga.genre)));
          setGenres(uniqueGenres);
        }
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };

    fetchMangas();
  }, []);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
  };

  const filteredMangas = selectedGenre ? mangas.filter(manga => manga.genre === selectedGenre) : [];

  // Map genres to images (adjust the image paths as necessary)
  const genreImages = {
    Action: '/images/action.jpg',
    Adventure: '/images/adventure.jpg',
    Fantasy: '/images/fantasy.jpg',
    // Add more genres and images as needed
  };

  return (
    <div className="container mx-auto px-4 md:px-0">
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Manga by Genre</h1>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${
                selectedGenre === genre ? 'bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {selectedGenre && (
        <div className="relative mb-12">
        {/*   <Image
            src={genreImages[selectedGenre] || '/images/default.jpg'}
            alt={selectedGenre}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          /> */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-3xl text-white font-bold">{selectedGenre}</h2>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMangas.length > 0 ? (
          filteredMangas.map(manga => (
            <div key={manga._id} className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2 text-[#B70E28]">{manga.title}</h3>
              <p className="text-gray-600 mb-4">{manga.description}</p>
             {/*  <Image
                src={`http://localhost:5000/${manga.coverImage.replace('\\', '/')}`}
                alt={manga.title}
                width={200}
                height={300}
                className="object-cover rounded-lg"
              /> */}
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-700">Please select a genre to see the manga.</p>
        )}
      </div>
    </div>
  );
};

export default MangaByGenre;
