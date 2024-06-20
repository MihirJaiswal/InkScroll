'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface Chapter {
  _id: string;
  chapterNumber: number;
  subTitle: string;
  description: string;
  pdf: string;
  coverImage: string;
}

interface Manga {
  _id: string;
  title: string;
  chapters: Chapter[];
}

const ChapterDetail: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [manga, setManga] = useState<Manga | null>(null);

  // Extract and decode manga title and chapter title from pathname
  const mangaTitle = decodeURIComponent(pathname.split('/')[1]);
  const chapterTitle = decodeURIComponent(pathname.split('/').pop() || '');

  useEffect(() => {
    console.log('Manga Title:', mangaTitle); // Log the manga title for debugging

    const fetchChapter = async () => {
      try {
        // Encode the manga title for the API request
        const encodedMangaTitle = encodeURIComponent(mangaTitle);
        
        const response = await fetch(`http://localhost:5000/api/mangas/${encodedMangaTitle}`);
        if (!response.ok) {
          throw new Error('Failed to fetch manga');
        }
        const data = await response.json();
        console.log(data);

        // Sort the chapters by chapterNumber
        data.chapters.sort((a: Chapter, b: Chapter) => a.chapterNumber - b.chapterNumber);
        
        setManga(data);

        const currentChapter = data.chapters.find((chap: Chapter) => chap.subTitle === chapterTitle);
        setChapter(currentChapter || null);
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    if (chapterTitle) {
      fetchChapter();
    }
  }, [chapterTitle, mangaTitle]);

  if (!chapter || !manga) return <div className='h-screen'>Loading...</div>;

  const currentChapterIndex = manga.chapters.findIndex((chap) => chap.subTitle === chapterTitle);
  const previousChapter = currentChapterIndex > 0 ? manga.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < manga.chapters.length - 1 ? manga.chapters[currentChapterIndex + 1] : null;

  console.log(currentChapterIndex);
  console.log('Chapter:', chapter);
  console.log('Chapter Title:', chapterTitle);
  console.log('Manga:', manga);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 h-full mt-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-center items-center my-4">
            <div className='md:w-full flex justify-center'>
              <img
                src={`http://localhost:5000/${chapter.coverImage}`}
                alt={chapter.subTitle}
                className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain border border-black"
              />
            </div>
            <div className='flex flex-col gap-4 md:w-full'>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-gray-100 my-4 text-center">
                {manga.title} - Chapter {chapter.chapterNumber}: {chapter.subTitle}
              </h1>
              <p className="dark:text-white text-black md:font-medium m-2 px-4 text-xl text-justify">
                {chapter.description}
              </p>
              <div className='flex justify-center'>
                <button className="bg-blue-500 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-blue-600 transition duration-300 mb-2">
                  <p className="hover:underline">Read Chapter</p>
                </button>
              </div>
            </div>
          </div>
          <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-40 dark:bg-white/10" />
          <div className='flex items-center justify-center mt-4 mb-8'>
              <h1 className='text-center text-black dark:text-gray-400 font-bold text-3xl'>Chapters</h1>
            </div>
          <div className="flex justify-between gap-4">
            {previousChapter ? (
              <Link href={`/${encodeURIComponent(mangaTitle)}/${encodeURIComponent(previousChapter.subTitle)}`}>
                <div className='p-2 rounded-2xl bg-gray-500 dark:bg-bgmain dark:shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-800 dark:border-gray-500'>
                  <div className="flex flex-col items-center">
                    <img
                      src={`http://localhost:5000/${previousChapter.coverImage}`}
                      alt={previousChapter.subTitle}
                      className="w-40 h-48 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-center">{previousChapter.subTitle}</p>
                  </div>
                  <div className='flex justify-center'>
                  <button className="bg-blue-500 mt-2 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-blue-600 transition duration-300 mb-2">
                  <p className="hover:underline">Prev Chapter</p>
                  </button>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center">
                <FaArrowLeft className="text-gray-500 text-4xl" />
                <Link href={`/${encodeURIComponent(mangaTitle)}`}>
                <div className='flex justify-center'>
                  <button className="bg-blue-500 mt-2 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-blue-600 transition duration-300 mb-2">
                  <p className="hover:underline">Go Back to Chapter 1</p>
                  </button>
                  </div>
                </Link>
              </div>
            )}
            {nextChapter && (
              <Link href={`/${encodeURIComponent(mangaTitle)}/${encodeURIComponent(nextChapter.subTitle)}`}>
                <div className='p-2 rounded-2xl bg-gray-500 dark:bg-bgmain dark:shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-800 dark:border-gray-500'> 
                  <div className="flex flex-col items-center">
                    <img
                      src={`http://localhost:5000/${nextChapter.coverImage}`}
                      alt={nextChapter.subTitle}
                      className="w-40 h-48 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-center">{nextChapter.subTitle}</p>
                  </div>
                 <div className='flex justify-center'>
                 <button className="bg-blue-500 mt-2 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-blue-600 transition duration-300 mb-2">
                  <p className="hover:underline">Next Chapter</p>
                  </button>
                 </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChapterDetail;
