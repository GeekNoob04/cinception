import React, { useRef, useState } from "react";
import LangConstants from "../utils/LangConstants";
import { useDispatch, useSelector } from "react-redux";
import geminiUtils from "../utils/gemini";
import { API_OPTIONS } from "../utils/constant";
import { addGeminiMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced search for each movie with better matching
  const searchMovieTMDB = async (movieName) => {
    try {
      const data = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" +
          encodeURIComponent(movieName.trim()) +
          "&include_adult=false&language=en-US&page=1",
        API_OPTIONS
      );

      const json = await data.json();

      if (!json.results || json.results.length === 0) {
        return null;
      }

      // Use a scoring system to find the best match
      const scoredResults = json.results.map((movie) => {
        let score = 0;
        const movieTitle = movie.title.toLowerCase();
        const searchTitle = movieName.trim().toLowerCase();

        // Exact match gets highest score
        if (movieTitle === searchTitle) {
          score += 100;
        }
        // Title starts with search term
        else if (movieTitle.startsWith(searchTitle)) {
          score += 50;
        }
        // Title contains search term as a word
        else if (
          movieTitle.includes(` ${searchTitle} `) ||
          movieTitle.includes(`${searchTitle} `) ||
          movieTitle.includes(` ${searchTitle}`)
        ) {
          score += 30;
        }
        // Title contains search term
        else if (movieTitle.includes(searchTitle)) {
          score += 20;
        }

        // Boost score for popular and well-rated movies
        score += (movie.vote_average || 0) * 2;
        score += Math.min((movie.vote_count || 0) / 1000, 10);

        return { ...movie, matchScore: score };
      });

      // Sort by score and return the best match
      scoredResults.sort((a, b) => b.matchScore - a.matchScore);
      return scoredResults[0];
    } catch (error) {
      console.error(`Error searching for movie "${movieName}":`, error);
      return null;
    }
  };

  // Get movie details including genres to verify it matches the query type
  const getMovieDetails = async (movieId) => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        API_OPTIONS
      );
      return await data.json();
    } catch (error) {
      console.error(`Error getting details for movie ${movieId}:`, error);
      return null;
    }
  };

  const handleGptSearchClick = async () => {
    const query = searchText.current.value;

    if (!query) return;
    setIsLoading(true);

    try {
      // Use a more specific prompt to get better recommendations
      const prompt = `Act as a movie recommendation system and suggest exactly 10 movies that are genuinely ${query}. 
      Consider the thematic elements, tone, and genre. For example, if someone asks for "dark movies", 
      recommend movies that are actually dark in theme or tone (like "Taxi Driver", "Se7en", "Requiem for a Dream"), 
      not just movies with "dark" in the title. 
      Only return a comma-separated list of movie titles with no additional text or explanation.`;

      const response = await geminiUtils.generateContent(prompt);
      const formattedResponse = [
        {
          message: response.message,
        },
      ];

      const contentText = formattedResponse[0]?.message?.content || "";
      console.log("AI Recommendations:", contentText);

      const geminiMovies = contentText
        .split(/,(?!\s*\d{4})/)
        .map((movie) => movie.trim())
        .filter((movie) => movie.length > 0);

      const limitedMovies = geminiMovies.slice(0, 10);

      const initialResultsPromises = limitedMovies.map((movie) =>
        searchMovieTMDB(movie)
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

      console.log("Final Movie Results:", finalTmdbResults);
      // Store these results in your state or Redux store
      dispatch(
        addGeminiMovieResult({
          movieNames: limitedMovies,
          movieResults: finalTmdbResults,
        })
      );
    } catch (error) {
      console.error("Error generating movie recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[10%] flex justify-center">
      <form
        className="bg-black w-1/2 grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 bg-white col-span-9"
          placeholder={LangConstants[langKey].GptSearchPlaceHolder}
          disabled={isLoading}
        />
        <button
          className={`col-span-3 m-4 py-2 px-4 ${
            isLoading ? "bg-gray-600" : "bg-red-600"
          } text-white rounded-lg`}
          onClick={handleGptSearchClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : LangConstants[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
