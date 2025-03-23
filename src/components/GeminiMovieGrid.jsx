import React from "react";
import MovieList from "./MovieList";

const GeminiMovieGrid = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return <MovieList title={title} movies={movies} isLoading={false} />;
};

export default GeminiMovieGrid;
