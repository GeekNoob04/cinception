import React, { useState } from "react";
import GeminiMovieCard from "./GeminiMovieCard";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await fetchMovieData(query);
      setSearchResults(response.results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(e.target.searchQuery.value);
        }}
      >
        <input
          name="searchQuery"
          type="text"
          placeholder="Search movies..."
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded ml-2"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap justify-center mt-4">
        {isSearching
          ? Array(8)
              .fill()
              .map((_, index) => (
                <GeminiMovieCard
                  key={`shimmer-${index}`}
                  isSearchLoading={true}
                />
              ))
          : searchResults.map((movie) => (
              <GeminiMovieCard
                key={movie.id}
                movie={movie}
                isSearchLoading={false}
              />
            ))}
      </div>
    </div>
  );
};

export default SearchResults;
