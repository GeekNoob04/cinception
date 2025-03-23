import React from "react";
import { useSelector } from "react-redux";
import GeminiMovieCard from "./GeminiMovieCard";

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gemini);

  if (!movieNames || !movieResults) return null;

  const allMovies = Array.isArray(movieResults[0])
    ? movieResults.flat()
    : movieResults;

  return (
    <div className="p-4 md:p-6 m-2 md:m-4 bg-black bg-opacity-80 text-white rounded-lg">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Recommended Movies
      </h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {allMovies.map((movie) => (
          <GeminiMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {allMovies.length === 0 && (
        <p className="text-center py-8 text-gray-400">
          No movies found matching your search
        </p>
      )}
    </div>
  );
};

export default GptMovieSuggestions;
