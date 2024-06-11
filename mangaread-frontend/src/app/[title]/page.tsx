'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        {isSignedIn && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-200 my-8">Comments</h2>
            <div className="mt-4">
              <textarea
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={handleCommentSubmit}
              >
                Submit
              </button>
            </div>
            <ul className='mt-12'>
              {manga.comments.map(comment => (
                <li key={comment._id} className="mb-2 bg-gray-950 p-4 rounded-2xl">
                  <p className="text-gray-300"><span className='text-white font-bold'>{comment.user.username}:</span> {comment.text}</p>
                  <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
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
