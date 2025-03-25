import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFav } from "../utils/favoritesSlice";
import { IMG_CDN_URL } from "../utils/constant";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkDashFill } from "react-icons/bs";
import { createPortal } from "react-dom";

const Watchlist = () => {
  const dispatch = useDispatch();
  const Watchlist = useSelector((store) => store.Watchlist.Watchlist);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleRemove = (movieId) => {
    dispatch(removeFav(movieId));
  };

  const openInfoModal = (movie) => {
    setSelectedMovie(movie);
  };

  const closeInfoModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-14 bg-gray-900 text-white">
      <h1 className="text-3xl text-center mb-10">Watchlist</h1>

      {Watchlist.length === 0 ? (
        <p className="text-center text-xl">
          You haven't added any movies to your Watchlist yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {Watchlist.map((movie) => (
            <div
              key={movie.id}
              className="relative w-36 md:w-44 lg:w-56 flex-shrink-0 mb-4"
            >
              <div className="w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={IMG_CDN_URL + movie.poster_path}
                  alt={movie.title || "Movie Card"}
                  className="w-full h-52 md:h-64 lg:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openInfoModal(movie)}
                  loading="lazy"
                />
                <div className="p-2 bg-black bg-opacity-80 text-center">
                  <h3 className="text-white text-sm md:text-base font-medium truncate text-center">
                    {movie.title || "Movie Title"}
                  </h3>
                  {movie.vote_average && (
                    <div className="flex items-center justify-center mt-1">
                      <FaStar className="text-yellow-500 mr-1 text-xs md:text-sm" />
                      <span className="text-white text-xs md:text-sm">
                        {Math.round(movie.vote_average * 10) / 10}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-lg shadow-lg 
  hover:bg-opacity-40 hover:shadow-xl hover:scale-110 
  active:scale-90 active:shadow-md 
  transition-all duration-300 ease-in-out"
                onClick={() => handleRemove(movie.id)}
                aria-label="Remove from favorites"
              >
                <BsBookmarkDashFill className="text-lg md:text-xl text-gray-800 transition-colors duration-300" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMovie &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black opacity-80 z-[10000]"
              onClick={closeInfoModal}
            ></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-[10001]"
              onClick={closeInfoModal}
            >
              <div
                className="w-[85vw] md:w-[70vw] h-[90vh] md:h-auto bg-neutral-900 text-white p-8 rounded-lg relative overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeInfoModal}
                  className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label="Close modal"
                >
                  &times;
                </button>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-[37%] h-auto rounded-2xl mb-4 md:mb-0">
                    <img
                      src={IMG_CDN_URL + selectedMovie.poster_path}
                      alt={selectedMovie.title || "Movie poster"}
                      className="w-full h-72 md:h-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="md:w-2/3 md:ml-8">
                    <h1 className="text-2xl md:text-4xl my-2 font-semibold">
                      {selectedMovie.title ||
                        selectedMovie.name ||
                        "Movie Title"}
                    </h1>
                    <p className="text-gray-300 text-sm my-1">
                      Release Date:{" "}
                      {selectedMovie.release_date ||
                        selectedMovie.first_air_date ||
                        "N/A"}
                    </p>
                    <p className="my-4">
                      {selectedMovie.overview || "No description available."}
                    </p>
                    {selectedMovie.vote_average && (
                      <p className="my-4 flex items-center">
                        Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />
                        {Math.round(selectedMovie.vote_average * 10) / 10}/10
                      </p>
                    )}
                    <hr className="border-gray-400" />
                    {selectedMovie.original_language && (
                      <p className="py-4">
                        Language:{" "}
                        {selectedMovie.original_language.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>,
          document.body
        )}
    </div>
  );
};

export default Watchlist;
