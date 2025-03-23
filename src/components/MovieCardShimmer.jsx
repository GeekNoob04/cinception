import React from "react";

const MovieCardShimmer = () => {
  return (
    <div className="relative w-36 md:w-44 lg:w-56 flex-shrink-0 animate-pulse">
      {/* Poster shimmer */}
      <div className="w-full h-52 md:h-64 lg:h-80 rounded-lg bg-gray-700"></div>
      
      {/* Title shimmer */}
      <div className="mt-2 h-4 w-3/4 bg-gray-700 rounded"></div>
      
      {/* Rating shimmer */}
      <div className="mt-2 flex items-center">
        <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
        <div className="ml-1 h-3 w-8 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export default MovieCardShimmer;