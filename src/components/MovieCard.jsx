import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
import { IMG_CDN_URL } from "../utils/constant";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkPlusFill, BsFillBookmarkCheckFill } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { addFavorite, removeFavorite } from "../utils/favoritesSlice";

// Extracted components for better organization
const LoadingPlaceholder = memo(() => (
  <>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-24 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
  </>
));

const MovieDetails = memo(({ displayData, trailerVideo, isLoading }) => (
  <>
    <h1 className="text-2xl md:text-4xl my-2 font-semibold text-gray-800">
      {displayData?.title || displayData?.name || "Movie Title"}
    </h1>
    <p className="text-gray-600 text-sm my-1">
      Release Date:{" "}
      {displayData?.release_date || displayData?.first_air_date || "N/A"}
    </p>
    <p className="my-4 text-gray-700">
      {displayData?.overview || "No description available."}
    </p>
    {displayData?.vote_average && (
      <p className="my-4 flex items-center">
        Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />
        {Math.round(displayData.vote_average * 10) / 10}/10
      </p>
    )}
    <hr />
    {displayData?.original_language && (
      <p className="py-4">
        Language: {displayData.original_language.toUpperCase()}
      </p>
    )}
    {displayData?.genres && displayData.genres.length > 0 && (
      <>
        <hr />
        <p className="py-4">
          Genres: {displayData.genres.map((genre) => genre.name).join(", ")}
        </p>
      </>
    )}
    <hr />
    <div className="mt-8">
      {trailerVideo?.key ? (
        <a
          href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Watch Trailer
        </a>
      ) : (
        !isLoading && <p>No trailer available</p>
      )}
    </div>
  </>
));

// Modal component extracted for better separation of concerns
const MovieModal = memo(
  ({
    showInfoModal,
    closeModal,
    stopPropagation,
    displayData,
    trailerVideo,
    isLoading,
    posterPath,
  }) => {
    if (!showInfoModal) return null;

    return createPortal(
      <>
        {/* Dark Background Overlay */}
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black opacity-70 z-[10000]"
        ></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-[10001]"
          onClick={closeModal}
        >
          <div
            className="w-[85vw] md:w-[70vw] h-[90vh] md:h-auto bg-white p-8 rounded-lg relative overflow-y-auto"
            onClick={stopPropagation}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-[37%] h-auto rounded-2xl mb-4 md:mb-0">
                {isLoading ? (
                  <div className="w-full h-72 md:h-[30rem] bg-gray-200 rounded-lg animate-pulse"></div>
                ) : (
                  <img
                    src={
                      displayData?.poster_path
                        ? IMG_CDN_URL + displayData.poster_path
                        : IMG_CDN_URL + posterPath
                    }
                    alt={displayData?.title || "Movie poster"}
                    className="w-full h-72 md:h-full rounded-lg object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="md:w-2/3 md:ml-8">
                {isLoading ? (
                  <LoadingPlaceholder />
                ) : (
                  <MovieDetails
                    displayData={displayData}
                    trailerVideo={trailerVideo}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </>,
      document.body
    );
  }
);

// Add display names to all memo components
LoadingPlaceholder.displayName = "LoadingPlaceholder";
MovieDetails.displayName = "MovieDetails";
MovieModal.displayName = "MovieModal";

const MovieCard = memo(({ posterPath, movieData }) => {
  const dispatch = useDispatch();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get favorites from Redux store
  const favorites = useSelector((store) => store.favorites?.items || []);

  // Check if this movie is in favorites
  const isFavorite = useMemo(
    () => favorites.some((item) => item.id === movieData?.id),
    [favorites, movieData?.id]
  );

  // Get trailer video and movie details from Redux store
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  const movieDetails = useSelector((store) => store.movies?.movieDetails);

  // Use the hook conditionally with the movie ID
  useMovieTrailer(showInfoModal && movieData?.id ? movieData.id : null);

  // Use the combined data - prefer Redux state for detailed view but fallback to props
  const displayData = useMemo(
    () => (showInfoModal && movieDetails ? movieDetails : movieData),
    [showInfoModal, movieDetails, movieData]
  );

  // Early return if no poster
  if (!posterPath) return null;

  // Memoize event handlers to prevent unnecessary re-renders
  const handleFavoriteToggle = useCallback(
    (e) => {
      e.stopPropagation();

      // If already in favorites, remove it
      if (isFavorite) {
        dispatch(removeFavorite(movieData.id));
      } else {
        // Add to favorites - ensure all needed data is included
        dispatch(
          addFavorite({
            id: movieData.id,
            title: movieData.title || movieData.name,
            poster_path: posterPath,
            overview: movieData.overview,
            vote_average: movieData.vote_average,
            release_date: movieData.release_date || movieData.first_air_date,
            original_language: movieData.original_language,
          })
        );
      }
    },
    [dispatch, isFavorite, movieData, posterPath]
  );

  const handleShowInfo = useCallback(() => {
    setIsLoading(true);
    setShowInfoModal(true);
    // Set loading to false after a short delay to allow for the API call
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const closeModal = useCallback(() => {
    setShowInfoModal(false);
  }, []);

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <>
      <div className="w-48 pr-4 relative">
        <img
          src={IMG_CDN_URL + posterPath}
          alt={movieData?.title || "Movie Card"}
          className="w-full cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleShowInfo}
          loading="lazy"
        />
        <button
          className={`text-white text-3xl absolute top-0 -ml-1 opacity-85 cursor-pointer ${
            isFavorite ? "text-red-500" : ""
          }`}
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <BsFillBookmarkCheckFill /> : <BsBookmarkPlusFill />}
        </button>
      </div>

      <MovieModal
        showInfoModal={showInfoModal}
        closeModal={closeModal}
        stopPropagation={stopPropagation}
        displayData={displayData}
        trailerVideo={trailerVideo}
        isLoading={isLoading}
        posterPath={posterPath}
      />
    </>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
