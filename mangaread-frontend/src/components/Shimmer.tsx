import React from 'react';

const ShimmerCard = ({ count } : any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="shimmer-card-wrapper w-64 max-w-sm p-4 mx-auto my-4 bg-white dark:bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-60 dark:bg-opacity-10 border border-black dark:border-gray-100 dark:shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="shimmer-card animate-pulse">
            <div className="h-44  bg-gray-100 dark:bg-gray-600 rounded-md"></div>
            <div className='flex flex-col justify-center'>
            <div className="mt-4 h-4 bg-gray-100 dark:bg-gray-600 rounded-md w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-100 dark:bg-gray-600 rounded-md w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerCard;
