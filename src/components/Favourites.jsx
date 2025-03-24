// src/components/Favourites.jsx
import React from "react";
import Header from "./Header";

const Favourites = () => {
  return (
    <div>
      <Header />
      <div className="pt-28 min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Favourites</h1>
          {/* Content will be added later */}
          <p className="text-gray-400">
            Your favourite movies will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Favourites;
