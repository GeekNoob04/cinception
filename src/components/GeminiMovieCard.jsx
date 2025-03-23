import React, { useState, useCallback, useMemo } from "react";
import { IMG_CDN_URL } from "../utils/constant";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkPlusFill, BsFillBookmarkCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

// Extracted components for better organization
const LoadingPlaceholder = React.memo(() => (
  <>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-24 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
  </>
));

const MovieDetails = React.memo(({ displayData, trailerVideo, isLoading }) => (
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
const MovieModal = React.memo(
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

const GeminiMovieCard = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get trailer video and movie details from Redux store
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  const movieDetails = useSelector((store) => store.movies?.movieDetails);

  // Use the hook conditionally with the movie ID
  useMovieTrailer(showInfoModal && movie?.id ? movie.id : null);

  // Use the combined data - prefer Redux state for detailed view but fallback to props
  const displayData = useMemo(
    () => (showInfoModal && movieDetails ? movieDetails : movie),
    [showInfoModal, movieDetails, movie]
  );

  const posterPath = movie?.poster_path;

  // Early return if no poster
  if (!posterPath) {
    console.log("No poster path for movie:", movie?.title || "Unknown movie");
    return null;
  }

  // Memoize event handlers to prevent unnecessary re-renders
  const handleFavoriteToggle = useCallback((e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  }, []);

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
    <div className="relative w-36 md:w-44 lg:w-56 flex-shrink-0 mb-4">
      <div className="w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <img
          src={IMG_CDN_URL + posterPath}
          alt={movie?.title || "Movie Card"}
          className="w-full h-52 md:h-64 lg:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleShowInfo}
          loading="lazy"
        />
        <div className="p-2 bg-gray-900 bg-opacity-80">
          <h3 className="text-white text-sm md:text-base font-medium truncate">
            {movie?.title || movie?.name || "Movie Title"}
          </h3>
          {movie?.vote_average && (
            <div className="flex items-center mt-1">
              <FaStar className="text-yellow-500 mr-1 text-xs md:text-sm" />
              <span className="text-white text-xs md:text-sm">
                {Math.round(movie.vote_average * 10) / 10}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        className="absolute top-2 right-2 bg-black bg-opacity-60 p-1 rounded-full text-white hover:bg-opacity-80 transition-opacity"
        onClick={handleFavoriteToggle}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <BsFillBookmarkCheckFill className="text-lg md:text-xl" />
        ) : (
          <BsBookmarkPlusFill className="text-lg md:text-xl" />
        )}
      </button>

      <MovieModal
        showInfoModal={showInfoModal}
        closeModal={closeModal}
        stopPropagation={stopPropagation}
        displayData={displayData}
        trailerVideo={trailerVideo}
        isLoading={isLoading}
        posterPath={posterPath}
      />
    </div>
  );
};

GeminiMovieCard.displayName = "GeminiMovieCard";

export default GeminiMovieCard;
