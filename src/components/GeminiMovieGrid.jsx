import React from "react";
import GeminiMovieCard from "./GeminiMovieCard";

const GeminiMovieGrid = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-6 mb-8">
      <h1 className="text-2xl md:text-3xl py-4 text-white font-bold">
        {title}
      </h1>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {movies?.map((movie) => (
          <GeminiMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default GeminiMovieGrid;
