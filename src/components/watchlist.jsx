// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { removeFav } from "../utils/favoritesSlice";
// import { IMG_CDN_URL } from "../utils/constant";
// import { motion } from "framer-motion";
// import { FaStar } from "react-icons/fa";
// import { BsBookmarkDashFill } from "react-icons/bs";
// import { createPortal } from "react-dom";
// import useMovieTrailer from "../hooks/useMovieTrailer";
// import SeriesRatingsChart from "./SeriesRatingsChart"; // Import the SeriesRatingsChart component

// const Watchlist = () => {
//   const dispatch = useDispatch();
//   const Watchlist = useSelector((store) => store.Watchlist.Watchlist);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [showRatings, setShowRatings] = useState(false);

//   // Fetch trailer when modal opens
//   const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
//   useMovieTrailer(selectedMovie?.id);

//   const handleRemove = (movieId) => {
//     dispatch(removeFav(movieId));
//   };

//   const openInfoModal = (movie) => {
//     setSelectedMovie(movie);
//   };

//   const closeInfoModal = () => {
//     setSelectedMovie(null);
//   };

//   const openRatingsChart = () => {
//     if (selectedMovie) {
//       setShowRatings(true);
//     }
//   };

//   const closeRatingsChart = () => {
//     setShowRatings(false);
//   };

//   // Helper function to determine if item is likely a TV series
//   const isTVSeries = (item) => {
//     // Check for common TV series indicators
//     return (
//       item.name || // TV shows often use 'name' instead of 'title'
//       item.first_air_date || // TV specific field
//       item.media_type === "tv" ||
//       (item.title && item.title.includes("Season")) ||
//       (item.title && /S\d+|Season \d+/i.test(item.title))
//     );
//   };

//   return (
//     <div className="min-h-screen pt-20 pb-14 bg-[#0a0a1a] text-white">
//       <h1 className="text-2xl sm:text-3xl text-center mb-8 sm:mb-10">
//         Watchlist
//       </h1>

//       {Watchlist.length === 0 ? (
//         <p className="text-center text-base sm:text-xl">
//           You haven't added any movies to your Watchlist yet.
//         </p>
//       ) : (
//         <div className="flex flex-wrap gap-4 xs:gap-6 justify-start px-4 sm:px-6 mx-auto max-w-[90%]">
//           {Watchlist.map((movie) => (
//             <div
//               key={movie.id}
//               className="relative w-28 xs:w-36 sm:w-44 md:w-44 lg:w-56 flex-shrink-0 mb-4"
//             >
//               <div className="w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
//                 <img
//                   src={IMG_CDN_URL + movie.poster_path}
//                   alt={movie.title || movie?.name || "Movie Card"}
//                   className="w-full h-44 xs:h-52 sm:h-52 md:h-64 lg:h-80 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
//                   onClick={() => openInfoModal(movie)}
//                   loading="lazy"
//                   draggable="false"
//                 />
//                 <div className="p-1.5 sm:p-2 bg-black bg-opacity-80 text-center">
//                   <h3 className="text-white text-xs xs:text-sm sm:text-base font-medium truncate text-center">
//                     {movie.title || movie?.name || "Movie Title"}
//                   </h3>
//                   <div className="flex items-center justify-center mt-0.5 sm:mt-1">
//                     {movie.vote_average && (
//                       <>
//                         <FaStar className="text-yellow-500 mr-1 text-[10px] xs:text-xs sm:text-sm" />
//                         <span className="text-white text-[10px] xs:text-xs sm:text-sm">
//                           {Math.round(movie.vote_average * 10) / 10}
//                         </span>
//                       </>
//                     )}

//                     {/* TV Series badge */}
//                     {isTVSeries(movie) && (
//                       <span className="ml-2 text-[8px] xs:text-[10px] sm:text-xs px-1 py-0.5 bg-blue-700 rounded-sm">
//                         TV
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-2 rounded-full bg-white bg-opacity-20 backdrop-blur-lg shadow-lg
//                 hover:bg-opacity-40 hover:shadow-xl hover:scale-110
//                 active:scale-90 active:shadow-md
//                 transition-all duration-300 ease-in-out"
//                 onClick={() => handleRemove(movie.id)}
//                 aria-label="Remove from favorites"
//               >
//                 <BsBookmarkDashFill className="text-sm sm:text-lg md:text-xl text-gray-800 transition-colors duration-300" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Movie Info Modal */}
//       {selectedMovie &&
//         createPortal(
//           <>
//             <div
//               className="fixed inset-0 bg-black opacity-80 z-[10000]"
//               onClick={closeInfoModal}
//             ></div>

