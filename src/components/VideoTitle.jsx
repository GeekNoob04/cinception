import React from "react";
import "./VideoTitle.css"; // Import the CSS file we'll create

const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-screen aspect-video pt-[16%] px-6 md:px-8 absolute text-white bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide custom-title-font">
        {title}
      </h1>
      <p className="mt-6 py-4 text-base md:text-lg w-full md:w-1/2 lg:w-2/5 leading-relaxed">
        {overview}
      </p>
      <div className="flex flex-wrap mt-6">
        <button className="bg-white text-black py-2 px-10 text-lg font-medium rounded-none flex items-center">
          <span className="mr-2">▶</span> Play
        </button>
        <button className="bg-gray-600/80 text-white py-2 px-8 text-lg font-medium rounded-none ml-4 flex items-center">
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
