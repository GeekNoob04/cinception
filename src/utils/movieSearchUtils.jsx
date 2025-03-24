// src/utils/movieSearchUtils.js

import { API_OPTIONS } from "./constant";

/**
 * Searches for a movie in TMDB database and returns the best match
 * @param {string} movieName - The name of the movie to search for
 * @returns {Object|null} - The best matching movie object or null if not found
 */
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

/**
 * Gets detailed information about a movie by ID
 * @param {number} movieId - The TMDB ID of the movie
 * @returns {Object|null} - Detailed movie information or null if not found
 */
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

/**
 * Searches for a movie with a fallback to a simplified name if the initial search fails
 * @param {string} movieName - The name of the movie to search for
 * @returns {Object|null} - The movie object or null if not found
 */
const searchMovieWithFallback = async (movieName) => {
  const result = await searchMovieTMDB(movieName);
  if (result) return result;
  const simplifiedName = movieName.split(":")[0].split("(")[0].trim();
  if (simplifiedName.length > 3 && simplifiedName !== movieName) {
    return await searchMovieTMDB(simplifiedName);
  }
  return null;
};

/**
 * Generates the appropriate prompt for Gemini based on the query type
 * @param {string} query - The user's search query
 * @returns {string} - The formatted prompt for Gemini
 */
const generateGeminiPrompt = (query) => {
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

  if (isLikelyMovieTitle) {
    return `Act as a movie recommendation system. The user is looking for movies similar to "${query}".
      Suggest exactly 10 movies that are similar in theme, style, plot, or director to "${query}".
      Include "${query}" as the first movie in your list if it's a valid movie title.
      Only return a comma-separated list of movie titles with no additional text or explanation.`;
  } else {
    return `Act as a movie recommendation system and suggest exactly 10 movies that are genuinely ${query}. 
      Consider the thematic elements, tone, and genre. For example, if someone asks for "dark movies", 
      recommend movies that are actually dark in theme or tone (like "Taxi Driver", "Se7en", "Requiem for a Dream"), 
      not just movies with "dark" in the title. 
      Only return a comma-separated list of movie titles with no additional text or explanation.`;
  }
};

/**
 * Processes raw movie recommendations from Gemini
 * @param {string} contentText - Raw text from Gemini AI
 * @returns {string[]} - Array of movie titles limited to 10
 */
const processGeminiResponse = (contentText) => {
  const geminiMovies = contentText
    .split(/,(?!\s*\d{4})/)
    .map((movie) => movie.trim())
    .filter((movie) => movie.length > 0);

  return geminiMovies.slice(0, 10);
};

export {
  searchMovieTMDB,
  getMovieDetails,
  searchMovieWithFallback,
  generateGeminiPrompt,
  processGeminiResponse,
};
