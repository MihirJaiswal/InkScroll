'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommentSection from '../components/CommentSection';
import { FaUserCircle, FaTags, FaStar } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Chapter {
  _id: string;
  chapterNumber: number;
  subTitle: string;
  pdf: string;
  coverImage: string;
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
  favorites: string[]; // Assuming favorites contain manga IDs
}

const MangaDetail: React.FC = () => {
  const pathname = usePathname();
  const mangaId = pathname.split('/').pop() || ''; // Extract mangaId from pathname
  const [manga, setManga] = useState<Manga | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [url, setUrl] = useState('')

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/mangas/${mangaId}`, {
          headers: {
            'x-auth-token': token || '',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch manga');
        }
        const data = await response.json();
        // Sort the chapters by chapterNumber
        data.chapters.sort((a:any, b:any) => a.chapterNumber - b.chapterNumber);
        setManga(data);
      } catch (error) {
        console.error('Error fetching manga:', error);
      }
    };

    if (mangaId) {
      fetchManga();
    }

    return () => {
      setManga(null);
    };
  }, [mangaId]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsSignedIn(true);
        try {
          // Fetch user favorites
          const response = await fetch('http://localhost:5000/api/users/favorites', {
            headers: {
              'x-auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user favorites');
          }

          const favoritesData = await response.json();
          console.log(favoritesData)
          setUrl(favoritesData)
          // Check if mangaId is in user's favorites
          const isFavorited = favoritesData.some((favorite: any) => favorite.title === manga?.title);
          setIsFavorite(isFavorited);

        } catch (error) {
          console.error('Error fetching user favorites:', error);
        }
      }
    };

    if (manga?._id) {
      fetchUserFavorites();
    }
  }, [manga?._id]);

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const url = `http://localhost:5000/api/users/favorites/${manga?._id}`;
      const method = isFavorite ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      setIsFavorite(!isFavorite);

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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: manga.chapters.length,
    centerMode: false,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerPadding: '10px',
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '0px',
        },
      },
    ],
  };
  console.log(isFavorite)
  console.log('url is', url)
  const m =  console.log(manga)


  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 h-full mt-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-center items-center my-4 md:mr-24">
            <div className='md:w-full flex justify-center'>
              <img src={`http://localhost:5000/${manga.coverImage}`} alt={manga.title} className="md:w-72 w-48 h-auto rounded-lg m-4 object-contain border border-black" />
            </div>
            <div className='flex flex-col gap-4 md:w-full'>
              <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-gray-100 my-4 text-center">{manga.title}</h1>
              <div className='flex flex-col justify-center items-center gap-4'>
                {manga.nsfw && <p className="text-red-500 font-semibold text-center border border-solid border-red-500 w-12 rounded-l px-auto">NSFW</p>}
                <p className={`dark:text-white text-black md:font-medium m-2 px-4 text-xl text-justify ${showFullDescription ? '' : 'line-clamp-2'}`}>
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
          {manga.chapters.length > 0 && ( // Render chapters only if there are chapters available
            <>
            <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-40 dark:bg-white/10" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 my-12 text-center">Chapters</h2>
              <Slider {...settings}>
                {manga.chapters.map((chapter) => (
                  <div key={chapter._id} className="flex flex-col justify-center items-center w-full">
                    <li className="mb-6 p-2 md:p-4 mx-4 rounded-2xl bg-gray-500 dark:bg-bgmain dark:shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-800 dark:border-gray-500">
                      <Link href={`${manga.title}/${chapter.subTitle}`}>
                        <div className="block">
                          <div className="flex flex-col items-center text-center">
                            <img
                              src={`http://localhost:5000/${chapter.coverImage}`}
                              alt={`Chapter ${chapter.chapterNumber}`}
                              className="md:w-56 md:h-48 w-44 h-36 object-cover border border-black rounded-lg mb-4" 
                            />
                            <p className="text-gray-900 dark:text-gray-300 text-lg font-semibold">
                              <h2 className="font-semibold text-lg m-2">Chapter {chapter.chapterNumber}:</h2> {chapter.subTitle}
                            </p>
                            <div className="flex items-center justify-center mt-4">
                              <button className="bg-blue-500 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-blue-600 transition duration-300 mb-2">
                                <p className="hover:underline">Read Chapter</p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </div>
                ))}
              </Slider>
            </>
          )}
          {isSignedIn && (
            <div>
              <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-40 dark:bg-white/10" />
              <CommentSection
                mangaTitle={manga.title}
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
