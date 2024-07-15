// ShimmerEffect.tsx

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ShimmerEffect: React.FC = () => {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-4 h-full mt-4">
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-center items-center my-4 md:mr-24">
          <div className='md:w-full flex justify-center'>
            <div className="w-48 h-64 rounded-lg bg-gray-300 animate-pulse"></div>
          </div>
          <div className='flex flex-col gap-4 md:w-full'>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-300 my-4 text-center">Loading Title</h1>
            <div className='flex flex-col justify-center items-center gap-4'>
              <p className="text-gray-300 font-medium m-2 px-4 text-xl text-justify line-clamp-2">
                Loading Description
              </p>
              <div className="md:px-12 flex flex-wrap md:flex-row justify-center gap-4">
                <p className="text-gray-300 m-2 text-center flex items-center">Loading Author</p>
                <p className="text-gray-300 m-2 text-center flex items-center">Loading Tags</p>
                <p className="text-gray-300 m-2 text-center flex items-center">Loading Rating</p>
              </div>
              <div className='flex flex-row items-center justify-center gap-4 mb-4'>
                <div className="mt-4 flex justify-center">
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-lg border border-black pointer-events-none">Loading Reading Button</button>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="bg-gray-400 text-white px-4 py-2 rounded-lg border border-black pointer-events-none">Loading Favorites Button</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-40 dark:bg-white/10" />
        <div className="flex justify-center">
          <div className="w-full md:w-3/4">
            {[1].map((index) => (
              <div key={index} className="mb-6 p-2 md:p-4 mx-4 rounded-2xl bg-gray-300 dark:bg-bgmain dark:shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-800 dark:border-gray-500">
                <div className="block">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-44 h-36 object-cover border border-black rounded-lg mb-4 bg-gray-300 animate-pulse"></div>
                    <h1 className="text-gray-300 dark:text-gray-300 text-lg font-semibold">
                      <p className="font-semibold text-lg m-2">Loading Chapter:</p> Loading Subtitle
                    </h1>
                    <div className="flex items-center justify-center mt-4">
                      <button className="bg-gray-400 text-white md:px-6 px-2 py-2 md:py-3 border border-gray-700 rounded-lg hover:bg-gray-500 transition duration-300 mb-2 pointer-events-none">
                        <p className="hover:underline">Loading Read Chapter Button</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-12 h-0.5 border-t-0 bg-neutral-200 opacity-40 dark:bg-white/10" />
        <div className="w-full md:w-3/4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex items-start mb-4 gap-4 p-4 bg-gray-300 dark:bg-bgmain dark:shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-800 dark:border-gray-500 rounded-lg animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-400"></div>
              <div className="flex-1">
                <div className="w-2/3 h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-full h-4 bg-gray-400 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-gray-400 rounded mb-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ShimmerEffect;
