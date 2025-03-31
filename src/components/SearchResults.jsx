import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IMG_CDN } from "../utils/constant";
import placeholderPoster from "../assets/poster-placeholder.png";
import { AppContext } from "../App";

const SearchResults = ({ results }) => {
  const { openSeriesRatings } = useContext(AppContext);

  if (!results || results.length === 0) {
    return null;
  }

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return placeholderPoster;
    return `${IMG_CDN}${posterPath}`;
  };

  const formatYear = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  const handleSeriesClick = (event, item) => {
    if (item.type === "tv" || item.mediaType === "tv") {
      event.preventDefault();
      openSeriesRatings(item.title);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aIsTV = a.type === "tv" || a.mediaType === "tv";
    const bIsTV = b.type === "tv" || b.mediaType === "tv";
    return bIsTV - aIsTV; // TV series will come first
  });

  return (
    <div className="mt-8 pb-8">
      <h2 className="text-xl font-bold text-white mb-4 px-4">Search Results</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4">
        {sortedResults.map((item) => (
          <div
            key={`${item.id}-${item.type || item.mediaType}`}
            className="bg-neutral-800 rounded-lg overflow-hidden transition-transform hover:scale-105"
          >
            <Link
              to={
                item.type === "tv" || item.mediaType === "tv"
                  ? "#"
                  : `/title/${item.id}?mediaType=${item.type || item.mediaType}`
              }
              onClick={(e) => handleSeriesClick(e, item)}
              className="block"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={getPosterUrl(item.poster_path)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold px-2 py-1 rounded">
                    ★ {item.vote_average.toFixed(1)}
                  </div>
                )}
                {/* TV Series Badge */}
                {(item.type === "tv" || item.mediaType === "tv") && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    TV SERIES
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <h3 className="text-white font-semibold truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-300">
                    <span>
                      {formatYear(item.release_date || item.first_air_date)}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="capitalize">
                      {item.type === "tv" || item.mediaType === "tv"
                        ? "TV Series"
                        : "Movie"}
                    </span>
                  </div>
                </div>
              </div>
              {item.type === "tv" || item.mediaType === "tv" ? (
                <div className="p-2 text-center text-xs text-red-400 font-medium">
                  Click to view episode ratings
                </div>
              ) : null}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
