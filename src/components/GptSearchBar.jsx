import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import geminiUtils from "../utils/gemini";
import { addGeminiMovieResult, setGeminiLoading } from "../utils/gptSlice";
import {
  searchMovieWithFallback,
  getMediaDetails,
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
      const mediaRecommendations = processGeminiResponse(contentText);

      const isTvSeriesQuery =
        query.toLowerCase().includes("tv") ||
        query.toLowerCase().includes("series") ||
        query.toLowerCase().includes("show");

      const specificTitleSearch = (() => {
        const quotedMatch = query.match(/["']([^"']+)["']/);
        if (quotedMatch) return quotedMatch[1];

        if (isTvSeriesQuery) {
          const commonTerms = [
            "tv",
            "series",
            "show",
            "shows",
            "television",
            "best",
            "top",
            "like",
            "similar",
          ];
          const words = query.toLowerCase().split(/\s+/);

          const specificTerms = words.filter(
            (word) => !commonTerms.includes(word)
          );
          if (specificTerms.length > 0) {
            const titlePart = query
              .replace(/\b(tv|series|show|shows)\b/gi, "")
              .trim();
            if (titlePart) return titlePart;
          }
        }

        return null;
      })();

      let searchPromises = [];

      if (specificTitleSearch && mediaRecommendations.length > 0) {
        const exactTitle = specificTitleSearch.trim();
        const firstRecommendation = mediaRecommendations[0].trim();

        searchPromises = [
          searchMovieWithFallback(exactTitle),

          ...(firstRecommendation !== exactTitle
            ? [searchMovieWithFallback(firstRecommendation)]
            : []),

          ...mediaRecommendations
            .slice(1)
            .map((title) => searchMovieWithFallback(title)),
        ];
      } else {
        searchPromises = mediaRecommendations.map((title) =>
          searchMovieWithFallback(title)
        );
      }

      const initialResults = await Promise.all(searchPromises);
      const validInitialResults = initialResults.filter(
        (result) => result !== null
      );

      const detailedResultsPromises = validInitialResults.map((media) =>
        getMediaDetails(media.id, media.mediaType)
      );

      const detailedResults = await Promise.all(detailedResultsPromises);

      const finalResults = detailedResults
        .filter((media) => media !== null)
        .map((media, index) => {
          const mediaType = validInitialResults[index]?.mediaType || "movie";
          return {
            ...media,
            title: mediaType === "tv" ? media.name || media.title : media.title,
            mediaType,
          };
        });

      dispatch(
        addGeminiMovieResult({
          movieNames: mediaRecommendations,
          movieResults: finalResults,
        })
      );
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      dispatch(setGeminiLoading(false));
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 pt-20 md:pt-32 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 text-white text-center">
        Discover Your Next Favorite Watch
      </h1>

      <p className="text-gray-300 text-center max-w-2xl mb-6 sm:mb-8 text-xs sm:text-sm md:text-base px-4">
        Get AI-powered recommendations for movies and TV shows based on your
        preferences
      </p>

      <form
        className="w-full md:w-1/2 relative group"
        onSubmit={(e) => {
          e.preventDefault();
          handleGptSearchClick();
        }}
      >
        <div className="backdrop-blur-sm bg-black/30 p-0.5 rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-red-500/20 shadow-red-500/10">
          <div className="flex rounded-xl overflow-hidden">
            <input
              ref={searchText}
              type="text"
              className="p-3 sm:p-4 md:p-5 bg-gray-900 bg-opacity-80 flex-grow text-white placeholder-gray-400 focus:outline-none text-xs sm:text-sm md:text-base"
              placeholder="Search for movies, TV shows or describe what you want to watch..."
              disabled={isLoading}
            />
            <button
              className={`px-4 sm:px-5 md:px-8 transition-all duration-300 flex items-center justify-center ${
                isLoading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              } text-white font-medium`}
              onClick={handleGptSearchClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-xs sm:text-sm">Loading...</span>
                </div>
              ) : (
                <span className="text-xs sm:text-sm">Search</span>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-3 sm:mt-4 text-gray-400 text-xs sm:text-sm text-center max-w-md px-4">
        Try 'sci-fi with plot twists', 'binge-worthy TV series', or a specific
        title
      </div>
    </div>
  );
};

export default GptSearchBar;
