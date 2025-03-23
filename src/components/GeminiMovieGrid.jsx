import React from "react";
import GeminiMovieCard from "./GeminiMovieCard";

const GeminiMovieGrid = ({ title, movies }) => {
  if (!movies) return null;

  return (
    <div className="px-6 mb-8">
      <h1 className="text-3xl py-4 text-white">{title}</h1>
      <div className="flex flex-wrap gap-4">
        {movies?.map((movie) => (
          <GeminiMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default GeminiMovieGrid;
