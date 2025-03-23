import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMovieSuggestions from "./GptMovieSuggestions";
// import { BG_URL } from "../utils/constant";
const GptSearch = () => {
  return (
    <div className="bg-black">
      {/* <div className="absolute -z-10">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img src={BG_URL} alt="background image" />
      </div> */}
      <GptSearchBar />
      <GptMovieSuggestions />
    </div>
  );
};

export default GptSearch;