//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.3 }}
//               className="fixed inset-0 flex items-center justify-center z-[10001] px-2 sm:px-0"
//               onClick={closeInfoModal}
//             >
//               <div
//                 className="w-full max-w-[85vw] sm:w-[85vw] md:w-[70vw]
//                 max-h-[90vh]
//                 max-sm:max-h-[70vh]
//                 bg-neutral-900 text-white p-4 sm:p-8 rounded-lg relative overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <button
//                   onClick={closeInfoModal}
//                   className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer text-lg"
//                   aria-label="Close modal"
//                 >
//                   ×
//                 </button>
//                 <div className="flex flex-col md:flex-row">
//                   <div className="w-full md:w-[37%] h-auto rounded-2xl mb-4 md:mb-0">
//                     <img
//                       src={IMG_CDN_URL + selectedMovie.poster_path}
//                       alt={selectedMovie.title || "Movie poster"}
//                       className="w-full h-72 md:h-full rounded-lg object-cover"
//                       loading="lazy"
//                       draggable="false"
//                     />
//                   </div>
//                   <div className="md:w-2/3 md:ml-8">
//                     <h1 className="text-xl sm:text-2xl md:text-4xl my-2 font-semibold">
//                       {selectedMovie.title ||
//                         selectedMovie.name ||
//                         "Movie Title"}
//                     </h1>
//                     <p className="text-gray-300 text-xs sm:text-sm my-1">
//                       Release Date:{" "}
//                       {selectedMovie.release_date ||
//                         selectedMovie.first_air_date ||
//                         "N/A"}
//                     </p>
//                     <p className="my-2 sm:my-4 text-sm sm:text-base">
//                       {selectedMovie.overview || "No description available."}
//                     </p>
//                     {selectedMovie.vote_average && (
//                       <p className="my-2 sm:my-4 flex items-center text-sm sm:text-base">
//                         Rating: <FaStar className="text-yellow-500 ml-2 mr-1" />
//                         {Math.round(selectedMovie.vote_average * 10) / 10}/10
//                       </p>
//                     )}
//                     <hr className="border-gray-400" />
//                     {selectedMovie.original_language && (
//                       <p className="py-2 sm:py-4 text-sm sm:text-base">
//                         Language:{" "}
//                         {selectedMovie.original_language.toUpperCase()}
//                       </p>
//                     )}

//                     {/* Action Buttons */}
//                     <div className="mt-4 sm:mt-8 flex flex-wrap gap-3">
//                       {/* Watch Trailer Button (Only for Movies) */}
//                       {selectedMovie.title && trailerVideo?.key && (
//                         <a
//                           href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-red-700 transition-colors"
//                         >
//                           Watch Trailer
//                         </a>
//                       )}

//                       {/* Episode Ratings Button (Only for TV Shows) */}
//                       {isTVSeries(selectedMovie) && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openRatingsChart();
//                           }}
//                           className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors"
//                         >
//                           View Episode Ratings
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </>,
//           document.body
//         )}

//       {/* Series Ratings Chart Modal */}
//       <SeriesRatingsChart
//         title={selectedMovie?.title || selectedMovie?.name || ""}
//         isVisible={showRatings}
//         onClose={closeRatingsChart}
//       />
//     </div>
//   );
// };

// export default Watchlist;

import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFav } from "../utils/favoritesSlice";
import { IMG_CDN_URL } from "../utils/constant";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { BsBookmarkDashFill } from "react-icons/bs";
import { createPortal } from "react-dom";
import useMovieTrailer from "../hooks/useMovieTrailer";
import SeriesRatingsChart from "./SeriesRatingsChart";
import { RiBarChartFill } from "react-icons/ri";

