'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPaperPlane } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

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
    profileImage: string; // Added profileImage property
  };
  text: string;
  createdAt: string;
}

interface Manga {
  _id: string;
  title: string;
  description: string;
  pdf?: string;
  coverImage: string;
  genre: string;
  nsfw: boolean;
  chapters: Chapter[];
  author: {
    username: string;
  };
  tags: string[];
  rating: number;
  comments: Comment[];
}

interface User {
  username: string;
  profileImage: string;
}

const MangaDetail: React.FC = () => {
  const pathname = usePathname();
  const title = pathname.split('/').pop(); 
  const [manga, setManga] = useState<Manga | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [user, setUser] = useState<User | null>(null);

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
      setManga(null);
    };
  }, [title]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsSignedIn(true);
      const fetchUser = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/user', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUser();
    }
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

  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/user/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token ?? "",  
        },
        body: JSON.stringify({ mangaId: manga?._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      console.log('Manga added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
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
            <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain" />
          </div>
         <div className='flex flex-col gap-4 md:w-full'>
         
         <div className='flex flex-col justify-center items-center gap-4'>
         {manga.nsfw && <p className="text-red-500 font-semibold text-center border border-solid border-red-500 w-12 rounded-l px-auto">NSFW</p>}
          <p className="text-white md:font-medium m-2 text-xl text-center ">{manga.description}</p>
          </div>
          <div className="md:px-12 flex flex-col md:flex-row justify-center">
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Author:</span> {manga.author.username}</p>
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Genre:</span> {manga.genre}</p>
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Tags:</span> {manga.tags.join(', ')}</p>
            <p className="text-gray-200 m-2 text-center"><span className='text-white font-bold'>Rating:</span> {manga.rating}/5</p>
          </div>
          {manga.pdf && (
              <div className="mb-4 flex justify-center mt-12">
                <Link href={`/read/${newurl}`} passHref>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Start Reading</button>
                </Link>
              </div>
            )}
          {isSignedIn && (
            <div className="mt-4 flex justify-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={handleAddToFavorites}
              >
                Add to Favorites
              </button>
            </div>
          )}
         </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full">
      {manga.chapters.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-200 my-8">Chapters</h2>
          <ul>
            {manga.chapters.map((chapter) => (
              <li key={chapter._id} className="mb-6 p-4 rounded-2xl bg-gray-900 shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-500">
                <Link href={`/${chapter.title}`}>
                  <div className="block">
                    <div className="flex flex-col items-center text-center">
                      <img 
                        src={`http://localhost:5000/${manga.coverImage}`} 
                        alt={`Chapter ${chapter.chapterNumber}`} 
                        className="w-auto h-48 object-cover rounded-lg mb-4"
                      />
                      <p className="text-gray-300 text-lg font-semibold">
                        <h2 className="font-semibold text-lg m-2">Chapter {chapter.chapterNumber}:</h2> {chapter.title}
                      </p>
                      <div className="flex items-center justify-center mt-4">
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                          <p className="hover:underline">Read Chapter</p>
                        </button>
                      </div>
                    </div>
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
                  {comment.user.profileImage ? (
                    <img
                      src={`http://localhost:5000/${comment.user.profileImage}`}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-500 w-10 h-10" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-300">
                        <span className="text-white font-bold">{comment.user.username}</span> {comment.text}
                      </p>
                      <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
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
