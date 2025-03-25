import React from "react";
import { useSelector } from "react-redux";

const VideoTitle = ({ title, overview }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);

  return (
    <div className="w-screen aspect-video pt-[16%] px-6 md:px-8 absolute text-white bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide">
        {title}
      </h1>
      <p className="mt-6 py-4 text-base md:text-lg w-full md:w-1/2 lg:w-2/5 leading-relaxed">
        {overview}
      </p>
      <div className="flex flex-wrap mt-6">
        {trailerVideo?.key ? (
          <a
            href={`https://www.youtube.com/watch?v=${trailerVideo.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black py-2 px-8 text-lg font-medium rounded-3xl flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6 mr-1"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
            <span>Play</span>
          </a>
        ) : (
          <button
            className="bg-gray-500 text-white py-2 px-8 text-lg font-medium rounded-3xl flex items-center justify-center cursor-not-allowed"
            disabled
          >
            No Trailer Available
          </button>
        )}

        <button className="bg-gray-600/80 text-white py-2 px-8 text-lg font-medium rounded-3xl ml-4 flex items-center cursor-pointer hover:bg-gray-500 transition-colors">
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
