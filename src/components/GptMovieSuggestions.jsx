import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";

const GptMovieSuggestions = () => {
  const { movieResults, isLoading } = useSelector((store) => store.gemini);

  if (!isLoading && (!movieResults || movieResults.length === 0)) return null;

  return (
    <div className="mt-12 px-4 py-6 backdrop-blur-sm bg-black/60 rounded-xl shadow-xl">
      <MovieList
        title="Recommended Movies"
        movies={movieResults || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GptMovieSuggestions;
