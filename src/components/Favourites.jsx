import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFav } from "../utils/favoritesSlice";
import { IMG_CDN_URL } from "../utils/constant";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkDashFill } from "react-icons/bs";
import { createPortal } from "react-dom";

const Favourites = () => {
  const dispatch = useDispatch();
  const favourites = useSelector((store) => store.favourites.favourites);
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
      <h1 className="text-3xl text-center mb-10">Favourites</h1>

      {favourites.length === 0 ? (
        <p className="text-center text-xl">
          You haven't added any movies to your favourites yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {favourites.map((movie) => (
            <div
              key={movie.id}
              className="relative w-36 md:w-44 lg:w-56 flex-shrink-0"
            >
              <img
                src={IMG_CDN_URL + movie.poster_path}
                alt={movie.title || "Movie"}
                className="w-full h-52 md:h-64 lg:h-80 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => openInfoModal(movie)}
              />
              <button
                className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full hover:bg-opacity-80"
                onClick={() => handleRemove(movie.id)}
              >
                <BsBookmarkDashFill className="text-lg text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedMovie &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
              onClick={closeInfoModal}
            ></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={closeInfoModal}
            >
              <div
                className="w-4/5 md:w-2/3 bg-white p-6 rounded-lg text-black relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeInfoModal}
                  className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  &times;
                </button>
                <div className="flex flex-col md:flex-row">
                  <img
                    src={IMG_CDN_URL + selectedMovie.poster_path}
                    alt="poster"
                    className="w-full md:w-1/3 rounded-lg"
                  />
                  <div className="md:ml-6">
                    <h1 className="text-2xl font-semibold">
                      {selectedMovie.title || selectedMovie.name}
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Release Date: {selectedMovie.release_date}
                    </p>
                    <p className="my-4">{selectedMovie.overview}</p>
                    <p className="flex items-center">
                      Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />{" "}
                      {Math.round(selectedMovie.vote_average * 10) / 10}/10
                    </p>
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

export default Favourites;
