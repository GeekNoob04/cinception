import React from "react";

const ShimmerMovieCard = () => {
  return (
    <div className="w-36 sm:w-40 md:w-48 lg:w-56 m-2 relative">
      <div className="w-full h-60 md:h-72 bg-gray-300 rounded-lg animate-pulse"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-400 bg-opacity-70 p-2 rounded-b-lg">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-1 animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ShimmerMovieCard;