const Watchlist = () => {
  const dispatch = useDispatch();
  const Watchlist = useSelector((store) => store.Watchlist.Watchlist);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showRatings, setShowRatings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const modalRef = useRef(null);

  // Fetch trailer when modal opens
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  useMovieTrailer(selectedMovie?.id);

  const handleRemove = (movieId) => {
    // For mobile, first show confirmation
    if (window.innerWidth < 640) {
      // If already showing confirmation for this movie, then delete it
      if (confirmDelete === movieId) {
        dispatch(removeFav(movieId));
        setConfirmDelete(null);
      } else {
        // First tap just shows confirmation
        setConfirmDelete(movieId);
        // Auto-hide confirmation after 3 seconds
        setTimeout(() => setConfirmDelete(null), 3000);
      }
    } else {
      // On desktop, delete immediately
      dispatch(removeFav(movieId));
    }
  };

  const openInfoModal = (movie) => {
    setSelectedMovie(movie);
    // Reset any delete confirmations when opening a modal
    setConfirmDelete(null);
  };

  const closeInfoModal = () => {
    setSelectedMovie(null);
  };

  const openRatingsChart = () => {
    if (selectedMovie) {
      setShowRatings(true);
    }
  };

  const closeRatingsChart = () => {
    setShowRatings(false);
  };

  // Helper function to determine if item is likely a TV series
  const isTVSeries = (item) => {
    // Check for common TV series indicators
    return (
      item.name || // TV shows often use 'name' instead of 'title'
      item.first_air_date || // TV specific field
      item.media_type === "tv" ||
      (item.title && item.title.includes("Season")) ||
      (item.title && /S\d+|Season \d+/i.test(item.title))
    );
  };

  // Filter watchlist by type
  const [filterType, setFilterType] = useState("all");
  const filteredWatchlist =
    filterType === "all"
      ? Watchlist
      : filterType === "tv"
      ? Watchlist.filter((item) => isTVSeries(item))
      : Watchlist.filter((item) => !isTVSeries(item));

  // Sort function
  const [sortBy, setSortBy] = useState("none");
  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (sortBy === "rating-high") {
      return (b.vote_average || 0) - (a.vote_average || 0);
    } else if (sortBy === "rating-low") {
      return (a.vote_average || 0) - (b.vote_average || 0);
    } else if (sortBy === "name") {
      const aName = a.title || a.name || "";
      const bName = b.title || b.name || "";
      return aName.localeCompare(bName);
    }
    return 0;
  });

  return (
    <div className="min-h-screen pt-16 pb-14 bg-[#0a0a1a] text-white">
      <h1 className="text-2xl sm:text-3xl text-center mb-4 sm:mb-8">
        Watchlist
      </h1>

      {/* Mobile-optimized filter and sort controls */}
      {Watchlist.length > 0 && (
        <div className="px-4 sm:px-6 mx-auto max-w-[90%] mb-4">
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 justify-between bg-black bg-opacity-40 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300">Filter:</span>
              <div className="flex text-xs">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2 py-1 rounded-l-md ${
                    filterType === "all" ? "bg-blue-700" : "bg-gray-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("movie")}
                  className={`px-2 py-1 ${
                    filterType === "movie" ? "bg-blue-700" : "bg-gray-800"
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setFilterType("tv")}
                  className={`px-2 py-1 rounded-r-md ${
                    filterType === "tv" ? "bg-blue-700" : "bg-gray-800"
                  }`}
                >
                  TV Shows
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-gray-800 px-2 py-1 rounded-md"
              >
                <option value="none">Recent</option>
                <option value="rating-high">Highest Rating</option>
                <option value="rating-low">Lowest Rating</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {sortedWatchlist.length === 0 ? (
        <div className="text-center px-4 py-8">
          <p className="text-base sm:text-xl mb-4">
            {Watchlist.length === 0
              ? "You haven't added any movies or shows to your Watchlist yet."
              : "No items match your current filter."}
          </p>
          {Watchlist.length > 0 && (
            <button
              onClick={() => setFilterType("all")}
              className="px-4 py-2 bg-blue-600 rounded-md text-sm"
            >
              Show All Items
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 xs:gap-4 px-3 sm:px-6 mx-auto max-w-[95%]">
          {sortedWatchlist.map((movie) => (
            <div
              key={movie.id}
              className="relative flex flex-col bg-black bg-opacity-30 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className="w-full aspect-[2/3] overflow-hidden cursor-pointer"
                onClick={() => openInfoModal(movie)}
              >
                <img
                  src={IMG_CDN_URL + movie.poster_path}
                  alt={movie.title || movie?.name || "Movie Card"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  draggable="false"
                />
              </div>

              <div className="p-1.5 flex-grow flex flex-col">
                <h3 className="text-white text-xs xs:text-sm font-medium truncate mb-auto">
                  {movie.title || movie?.name || "Movie Title"}
                </h3>
                <div className="flex items-center text-[10px] xs:text-xs mt-1 justify-between">
                  <div className="flex items-center">
                    {movie.vote_average ? (
                      <>
                        <FaStar className="text-yellow-500 mr-1 text-[10px] xs:text-xs" />
                        <span>{Math.round(movie.vote_average * 10) / 10}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">No rating</span>
                    )}
                  </div>

                  {/* TV Series badge */}
                  {isTVSeries(movie) && (
                    <span className="text-[8px] xs:text-[10px] px-1 py-0.5 bg-blue-700 rounded-sm">
                      TV
                    </span>
                  )}
                </div>
              </div>

              <button
                className={`absolute top-1 right-1 p-1.5 rounded-full shadow-lg 
                  transition-all duration-300 ease-in-out
                  ${
                    confirmDelete === movie.id
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-black bg-opacity-40 text-white"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(movie.id);
                }}
                aria-label={
                  confirmDelete === movie.id
                    ? "Confirm remove"
                    : "Remove from watchlist"
                }
              >
                <BsBookmarkDashFill className="text-sm" />
              </button>

              {confirmDelete === movie.id && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[8px] xs:text-xs py-1 text-center">
                  Tap again to remove
                </div>
              )}
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
              className="fixed inset-0 flex items-center justify-center z-[10001] p-2 sm:px-0"
              onClick={closeInfoModal}
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
                  onClick={closeInfoModal}
                  className="sticky top-0 float-right text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer text-lg z-10"
                  aria-label="Close modal"
                >
                  ×
                </button>

                <div className="clear-both"></div>

                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-[37%] h-auto rounded-lg mb-4 sm:mb-0">
                    <img
                      src={IMG_CDN_URL + selectedMovie.poster_path}
                      alt={selectedMovie.title || "Movie poster"}
                      className="w-full h-60 sm:h-72 md:h-auto rounded-lg object-cover"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                  <div className="sm:w-2/3 sm:ml-6 md:ml-8">
                    <div className="text-white px-2 sm:px-0">
                      <h1 className="text-lg sm:text-xl md:text-3xl my-2 font-semibold line-clamp-2">
                        {selectedMovie.title ||
                          selectedMovie.name ||
                          "Movie Title"}
                      </h1>
                      <p className="text-gray-300 text-xs sm:text-sm my-1">
                        Release Date:{" "}
                        {selectedMovie.release_date ||
                          selectedMovie.first_air_date ||
                          "N/A"}
                      </p>
                      <p className="my-2 sm:my-4 text-xs sm:text-sm md:text-base line-clamp-4 sm:line-clamp-none">
                        {selectedMovie.overview || "No description available."}
                      </p>
                      {selectedMovie.vote_average && (
                        <p className="my-2 sm:my-4 flex items-center text-xs sm:text-sm md:text-base">
                          Rating:{" "}
                          <FaStar className="text-yellow-500 ml-2 mr-1" />
                          {Math.round(selectedMovie.vote_average * 10) / 10}/10
                        </p>
                      )}
                      <hr className="border-gray-400" />
                      {selectedMovie.original_language && (
                        <p className="py-2 sm:py-4 text-xs sm:text-sm md:text-base">
                          Language:{" "}
                          {selectedMovie.original_language.toUpperCase()}
                        </p>
                      )}
                      {selectedMovie.genres &&
                        selectedMovie.genres.length > 0 && (
                          <>
                            <hr className="border-gray-400" />
                            <p className="py-2 sm:py-4 text-xs sm:text-sm md:text-base overflow-x-auto">
                              Genres:{" "}
                              {selectedMovie.genres
                                .map((genre) => genre.name)
                                .join(", ")}
                            </p>
                          </>
                        )}
                      <hr className="border-gray-400" />
                      <div className="mt-3 sm:mt-6 flex flex-wrap gap-2 sm:gap-4">
                        {selectedMovie.title && trailerVideo?.key ? (
                          <a
                            href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-red-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Watch Trailer
                          </a>
                        ) : (
                          selectedMovie.title && (
                            <p className="text-xs sm:text-sm">
                              No trailer available
                            </p>
                          )
                        )}

                        {/* Episode Ratings Button - Show for TV shows */}
                        {isTVSeries(selectedMovie) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRatingsChart();
                            }}
                            className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center"
                          >
                            {/* If you don't want to add the RiBarChartFill import, you can remove it from here */}
                            <RiBarChartFill className="mr-1 sm:mr-2" /> Episode
                            Ratings
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>,
          document.body
        )}

      {/* Series Ratings Chart Modal */}
      <SeriesRatingsChart
        title={selectedMovie?.title || selectedMovie?.name || ""}
        isVisible={showRatings}
        onClose={closeRatingsChart}
      />
    </div>
  );
};

// Helper function to determine color based on rating
const getColorClass = (rating) => {
  if (rating === "?" || rating === "N/A" || !rating) return "bg-gray-500";
  const numRating = parseFloat(rating);
  if (isNaN(numRating) || numRating < 7.0) return "bg-red-600";
  if (numRating < 8.0) return "bg-yellow-500";
  if (numRating < 9.0) return "bg-green-500";
  return "bg-green-700";
};

export default Watchlist;
