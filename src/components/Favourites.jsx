import React from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";

const Favourites = () => {
  // Get favorites from Redux store
  const favorites = useSelector((store) => store.favorites?.items || []);

  return (
    <div>
      <Header />
      <div className="pt-28 min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Favourites</h1>

          {favorites.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 mb-6">
                You haven't added any favorites yet.
              </p>
              <Link to="/browse">
                <button className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300">
                  Browse Movies
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-4">
                {favorites.length} {favorites.length === 1 ? "movie" : "movies"}{" "}
                in your favorites
              </p>
              <div className="flex flex-wrap gap-4">
                {favorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    posterPath={movie.poster_path}
                    movieData={movie}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favourites;
