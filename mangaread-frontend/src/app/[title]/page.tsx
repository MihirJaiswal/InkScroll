// pages/[title].tsx
'use client'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf: string;
  img: string;
  genre: string;
  nsfw: boolean;
}

const MangaDetail: React.FC = () => {
  const pathname = usePathname();
  const title = pathname.split('/').pop(); // Extract title from the pathname
  const [manga, setManga] = useState<Manga | null>(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/mangas/${title}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manga');
        } else {
          const data = await response.json();
          setManga(data);
        }
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };

    if (title) {
      fetchManga();
    }

    return () => {
      // Cleanup function
      // Clear the manga state when the component unmounts
      setManga(null);
    };
  }, [title]);

  if (!manga) return <div>Loading....</div>;
  
  const newurl = manga.pdf.replace('\\', '/').split('/').pop();
  console.log(newurl)

  return (
    <div>
      <h1>{manga.title}</h1>
      <p>{manga.description}</p>
      <button>
      <Link href={`/read/${newurl}`}>View PDF</Link>
      </button>

      {manga.nsfw && <p style={{ color: 'red' }}>NSFW</p>}
    </div>
  );
};

export default MangaDetail;
