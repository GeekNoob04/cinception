import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFav, removeFav } from "../utils/favoritesSlice";
import { IMG_CDN_URL } from "../utils/constant";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkPlusFill, BsFillBookmarkCheckFill } from "react-icons/bs";
import { RiBarChartFill } from "react-icons/ri";
import useMovieTrailer from "../hooks/useMovieTrailer";
import SeriesRatingsChart from "./SeriesRatingsChart";

const LoadingPlaceholder = React.memo(() => (
  <>
    <div className="h-6 sm:h-8 bg-gray-300 rounded w-3/4 mb-3 sm:mb-4 animate-pulse"></div>
    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-16 sm:h-24 bg-gray-300 rounded w-full mb-3 sm:mb-4 animate-pulse"></div>
    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
    <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
    <div className="h-3 sm:h-4 bg-gray-300 rounded w-full animate-pulse"></div>
  </>
));

const MovieDetails = React.memo(
  ({ displayData, trailerVideo, isLoading, handleShowEpisodeRatings }) => (
    <div className="text-white px-2 sm:px-0">
      <h1 className="text-lg sm:text-xl md:text-3xl my-2 font-semibold line-clamp-2">
        {displayData?.title || displayData?.name || "Movie Title"}
      </h1>
      <p className="text-gray-300 text-xs sm:text-sm my-1">
        Release Date:{" "}
        {displayData?.release_date || displayData?.first_air_date || "N/A"}
      </p>
      <p className="my-2 sm:my-4 text-xs sm:text-sm md:text-base line-clamp-4 sm:line-clamp-none">
        {displayData?.overview || "No description available."}
      </p>
      {displayData?.vote_average && (
        <p className="my-2 sm:my-4 flex items-center text-xs sm:text-sm md:text-base">
          Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />
          {Math.round(displayData.vote_average * 10) / 10}/10
        </p>
      )}
      <hr className="border-gray-400" />
      {displayData?.original_language && (
        <p className="py-2 sm:py-4 text-xs sm:text-sm md:text-base">
          Language: {displayData.original_language.toUpperCase()}
        </p>
      )}
      {displayData?.genres && displayData.genres.length > 0 && (
        <>
          <hr className="border-gray-400" />
          <p className="py-2 sm:py-4 text-xs sm:text-sm md:text-base overflow-x-auto">
            Genres: {displayData.genres.map((genre) => genre.name).join(", ")}
          </p>
        </>
      )}
      <hr className="border-gray-400" />
      <div className="mt-3 sm:mt-6 flex flex-wrap gap-2 sm:gap-4">
        {displayData?.title && trailerVideo?.key ? (
          <a
            href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-red-700 transition-colors"
          >
            Watch Trailer
          </a>
        ) : (
          !isLoading &&
          displayData?.title && (
            <p className="text-xs sm:text-sm">No trailer available</p>
          )
        )}

        {/* Episode Ratings Button - Show for TV shows */}
        {(displayData?.first_air_date || displayData?.name) && (
          <button
            onClick={handleShowEpisodeRatings}
            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
          >
            <RiBarChartFill className="mr-1 sm:mr-2" /> Episode Ratings
          </button>
        )}
      </div>
    </div>
  )
);

