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
          showManga ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-800'
        } font-bold py-2 px-4 rounded m-2`}
      >
        Manga Upload
      </button>
      <button
        onClick={handleToggle}
        className={`${
          !showManga ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-80'
        } font-bold py-2 px-4 rounded m-2`}
      >
        Chapter Upload
      </button>
    </div>
      {showManga? (
        <UploadManga/>
      ) : (
        <UploadChapter/>
      )}
    </div>
  );
};

export default Toggler;