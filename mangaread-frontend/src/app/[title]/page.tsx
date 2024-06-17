'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import { FaUserCircle, FaTags, FaStar } from 'react-icons/fa';

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
    profilePicture: string;
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
  profilePicture: string;
}

const MangaDetail: React.FC = () => {
  const pathname = usePathname();
  const title = pathname.split('/').pop() || ''; // Ensure title is always a string
  const [manga, setManga] = useState<Manga | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

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
          const response = await fetch('http://localhost:5000/api/users', {
            headers: {
              'x-auth-token': token,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUser(userData);
          console.log('user us', userData);
          // Check if manga is already in favorites
          const favResponse = await fetch('http://localhost:5000/api/user/favorites', {
            headers: {
              'x-auth-token': token,
            },
          });
          const favoriteMangas = await favResponse.json();
          if (favoriteMangas.some((favManga: Manga) => favManga._id === manga?._id)) {
            setIsFavorite(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUser();
    }
  }, [manga?._id]);

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = `http://localhost:5000/api/users/favorites`;
      const method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token ?? '',
        },
        body: JSON.stringify({ mangaId: manga?._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      setIsFavorite(!isFavorite);
      console.log(`Manga ${isFavorite ? 'removed from' : 'added to'} favorites`);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setManga((prevManga) => prevManga ? { ...prevManga, comments: [...prevManga.comments, newComment] } : null);
  };

  const handleCommentDeleted = (commentId: string) => {
    setManga((prevManga) =>
      prevManga ? { ...prevManga, comments: prevManga.comments.filter(comment => comment._id !== commentId) } : null
    );
  };

  if (!manga) return <div className='h-screen'>Loading....</div>;

  const newurl = manga.pdf ? manga.pdf.replace('\\', '/').split('/').pop() : '';

  console.log('comments', manga.comments);
  console.log(user);
  console.log(isSignedIn);
  console.log(manga.title);
  console.log('username is', user?.username);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 h-full mt-4">
        <div className="py-8">
          <h1 className="text-5xl font-bold text-black dark:text-gray-100 mb-12 text-center">{manga.title}</h1>
          <div className="flex flex-col md:flex-row justify-center items-center my-4 md:mr-24">
            <div className='md:w-full flex justify-center'>
              <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain border border-black" />
            </div>
            <div className='flex flex-col gap-4 md:w-full'>
              <div className='flex flex-col justify-center items-center gap-4'>
                {manga.nsfw && <p className="text-red-500 font-semibold text-center border border-solid border-red-500 w-12 rounded-l px-auto">NSFW</p>}
                <p className={`dark:text-white text-black md:font-medium m-2 text-xl text-center ${showFullDescription ? '' : 'line-clamp-2'}`}>
                  {manga.description}
                </p>
                {!showFullDescription && (
                  <button
                    className="dark:text-blue-500 text-blue-700 font-bold hover:underline focus:outline-none"
                    onClick={() => setShowFullDescription(true)}
                  >
                    Load More
                  </button>
                )}
              </div>
              <div className="md:px-12 flex flex-wrap md:flex-row justify-center gap-4">
                <p className="dark:text-gray-200 text-black m-2 text-center flex items-center"><FaUserCircle className="mr-2" /> {manga.author.username}</p>
                <p className="dark:text-gray-200 text-black m-2 text-center flex items-center"><FaTags className="mr-2" /> {manga.tags.join(', ')}</p>
                <p className="dark:text-gray-200 text-black m-2 text-center flex items-center"><FaStar className="mr-2" /> {manga.rating}/5</p>
              </div>
              <div className='flex flex-row items-center justify-center gap-4 mb-4'>
                {manga.pdf && (
                  <div className="mt-4 flex justify-center">
                    <Link href={`/read/${newurl}`} passHref>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 border border-black">Start Reading</button>
                    </Link>
                  </div>
                )}
                {isSignedIn && (
                  <div className="mt-4 flex justify-center">
                    <button
                      className={`px-4 py-2 rounded-lg ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white border border-black`}
                      onClick={handleFavoriteToggle}
                    >
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                )}
              </div>
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
          
          {isSignedIn && (
            <div>
              <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
              <CommentSection
              mangaTitle={title}
              comments={manga.comments}
              isSignedIn={isSignedIn}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
            />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MangaDetail;
