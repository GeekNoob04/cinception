import React, { useState, useEffect } from "react";
import { OMDB_API_KEY } from "../utils/constant";

const SeriesRatingsChart = ({
  title,
  isVisible,
  onClose,
  isFromSearchPage = true,
}) => {
  const [seriesData, setSeriesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [searchAttempts, setSearchAttempts] = useState([]);

  useEffect(() => {
    if (isVisible && title) {
      setIsLoading(true);
      setError(null);
      setFallbackAttempted(false);
      setSearchAttempts([]);
      fetchSeriesData(title);
    }
  }, [isVisible, title]);

  const fetchSeriesData = async (seriesTitle) => {
    try {
      setIsLoading(true);
      setError(null);

      if (searchAttempts.includes(seriesTitle)) {
        throw new Error("Unable to find series data after multiple attempts");
      }

      setSearchAttempts((prev) => [...prev, seriesTitle]);

      const seriesResponse = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
          seriesTitle
        )}&type=series`
      );

      const seriesData = await seriesResponse.json();

      if (seriesData.Response === "False") {
        // Try alternative search strategies
        if (!fallbackAttempted) {
          setFallbackAttempted(true);

          const simplifiedTitle = seriesTitle
            .split(/:|–|-|\(|\)|\[|\]|,/)[0]
            .trim();

          if (simplifiedTitle !== seriesTitle && simplifiedTitle.length > 2) {
            return fetchSeriesData(simplifiedTitle);
          }

          if (seriesTitle.toLowerCase().startsWith("the ")) {
            const titleWithoutThe = seriesTitle.substring(4).trim();
            return fetchSeriesData(titleWithoutThe);
          }

          if (!seriesTitle.toLowerCase().startsWith("the ")) {
            const titleWithThe = "The " + seriesTitle.trim();
            return fetchSeriesData(titleWithThe);
          }
        }

        throw new Error(seriesData.Error || "Series not found");
      }

      const totalSeasons = parseInt(seriesData.totalSeasons || 1);
      const seasonPromises = [];

      for (let season = 1; season <= totalSeasons; season++) {
        seasonPromises.push(
          fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
              seriesTitle
            )}&Season=${season}&type=series`
          ).then((res) => res.json())
        );
      }

      const episodesData = await Promise.all(seasonPromises);

      const formattedData = {
        title: seriesData.Title,
        years: seriesData.Year,
        poster: seriesData.Poster,
        rating: seriesData.imdbRating,
        plot: seriesData.Plot,
        seasons: episodesData.map((seasonData, index) => ({
          season: index + 1,
          episodes: seasonData.Episodes
            ? seasonData.Episodes.map((ep) => ({
                episode: ep.Episode,
                title: ep.Title,
                rating: ep.imdbRating || "?",
              }))
            : [],
        })),
      };

      setSeriesData(formattedData);
      setFallbackAttempted(false);
      setSearchAttempts([]); 
    } catch (err) {
      console.error("Error fetching series data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorClass = (rating) => {
    if (rating === "?" || rating === "N/A" || !rating) return "bg-gray-500";
    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 7.0) return "bg-red-600";
    if (numRating < 8.0) return "bg-yellow-500";
    if (numRating < 9.0) return "bg-green-500";
    return "bg-green-700";
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[10002] flex items-center justify-center p-1 sm:p-2 md:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-lg p-2 sm:p-4 md:p-6 w-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-2 right-2 z-10 bg-neutral-800 rounded-full p-1 sm:hidden"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
            <p className="text-white text-sm sm:text-base md:text-lg">
              Loading series data...
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 px-2 text-center">
              Searching for: "{title}"
            </p>
          </div>
        ) : error ? (
          <div className="text-center p-3 sm:p-4 md:p-8 mb-14 sm:mb-16">
            <div className="text-red-500 text-base sm:text-lg md:text-xl mb-2">
              Unable to find episode ratings
            </div>
            <p className="text-white text-xs sm:text-sm md:text-base">
              {error}
            </p>
            <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm">
              This might not be a TV series or could be listed under a different
              name in our database.
            </p>
            <button
              onClick={() =>
                window.open(
                  `https://www.imdb.com/find/?q=${encodeURIComponent(
                    title
                  )}&s=tt&ttype=tv`,
                  "_blank"
                )
              }
              className="mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm md:text-base"
            >
              Search on IMDb
            </button>
          </div>
        ) : seriesData ? (
          <div className="text-white pb-14 sm:pb-16 pt-2 sm:pt-0">
            {/* Responsive header section */}
            <div className="sm:flex gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              {seriesData.poster && seriesData.poster !== "N/A" ? (
                <div className="mb-2 sm:mb-0 flex-shrink-0 text-center sm:text-left">
                  <img
                    src={seriesData.poster}
                    alt={`${seriesData.title} poster`}
                    className="w-24 sm:w-28 md:w-40 inline-block sm:inline rounded"
                  />
                </div>
              ) : null}
              <div>
                <h2 className="text-base sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 mt-1 sm:mt-2 text-center sm:text-left">
                  {seriesData.title}
                  {seriesData.years ? ` (${seriesData.years})` : ""}
                </h2>
                {seriesData.rating && seriesData.rating !== "N/A" ? (
                  <div className="flex items-center mb-2 sm:mb-3 justify-center sm:justify-start">
                    <div
                      className={`${getColorClass(
                        seriesData.rating
                      )} w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded mr-2`}
                    >
                      {seriesData.rating}
                    </div>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      IMDb Rating
                    </span>
                  </div>
                ) : null}
                {seriesData.plot && seriesData.plot !== "N/A" ? (
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-3 sm:line-clamp-none">
                    {seriesData.plot}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2">
                Episode Ratings
              </h3>

              {/* Display all seasons and episodes */}
              {seriesData.seasons.map((season) => (
                <div key={`season-${season.season}`} className="mb-4 sm:mb-6">
                  <h4 className="text-xs sm:text-sm md:text-md font-medium mb-2 sm:mb-3 border-b border-gray-700 pb-1">
                    Season {season.season}
                  </h4>
                  {season.episodes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
                      {season.episodes.map((episode) => (
                        <div
                          key={`s${season.season}e${episode.episode}`}
                          className="bg-neutral-800 rounded p-1.5 sm:p-2 md:p-3 flex items-center"
                        >
                          <div
                            className={`${getColorClass(
                              episode.rating
                            )} w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 rounded flex items-center justify-center mr-2 sm:mr-3 text-xs`}
                          >
                            {episode.rating !== "N/A" ? episode.rating : "?"}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs text-gray-400 mb-0.5">
                              S{season.season}E{episode.episode}
                            </div>
                            <div className="truncate text-xs sm:text-sm">
                              {episode.title}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">
                      No episode data available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-4 sm:p-8 mb-16">
            <div className="text-red-500 text-base sm:text-xl">
              No data available
            </div>
          </div>
        )}

        {/* Improved back button */}
        {isFromSearchPage && (
          <div className="fixed bottom-0 left-0 right-0 mt-8 bg-neutral-900 py-3 sm:py-4 px-4 border-t border-gray-800 z-10">
            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base font-medium shadow-md cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              BACK TO SEARCH
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesRatingsChart;
