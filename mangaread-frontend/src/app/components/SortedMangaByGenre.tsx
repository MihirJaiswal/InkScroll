'use client'
import React, { useEffect, useState } from 'react';

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

  return (
    <div>
      <h1>Manga by Genre</h1>
      <div>
        {genres.map(genre => (
          <button key={genre} onClick={() => handleGenreClick(genre)} style={{ margin: '5px' }}>
            {genre}
          </button>
        ))}
      </div>
      <div>
        {filteredMangas.length > 0 ? (
          filteredMangas.map(manga => (
            <div key={manga._id} style={{ margin: '10px 0' }}>
              <h3>{manga.title}</h3>
              <p>{manga.description}</p>
              {/* <img src={`http://localhost:5000/${manga.coverImage.replace('\\', '/')}`} alt={manga.title} style={{ width: '100px' }} /> */}
            </div>
          ))
        ) : (
          <p>Please select a genre to see the manga.</p>
        )}
      </div>
    </div>
  );
};

export default MangaByGenre;
