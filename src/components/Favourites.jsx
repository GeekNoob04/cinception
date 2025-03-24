import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../utils/favoritesSlice";
import { IMG_CDN_URL } from "../utils/constant";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkDashFill } from "react-icons/bs";
import Header from "./Header";

const Favorites = () => {
  const dispatch = useDispatch();
  const [infoDiv, setInfoDiv] = useState(null);
  const favoriteMovies = useSelector((store) => store.favorites.items);

  const handleInfo = (movie) => {
    setInfoDiv(movie);
  };

  const closeInfo = () => {
    setInfoDiv(null);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const handleRemove = (id) => {
    dispatch(removeFavorite(id));
  };

  return (
    <div className="min-h-screen min-w-screen relative pt-36 pb-14">
      <Header />
      <div className="absolute top-0 left-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <h1 className="text-white text-3xl text-center mb-10 md:mb-20">
        Favorites
      </h1>

      {favoriteMovies.length === 0 ? (
        <div className="text-center text-white text-xl">
          <p>You haven't added any movies to your favorites yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center px-8">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="w-48 h-auto relative mb-6">
              <img
                src={IMG_CDN_URL + movie.poster_path}
                alt={movie.title || "Movie poster"}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleInfo(movie)}
              />
              <button
                className="text-white text-3xl absolute top-0 left-0 opacity-85 cursor-pointer"
                onClick={() => handleRemove(movie.id)}
                aria-label="Remove from favorites"
              >
                <BsBookmarkDashFill />
              </button>
            </div>
          ))}
        </div>
      )}

      {infoDiv &&
        createPortal(
          <>
            {/* Dark Background Overlay */}
            <div
              onClick={closeInfo}
              className="fixed inset-0 bg-black opacity-70 z-[10000]"
            ></div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-[10001]"
              onClick={closeInfo}
            >
              <div
                className="w-[85vw] md:w-[70vw] h-[90vh] md:h-auto bg-white p-8 rounded-lg relative overflow-y-auto"
                onClick={stopPropagation}
              >
                <button
                  onClick={closeInfo}
                  className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  &times;
                </button>
                <div className="flex flex-col md:flex-row">
                  <img
                    src={IMG_CDN_URL + infoDiv.poster_path}
                    alt={infoDiv.title || "Movie poster"}
                    className="w-full md:w-[37%] h-auto rounded-2xl mb-4 md:mb-0"
                  />
                  <div className="md:w-2/3 md:ml-8">
                    <h1 className="text-2xl md:text-4xl my-2 font-semibold text-gray-800">
                      {infoDiv.title || infoDiv.name}
                    </h1>
                    <p className="text-gray-600 text-sm my-1">
                      Release Date:{" "}
                      {infoDiv.release_date || infoDiv.first_air_date}
                    </p>
                    <p className="my-4">{infoDiv.overview}</p>
                    <p className="my-4 flex items-center">
                      Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />
                      {Math.round(infoDiv.vote_average * 10) / 10}/10
                    </p>
                    <hr />
                    <p className="py-4">
                      Language: {infoDiv.original_language?.toUpperCase()}
                    </p>
                    <hr />
                  </div>
                </div>
              </div>
            </motion.div>
          </>,
          document.body // Render the modal at the end of the DOM
        )}
    </div>
  );
};

export default Favorites;
