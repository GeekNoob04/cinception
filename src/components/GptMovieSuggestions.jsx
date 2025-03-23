// GptMovieSuggestions.jsx
import React from "react";
import { useSelector } from "react-redux";
import GeminiMovieCard from "./GeminiMovieCard"; // Fix import name

const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gemini);

  if (!movieNames || !movieResults) return null;

  console.log("movieResults:", movieResults);
  const allMovies = Array.isArray(movieResults[0])
    ? movieResults.flat()
    : movieResults;

  return (
    <div className="p-4 m-4 bg-black text-white">
      <div className="px-6 mb-8">
        <div className="flex flex-wrap gap-4">
          {allMovies.map((movie) => (
            <GeminiMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
