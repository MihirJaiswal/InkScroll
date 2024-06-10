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

  if (!manga) return <div>Loading....</div>;

  const newurl = manga.pdf ? manga.pdf.replace('\\', '/').split('/').pop() : '';

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{manga.title}</h1>
        <div className="flex items-center mb-4">
          <img src={manga.img} alt={manga.title} className="w-24 h-24 rounded-lg mr-4 object-cover" />
          <div>
            <p className="text-gray-700 mb-2">{manga.description}</p>
            {manga.nsfw && <p className="text-red-500 font-semibold">NSFW</p>}
          </div>
        </div>
        {manga.pdf && (
          <div className="mb-4">
            <Link href={`/read/${newurl}`} passHref>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View PDF</button>
            </Link>
          </div>
        )}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Chapters</h2>
        <ul>
          {manga.chapters.map(chapter => (
            <li key={chapter._id} className="mb-2">
              <p className="text-gray-700">
                <span className="font-semibold">Chapter {chapter.chapterNumber}:</span> {chapter.title}
              </p>
              <Link href={`/read/${newurl}`}>
                <p className="text-blue-500 hover:underline">Read Chapter</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MangaDetail;
