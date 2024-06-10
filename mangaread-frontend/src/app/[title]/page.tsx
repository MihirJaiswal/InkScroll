'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Chapter {
  _id: string;
  chapterNumber: number;
  title: string;
  pdf: string;
}

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf?: string;
  img: string;
  genre: string;
  nsfw: boolean;
  chapters: Chapter[];
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

  if (!manga) return <div className='h-screen'>Loading....</div>;

  const newurl = manga.pdf ? manga.pdf.replace('\\', '/').split('/').pop() : '';

  return (
    <div className="container mx-auto px-4 h-screen">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4 text-center">{manga.title}</h1>
        <div className="flex flex-col justify-center items-center mb-4">
          <img src="https://m.media-amazon.com/images/I/81X5Wy1uMUL._AC_UF1000,1000_QL80_.jpg" alt={manga.title} className="w-44 h-auto rounded-lg m-4 object-contain" />
          <div>
            <p className="text-gray-200 m-2">{manga.description}</p>
            {manga.nsfw && <p className="text-red-500 font-semibold">NSFW</p>}
          </div>
        </div>
        {manga.pdf && (
          <div className="mb-4 flex justify-center">
            <Link href={`/read/${newurl}`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Start Reading</button>
            </Link>
          </div>
        )}
        <div className='flex flex-col justify-center items-center'>
        <h2 className="text-xl font-semibold text-gray-200 my-8">Chapters</h2>
        <ul>
          {manga.chapters.map(chapter => (
            <li key={chapter._id} className="mb-2 bg-gray-950 p-4 rounded-2xl">
              <p className="text-gray-300 text-lg font-semibold flex flex-col items-center">
                <h2 className="font-semibold text-xl m-2">Chapter {chapter.chapterNumber}:</h2> {chapter.title}
              </p>
              <Link href={`/read/${newurl}`}>
               <div className='flex items-center justify-center m-4'>
               <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'>
               <p className="hover:underline">Read Chapter</p>
               </button>
               </div>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
