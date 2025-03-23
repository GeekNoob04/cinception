import React from "react";
import { IMG_CDN_URL } from "../utils/constant";
const MovieCard = ({ posterPath }) => {
  if (!posterPath) return null; // TODO: when posterPath is not present
  return (
    <div className="w-48 pr-4">
      <img src={IMG_CDN_URL + posterPath} alt="Movie Card" />
    </div>
  );
};

export default MovieCard;
