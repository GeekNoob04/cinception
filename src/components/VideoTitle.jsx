import React from "react";

const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-screen aspect-video pt-[10%] md:pt-[20%] px-6 md:px-24 absolute text-white bg-gradient-to-r from-black z-10">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">{title}</h1>
      <p className="hidden md:block py-4 md:py-6 text-sm md:text-lg w-full md:w-1/2 lg:w-1/3 line-clamp-3 md:line-clamp-none">
        {overview}
      </p>
      <div className="flex flex-wrap mt-2 md:mt-0">
        <button className="bg-white text-black p-2 md:p-4 px-4 md:px-12 text-sm md:text-xl rounded-lg hover:bg-white/80 transition-colors duration-300 flex items-center">
          <span className="mr-1">▶</span> Play
        </button>
        <button className="bg-gray-500 text-white p-2 md:p-4 px-4 md:px-12 text-sm md:text-xl rounded-lg ml-2 md:mx-2 hover:bg-gray-500/80 transition-colors duration-300 flex items-center">
          <span className="mr-1">ⓘ</span> More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
