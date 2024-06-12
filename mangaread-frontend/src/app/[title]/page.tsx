'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';

interface Chapter {
  _id: string;
  chapterNumber: number;
  title: string;
  pdf: string;
}

interface Comment {
  _id: string;
  user: {
    username: string;
  };
  text: string;
  createdAt: string;
}

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf?: string;
  coverImage: string; // Updated to include img property
  genre: string;
  nsfw: boolean;
  chapters: Chapter[];
  author: {
    username: string;
  }; // Added author
  tags: string[]; // Added tags
  rating: number; // Added rating
  comments: Comment[];
}

const MangaDetail: React.FC = () => {
  const pathname = usePathname();
  const title = pathname.split('/').pop(); // Extract title from the pathname
  const [manga, setManga] = useState<Manga | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [commentText, setCommentText] = useState('');

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

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if(token){
      console.log(token)
    }
    setIsSignedIn(!!token);
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/mangas/${title}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token ?? "",  
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const newComment = await response.json();
      setManga(prevManga => prevManga ? { ...prevManga, comments: [...prevManga.comments, newComment] } : null);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!manga) return <div className='h-screen'>Loading....</div>;

  const newurl = manga.pdf ? manga.pdf.replace('\\', '/').split('/').pop() : '';

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 h-full mt-4">
      <div className="py-8">
        <h1 className="text-5xl font-bold text-gray-100 mb-12 text-center">{manga.title}</h1>
        <div className="flex flex-col md:flex-row justify-center items-center my-4 md:mr-24">
          <div className='md:w-full flex justify-center'>
            <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain" /> {/* Updated image source */}
          </div>
         <div className='flex flex-col gap-4 md:w-full'>
         
         <div className='flex flex-col justify-center items-center gap-4'>
         {manga.nsfw && <p className="text-red-500 font-semibold text-center border border-solid border-red-500 w-12 rounded-l px-auto">NSFW</p>}
          <p className="text-white md:font-medium m-2 text-xl text-center ">{manga.description}</p>
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
            {manga.chapters.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-200 my-8">Chapters</h2>
                <ul>
                  {manga.chapters.map(chapter => (
                    <li key={chapter._id} className="mb-2 bg-gray-950 p-4 rounded-2xl">
                      <p className="text-gray-300 text-lg font-semibold flex flex-col items-center">
                        <span className="font-semibold text-xl m-2">Chapter {chapter.chapterNumber}:</span> {chapter.title}
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
              </>
            )}
          </div>
        <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
        {isSignedIn && (
          <div className="mt-8 p-2 md:p-8 bg-bgmain rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-500">
            <h2 className="text-xl font-semibold text-gray-200 my-8">Comments</h2>
            <div className="mt-4 flex items-center space-x-4 rounded-lg border-b border-gray-600">
              <textarea
                className="w-full relative p-2 rounded-t-lg bg-gray-950 text-white placeholder-gray-400"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <FaPaperPlane
                className="text-white absolute right-12 cursor-pointer hover:text-blue-700 transition duration-200"
                size={24}
                onClick={handleCommentSubmit}
              />
              
            </div>
            <ul className="space-y-4 bg-gray-950 p-2 rounded-b-lg">
              {manga.comments.map((comment) => (
                <li key={comment._id} className="flex items-start space-x-4 p-4 bg-gray-950 rounded-2xl">
                  <FaUserCircle className="text-gray-500" size={40} />
                  <div className="flex-1">
                    <p className="text-gray-300">
                      <span className="text-white font-bold">{comment.user.username}</span> {comment.text}
                    </p>
                    <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default MangaDetail;
