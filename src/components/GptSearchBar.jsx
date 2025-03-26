import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import geminiUtils from "../utils/gemini";
import { addGeminiMovieResult, setGeminiLoading } from "../utils/gptSlice";
import {
  searchMovieWithFallback,
  getMovieDetails,
  generateGeminiPrompt,
  processGeminiResponse,
} from "../utils/movieSearchUtils";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGptSearchClick = async () => {
    const query = searchText.current.value;

    if (!query) return;
    setIsLoading(true);
    dispatch(setGeminiLoading(true));

    try {
      const prompt = generateGeminiPrompt(query);

      const response = await geminiUtils.generateContent(prompt);
      const formattedResponse = [
        {
          message: response.message,
        },
      ];

      const contentText = formattedResponse[0]?.message?.content || "";

      const limitedMovies = processGeminiResponse(contentText);

      const initialResultsPromises = limitedMovies.map((movie) =>
        searchMovieWithFallback(movie)
      );

      const initialResults = await Promise.all(initialResultsPromises);
      const validInitialResults = initialResults.filter(
        (result) => result !== null
      );

      const detailedResultsPromises = validInitialResults.map((movie) =>
        getMovieDetails(movie.id)
      );
      const detailedResults = await Promise.all(detailedResultsPromises);

      const finalTmdbResults = detailedResults.filter(
        (movie) => movie !== null
      );

      dispatch(
        addGeminiMovieResult({
          movieNames: limitedMovies,
          movieResults: finalTmdbResults,
        })
      );

      dispatch(setGeminiLoading(false));
    } catch (error) {
      console.error("Error generating movie recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 md:pt-32 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white text-center">
        Discover Your Next Favorite Movie
      </h1>

      <p className="text-gray-300 text-center max-w-2xl mb-8 text-sm md:text-base">
        Get AI-powered recommendations based on your movie preferences
      </p>

      <form
        className="w-full md:w-1/2 relative group"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="backdrop-blur-sm bg-black/30 p-0.5 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-red-500/20 shadow-red-500/10">
          <div className="flex rounded-xl overflow-hidden">
            <input
              ref={searchText}
              type="text"
              className="p-4 md:p-5 bg-gray-900 bg-opacity-80 flex-grow text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
              placeholder="Search for movies or describe what you want to watch..."
              disabled={isLoading}
            />
            <button
              className={`px-5 md:px-8 transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              } text-white font-medium`}
              onClick={handleGptSearchClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 text-gray-400 text-xs md:text-sm text-center max-w-md">
        Try 'sci-fi with plot twists', 'heartwarming family films', or a
        specific movie title
      </div>
    </div>
  );
};

export default GptSearchBar;
