import React from 'react';

const ShimmerCard = ({ count } : any) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="shimmer-card-wrapper w-64 max-w-sm p-4 mx-auto my-4 bg-white dark:bg-gray-500 rounded-lg shadow-md">
          <div className="shimmer-card animate-pulse">
            <div className="h-44  bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className='flex flex-col justify-center'>
            <div className="mt-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerCard;
