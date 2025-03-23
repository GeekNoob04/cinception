import React from "react";
import GeminiMovieCard from "./GeminiMovieCard";
import MovieCardShimmer from "./MovieCardShimmer";

const MovieList = ({ title, movies, isLoading, count = 6 }) => {
  return (
    <div className="px-4 md:px-6 mb-12">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-red-600 mr-4"></div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      </div>

      {isLoading ? (
        <div className="flex overflow-x-auto pb-4 gap-4">
          {/* Display shimmer cards while loading */}
          {[...Array(count)].map((_, index) => (
            <MovieCardShimmer key={`shimmer-${index}`} />
          ))}
        </div>
      ) : movies && movies.length > 0 ? (
        <div className="flex overflow-x-auto pb-4 gap-4">
          {movies.map((movie) => (
            <GeminiMovieCard
              key={movie.id || `movie-${movie.index}`}
              movie={movie}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="inline-block p-4 rounded-full bg-gray-800 mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-400 text-lg">
            No movies found matching your search
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            Try a different movie title, genre, or description
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieList;
