import React from "react";
import { IMG_CDN_URL } from "../utils/constant";

const GeminiMovieCard = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="w-36 sm:w-40 md:w-48 lg:w-56 m-2 relative transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
      <img
        alt={movie.title}
        src={
          movie.poster_path ? IMG_CDN_URL + movie.poster_path : "/no-poster.png"
        }
        className="w-full h-auto rounded-lg shadow-md"
        loading="lazy"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg transition-opacity duration-300 opacity-100 group-hover:opacity-100">
        <h3 className="text-sm font-medium truncate">{movie.title}</h3>
        <p className="text-xs opacity-75 truncate">
          {movie.release_date?.split("-")[0]}
        </p>
      </div>
    </div>
  );
};

export default GeminiMovieCard;
