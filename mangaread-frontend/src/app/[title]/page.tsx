'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

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
  coverImage: any; // Updated to include img property
  genre: string;
  nsfw: boolean;
  chapters: Chapter[];
  author: any; // Added author
  tags: string[]; // Added tags
  rating: number; // Added rating
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
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 h-full mt-4">
      <div className="py-8">
        <h1 className="text-5xl font-bold text-gray-100 mb-12 text-center">{manga.title}</h1>
        <div className="flex flex-col md:flex-row justify-center items-center my-4">
          <div className='md:w-full flex justify-center'>
            <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain" /> {/* Updated image source */}
          </div>
         <div className='flex flex-col gap-4 md:w-full'>
         
         <div className='flex flex-col justify-center items-center gap-4'>
         {manga.nsfw && <p className="text-red-500 font-semibold text-center border border-solid border-red-500 w-12 rounded-l px-auto">NSFW</p>}
          <p className="text-white md:font-semibold m-2 text-xl text-center ">{manga.description}</p>
          </div>
          <div className="md:px-12 flex flex-col md:flex-row justify-center">
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Author:</span> {manga.author.username}</p> {/* Added author */}
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Genre:</span> {manga.genre}</p> {/* Genre */}
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Tags:</span> {manga.tags.join(', ')}</p> {/* Added tags */}
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Rating:</span> {manga.rating}/5</p> {/* Added rating */}
          </div>
          {manga.pdf && (
              <div className="mb-4 flex justify-center mt-12">
                <Link href={`/read/${newurl}`} passHref>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Start Reading</button>
                </Link>
              </div>
            )}
         </div>
        </div>
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
    </div>
  );
};

export default MangaDetail;
