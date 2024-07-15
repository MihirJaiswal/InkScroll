import Image from 'next/image';
import React from 'react';
import loader from '../../public/loader.gif';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Image 
          src={loader}
          alt="loader"
          width={100}
          height={100}
          className="w-44 h-auto"
        />
        <h1 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Loading...</h1>
      </div>
    </div>
  );
};

export default Loader;
