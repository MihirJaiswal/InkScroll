'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Manga {
  _id: string;
  title: string;
  description: string;
  author: any;
  pdf: string;
  coverImage: string;
  genre: string;
  nsfw: boolean;
}

const RandomMangaList: React.FC = () => {
  const [randomMangas, setRandomMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mangas');
        if (response.ok) {
          const data: Manga[] = await response.json();
          const shuffledMangas = shuffleArray(data);
          const randomMangasSlice = shuffledMangas.slice(0, 10);
          setRandomMangas(randomMangasSlice);
        } else {
          throw new Error('Failed to fetch mangas');
        }
      } catch (error) {
        console.error('Error fetching mangas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, []);

  const shuffleArray = (array: Manga[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
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
          slidesToShow: 1.5,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '0px',
        },
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 md:px-4">
      <div className="mt-12 text-center md:text-left">
        <h1 className="py-2 text-4xl text-black dark:text-gray-100 font-bold">Mangas</h1>
      </div>
      <div className="my-12">
        {loading ? (
          <div className="col-span-full text-center text-lg text-gray-700">
            Loading...
          </div>
        ) : (
          <Slider {...settings}>
            {randomMangas.map(({ _id, title, description, pdf, coverImage, author }) => (
              <Link href={`/${title}`} key={_id}>
                <motion.div
                  key={_id}
                  className="flex flex-col items-center justify-center w-48 md:w-64 p-4 bg-white dark:bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 dark:bg-opacity-10 border border-black dark:border-gray-100 dark:shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer my-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <div className="md:w-44 md:h-40 h-32 w-32 mb-4">
                    <img
                      src={`http://localhost:5000/${coverImage}`}
                      alt={title}
                      className="object-cover w-full h-full rounded-lg border border-gray-900"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-sm md:text-xl font-semibold mb-2 text-red-500">{title}</h1>
                    <p className="text-sm text-gray-950 dark:text-gray-500">{author.username}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </Slider>
        )}
      </div>
      <Link href='/all-mangas'>
        <div className='flex items-center justify-center w-full my-12'>
          <p className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 border border-gray-900">
            Read More
          </p>
        </div>
      </Link>
    </div>
  );
};

export default RandomMangaList;
