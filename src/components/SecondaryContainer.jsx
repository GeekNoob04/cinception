import React from "react";
import MovieList from "./MovieList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);

  if (!movies.nowPlayingMovies) return null;

  return (
    <div className="bg-black">
      <div className="-mt-16 md:-mt-32 relative z-20 pb-12">
        <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
        <MovieList title={"Top Rated"} movies={movies.nowTopRatedMovies} />
        <MovieList title={"Popular"} movies={movies.nowPopularMovies} />
        <MovieList
          title={"Upcoming Movies"}
          movies={movies.nowUpcomingMovies}
        />
        <MovieList
          title={"Top Rated Series"}
          movies={movies.nowTopRatedSeries}
        />
      </div>
    </div>
  );
};

export default SecondaryContainer;
