import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import geminiUtils from "../utils/gemini";
import { API_OPTIONS } from "../utils/constant";
import { addGeminiMovieResult, setGeminiLoading } from "../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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

      const scoredResults = json.results.map((movie) => {
        let score = 0;
        const movieTitle = movie.title.toLowerCase();
        const searchTitle = movieName.trim().toLowerCase();

        if (movieTitle === searchTitle) {
          score += 100;
        } else if (movieTitle.startsWith(searchTitle)) {
          score += 50;
        } else if (
          movieTitle.includes(` ${searchTitle} `) ||
          movieTitle.includes(`${searchTitle} `) ||
          movieTitle.includes(` ${searchTitle}`)
        ) {
          score += 30;
        } else if (movieTitle.includes(searchTitle)) {
          score += 20;
        }

        score += (movie.vote_average || 0) * 2;
        score += Math.min((movie.vote_count || 0) / 1000, 10);

        return { ...movie, matchScore: score };
      });

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
    dispatch(setGeminiLoading(true));

    try {
      // Adapt the prompt based on whether it looks like a movie title or genre/category
      const isLikelyMovieTitle =
        query.length > 3 &&
        ![
          "movie",
          "movies",
          "film",
          "films",
          "comedy",
          "action",
          "drama",
          "horror",
          "thriller",
          "funny",
          "scary",
          "sad",
          "happy",
          "dark",
          "light",
          "best",
          "top",
        ].some((term) => query.toLowerCase().includes(term));

      let prompt;

      if (isLikelyMovieTitle) {
        prompt = `Act as a movie recommendation system. The user is looking for movies similar to "${query}".
        Suggest exactly 10 movies that are similar in theme, style, plot, or director to "${query}".
        Include "${query}" as the first movie in your list if it's a valid movie title.
        Only return a comma-separated list of movie titles with no additional text or explanation.`;
      } else {
        prompt = `Act as a movie recommendation system and suggest exactly 10 movies that are genuinely ${query}. 
        Consider the thematic elements, tone, and genre. For example, if someone asks for "dark movies", 
        recommend movies that are actually dark in theme or tone (like "Taxi Driver", "Se7en", "Requiem for a Dream"), 
        not just movies with "dark" in the title. 
        Only return a comma-separated list of movie titles with no additional text or explanation.`;
      }

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

      const searchMovieWithFallback = async (movieName) => {
        const result = await searchMovieTMDB(movieName);
        if (result) return result;
        const simplifiedName = movieName.split(":")[0].split("(")[0].trim();
        if (simplifiedName.length > 3 && simplifiedName !== movieName) {
          return await searchMovieTMDB(simplifiedName);
        }
        return null;
      };

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

      console.log("Final Movie Results:", finalTmdbResults);

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