const MovieModal = React.memo(
  ({
    showInfoModal,
    closeModal,
    displayData,
    trailerVideo,
    isLoading,
    posterPath,
    handleShowEpisodeRatings,
  }) => {
    if (!showInfoModal) return null;

    return createPortal(
      <>
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black opacity-80 z-[10000]"
        ></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-[10001] p-2 sm:px-0"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[95vw] sm:max-w-[85vw] md:w-[70vw] 
            max-h-[90vh] 
            overflow-y-auto 
            bg-neutral-900 text-white p-3 sm:p-6 md:p-8 rounded-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky close button that's easier to reach on mobile */}
            <button
              onClick={closeModal}
              className="sticky top-0 float-right text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer text-lg z-10"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="clear-both"></div>

            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-[37%] h-auto rounded-lg mb-4 sm:mb-0">
                {isLoading ? (
                  <div className="w-full h-60 sm:h-72 md:h-[30rem] bg-gray-300 rounded-lg animate-pulse"></div>
                ) : (
                  <img
                    src={
                      displayData?.poster_path
                        ? IMG_CDN_URL + displayData.poster_path
                        : IMG_CDN_URL + posterPath
                    }
                    alt={displayData?.title || "Movie poster"}
                    className="w-full h-60 sm:h-72 md:h-auto rounded-lg object-cover"
                    loading="lazy"
                    draggable="false"
                  />
                )}
              </div>
              <div className="sm:w-2/3 sm:ml-6 md:ml-8">
                {isLoading ? (
                  <LoadingPlaceholder />
                ) : (
                  <MovieDetails
                    displayData={displayData}
                    trailerVideo={trailerVideo}
                    isLoading={isLoading}
                    handleShowEpisodeRatings={handleShowEpisodeRatings}
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

const GeminiMovieCard = ({ movie }) => {
  const dispatch = useDispatch();
  const Watchlist = useSelector((store) => store.Watchlist.Watchlist);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSeriesRatings, setShowSeriesRatings] = useState(false);

  const isFavorite = useMemo(
    () => Watchlist.some((fav) => fav.id === movie.id),
    [Watchlist, movie.id]
  );

  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);

  useMovieTrailer(showInfoModal && movie?.id ? movie.id : null);

  const posterPath = movie?.poster_path;
  if (!posterPath) return null;

  const handleFavoriteToggle = useCallback(
    (e) => {
      e.stopPropagation();
      if (isFavorite) {
        dispatch(removeFav(movie.id));
      } else {
        dispatch(addFav(movie));
      }
    },
    [dispatch, isFavorite, movie]
  );

  const handleShowInfo = useCallback(() => {
    setIsLoading(true);
    setShowInfoModal(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const closeModal = useCallback(() => {
    setShowInfoModal(false);
  }, []);

  const handleShowEpisodeRatings = useCallback((e) => {
    if (e) e.preventDefault();
    setShowInfoModal(false);
    setTimeout(() => {
      setShowSeriesRatings(true);
    }, 300);
  }, []);

  const handleCloseEpisodeRatings = useCallback(() => {
    setShowSeriesRatings(false);
  }, []);

  // Determine if this is a TV series
  const isTvSeries = movie?.first_air_date || movie?.name;

  return (
    <div className="relative w-28 xs:w-32 sm:w-40 md:w-44 lg:w-56 flex-shrink-0 mb-4 transform transition-all duration-300 hover:scale-105">
      <div className="w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img
            src={IMG_CDN_URL + posterPath}
            alt={movie?.title || "Movie Card"}
            className="w-full h-40 xs:h-48 sm:h-52 md:h-64 lg:h-80 object-cover cursor-pointer"
            onClick={handleShowInfo}
            loading="lazy"
            draggable="false"
          />

          {/* Add tap-friendly area for mobile */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleShowInfo}
            aria-label="View details"
          ></div>
        </div>

        <div className="p-1.5 sm:p-2 bg-gray-900/20 bg-opacity-80 text-center">
          <h3 className="text-white text-xs xs:text-sm font-medium truncate text-center">
            {movie?.title || movie?.name || "Movie Title"}
          </h3>
          <div className="flex items-center justify-center mt-0.5 sm:mt-1">
            {movie?.vote_average && (
              <>
                <FaStar className="text-yellow-500 mr-1 text-[10px] xs:text-xs" />
                <span className="text-white text-[10px] xs:text-xs">
                  {Math.round(movie.vote_average * 10) / 10}
                </span>
              </>
            )}

            {/* Small indicator for TV series */}
            {isTvSeries && (
              <span className="ml-2 text-[8px] xs:text-[10px] bg-blue-600 text-white px-1 rounded">
                TV
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Larger, more touch-friendly favorite button */}
      <button
        className="absolute top-1 right-1 p-1.5 rounded-full bg-white bg-opacity-20 backdrop-blur-lg shadow-lg 
        hover:bg-opacity-40 active:scale-90
        transition-all duration-300 ease-in-out"
        onClick={handleFavoriteToggle}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? (
          <BsFillBookmarkCheckFill className="text-sm md:text-lg text-red-600 transition-colors duration-300" />
        ) : (
          <BsBookmarkPlusFill className="text-sm md:text-lg text-gray-800 transition-colors duration-300" />
        )}
      </button>

      <MovieModal
        showInfoModal={showInfoModal}
        closeModal={closeModal}
        displayData={movie}
        trailerVideo={trailerVideo}
        isLoading={isLoading}
        posterPath={posterPath}
        handleShowEpisodeRatings={handleShowEpisodeRatings}
      />

      <SeriesRatingsChart
        title={movie?.name || movie?.title}
        isVisible={showSeriesRatings}
        onClose={handleCloseEpisodeRatings}
      />
    </div>
  );
};

export default GeminiMovieCard;
