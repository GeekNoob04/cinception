import React from "react";
import { IMG_CDN_URL } from "../utils/constant";

const GeminMovieCard = ({ movie }) => {
  if (!movie) return null;

  return (
    <div className="w-48 md:w-56 m-2 relative transition-transform duration-300 hover:scale-105">
      <img
        alt={movie.title}
        src={
          movie.poster_path ? IMG_CDN_URL + movie.poster_path : "/no-poster.png"
        }
        className="w-full rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
        <h3 className="text-sm font-medium truncate">{movie.title}</h3>
      </div>
    </div>
  );
};

export default GeminMovieCard;
