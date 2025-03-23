import React from "react";
import MovieCard from "./MovieCard";
import ShimmerUi from "./ShimmerUi";

const MovieList = ({ title, movies }) => {
  // console.log(movies);
  return (
    <div className="px-6">
      <h1 className="text-3xl py-4 text-white">{title}</h1>
      <div className="flex overflow-x-scroll">
        <div className="flex">
          {movies && movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.id} posterPath={movie.poster_path} />
            ))
          ) : (
            <ShimmerUi />
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
