'use client'
import React, { useState } from 'react';
import UploadManga from './Upload';
import UploadChapter from './AddChapter';

const Toggler = () => {
  const [showManga, setShowManga] = useState(true);

  const handleToggle = () => {
    setShowManga(!showManga);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className='flex'>
        <button
          onClick={handleToggle}
          className={`${
            showManga ? 'bg-red-500 border border-gray-600 dark:bg-gray-300 text-white dark:text-gray-800 ' : 'bg-white text-black dark:bg-gray-800 border border-gray-600 dark:text-white'
          } font-bold py-2 px-4 rounded m-2 focus:outline-none`}
        >
          Manga Upload
        </button>
        <button
          onClick={handleToggle}
          className={`${
            !showManga ? 'bg-red-500 border border-gray-600 dark:bg-gray-300 text-white dark:text-gray-800' : 'bg-white text-black dark:bg-gray-800 border border-gray-600 dark:text-white'
          } font-bold py-2 px-4 rounded m-2 focus:outline-none`}
        >
          Chapter Upload
        </button>
      </div>
      {showManga ? (
        <UploadManga />
      ) : (
        <UploadChapter />
      )}
    </div>
  );
};

export default Toggler;
