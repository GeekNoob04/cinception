import { API_OPTIONS } from "./constant";

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

      // Exact match gets highest score
      if (movieTitle === searchTitle) {
        score += 150; // Increased to prioritize exact matches
      } else if (movieTitle.startsWith(searchTitle)) {
        score += 80;
      } else if (
        movieTitle.includes(` ${searchTitle} `) ||
        movieTitle.includes(`${searchTitle} `) ||
        movieTitle.includes(` ${searchTitle}`)
      ) {
        score += 50;
      } else if (movieTitle.includes(searchTitle)) {
        score += 30;
      }

      score += (movie.vote_average || 0) * 2;
      score += Math.min((movie.vote_count || 0) / 1000, 10);

      // Boost popular movies even more
      if (movie.popularity > 50) score += 25;
      if (movie.popularity > 100) score += 25;

      return { ...movie, matchScore: score };
    });

    scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    return scoredResults[0];
  } catch (error) {
    console.error(`Error searching for movie "${movieName}":`, error);
    return null;
  }
};

const searchSeriesTMDB = async (seriesName) => {
  try {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/tv?query=" +
        encodeURIComponent(seriesName.trim()) +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );

    const json = await data.json();

    if (!json.results || json.results.length === 0) {
      return null;
    }

    const scoredResults = json.results.map((series) => {
      let score = 0;
      const seriesTitle = series.name.toLowerCase();
      const searchTitle = seriesName.trim().toLowerCase();

      if (seriesTitle === searchTitle) {
        score += 300;
      } else if (seriesTitle.startsWith(searchTitle)) {
        score += 150;
      } else if (
        seriesTitle.includes(` ${searchTitle} `) ||
        seriesTitle.includes(`${searchTitle} `) ||
        seriesTitle.includes(` ${searchTitle}`)
      ) {
        score += 80;
      } else if (seriesTitle.includes(searchTitle)) {
        score += 50;
      }

      score += (series.vote_average || 0) * 2;
      score += Math.min((series.vote_count || 0) / 500, 20);

      if (series.first_air_date) {
        const year = parseInt(series.first_air_date.split("-")[0], 10);
        if (year >= 2020) score += 5;
        else if (year >= 2015) score += 3;
      }

      return { ...series, matchScore: score };
    });

    scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    return scoredResults[0];
  } catch (error) {
    console.error(`Error searching for series "${seriesName}":`, error);
    return null;
  }
};

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

const getSeriesDetails = async (seriesId) => {
  try {
    // Get basic series details
    const detailsResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`,
      API_OPTIONS
    );

    const seriesDetails = await detailsResponse.json();

    return seriesDetails;
  } catch (error) {
    console.error(`Error getting details for series ${seriesId}:`, error);
    return null;
  }
};

const getRelatedSeries = async (seriesId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${seriesId}/recommendations?language=en-US&page=1`,
      API_OPTIONS
    );

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error getting related series for ${seriesId}:`, error);
    return [];
  }
};

const getRelatedMovies = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`,
      API_OPTIONS
    );

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error getting related movies for ${movieId}:`, error);
    return [];
  }
};

const generateGeminiPrompt = (query) => {
  const isTvSeriesQuery =
    query.toLowerCase().includes("tv") ||
    query.toLowerCase().includes("series") ||
    query.toLowerCase().includes("show");

  const isMovieQuery =
    query.toLowerCase().includes("movie") ||
    query.toLowerCase().includes("film");

  const quotedTitleMatch = query.match(/["']([^"']+)["']/);
  const specificTitle = quotedTitleMatch ? quotedTitleMatch[1] : null;

  const extractPotentialTitle = () => {
    if (specificTitle) return specificTitle;

    if (isTvSeriesQuery || isMovieQuery) {
      let cleanedQuery = query
        .replace(
          /\b(tv|television|series|show|shows|movie|movies|film|films)\b/gi,
          ""
        )
        .replace(/\b(best|top|like|similar|recommend|popular)\b/gi, "")
        .trim();

      if (cleanedQuery.length > 2) return cleanedQuery;
    }

    const isLikelyMediaTitle =
      query.length > 3 &&
      ![
        "movie",
        "movies",
        "film",
        "films",
        "series",
        "tv",
        "show",
        "shows",
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
        "like",
        "similar",
        "recommend",
      ].some((term) => new RegExp(`\\b${term}\\b`, "i").test(query));

    return isLikelyMediaTitle ? query : null;
  };

  const potentialTitle = extractPotentialTitle();

  if (potentialTitle && isTvSeriesQuery) {
    return `Act as a TV series recommendation system. The user is searching specifically for the TV series "${potentialTitle}".
      First, provide "${potentialTitle}" as the FIRST item in your list, followed by a comma.
      Then, suggest exactly 29 TV shows that are closely related to "${potentialTitle}" in terms of:
      - Similar themes, tone, and storytelling style
      - Same creator/showrunner if applicable
      - Shows from the same franchise or universe
      - Shows with similar critical reception
      Return ONLY a comma-separated list of TV series titles STARTING WITH "${potentialTitle}". Do not add any additional text.`;
  } else if (potentialTitle && isMovieQuery) {
    return `Act as a movie recommendation system. The user is searching specifically for the movie "${potentialTitle}".
      First, provide "${potentialTitle}" as the FIRST item in your list, followed by a comma.
      Then, suggest exactly 29 movies that are closely related to "${potentialTitle}" in terms of:
      - Similar themes, tone, and storytelling style
      - Same director or production team if applicable
      - Movies from the same franchise or universe
      - Movies with similar critical reception
      Return ONLY a comma-separated list of movie titles STARTING WITH "${potentialTitle}". Do not add any additional text.`;
  } else if (isTvSeriesQuery) {
    return `Act as a TV series recommendation system and suggest exactly 30 TV shows that are genuinely ${query}. 
      Consider the thematic elements, tone, and genre.
      Include a diverse mix of both newer and classic series.
      Only return a comma-separated list of TV series titles with no additional text.
      DO NOT include any movies in your list, only TV series.`;
  } else if (isMovieQuery) {
    return `Act as a movie recommendation system and suggest exactly 30 movies that are genuinely ${query}. 
      Consider the thematic elements, tone, and genre.
      Include a diverse mix of both newer and classic films.
      Only return a comma-separated list of movie titles with no additional text.
      DO NOT include any TV series in your list, only movies.`;
  } else if (potentialTitle) {
    return `Act as a movie and TV series recommendation system. The user is looking for content similar to "${potentialTitle}".
      Suggest exactly 30 movies or TV shows that are similar in theme, style, plot, or director to "${potentialTitle}".
      Include "${potentialTitle}" as the first item in your list if it's a valid movie or TV show title.
      Only return a comma-separated list of titles with no additional text.`;
  } else {
    return `Act as a movie and TV series recommendation system and suggest exactly 30 titles that are genuinely ${query}. 
      Consider the thematic elements, tone, and genre.
      Include a mix of both movies and TV series in your recommendations.
      Only return a comma-separated list of titles with no additional text.`;
  }
};

const processGeminiResponse = (contentText) => {
  if (!contentText) return [];

  let geminiMedia = contentText
    .split(/,(?!\s*\d{4})/)
    .map((media) => media.trim())
    .filter((media) => media.length > 0);

  if (
    geminiMedia.length === 0 ||
    (geminiMedia.length === 1 && geminiMedia[0].length > 100)
  ) {
    const numberedRegex = /\d+\.\s*([^\n]+)/g;
    const matches = [...contentText.matchAll(numberedRegex)];

    if (matches.length > 0) {
      geminiMedia = matches.map((match) => match[1].trim());
    }
  }

  if (
    geminiMedia.length === 0 ||
    (geminiMedia.length === 1 && geminiMedia[0].length > 100)
  ) {
    geminiMedia = contentText
      .split("\n")
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.startsWith("Here") &&
          !line.startsWith("These") &&
          !line.includes("recommendations")
      );
  }

  geminiMedia = geminiMedia.map((title) => {
    return title
      .replace(/^["']|["']$/g, "")
      .replace(/^\d+\.\s*/, "")
      .replace(/\(\d{4}\)$/, "")
      .trim();
  });

  return geminiMedia.slice(0, 30);
};

const searchBothMediaTypes = async (query) => {
  const cleanQuery = query.trim();

  const [movieResult, seriesResult] = await Promise.all([
    searchMovieTMDB(cleanQuery),
    searchSeriesTMDB(cleanQuery),
  ]);

  return {
    movie: movieResult ? { ...movieResult, mediaType: "movie" } : null,
    series: seriesResult ? { ...seriesResult, mediaType: "tv" } : null,
  };
};

const searchMovieWithFallback = async (mediaName, mediaTypeFilter = null) => {
  const isTvSeriesHint =
    mediaName.toLowerCase().includes("tv series") ||
    mediaName.toLowerCase().includes("tv show") ||
    mediaName.toLowerCase().match(/\b(show|series|season|episode|tv)\b/i) ||
    mediaName.toLowerCase().endsWith(" tv") ||
    mediaName.toLowerCase().endsWith(" series") ||
    mediaName.toLowerCase().endsWith(" show");

  const isMovieHint =
    mediaName.toLowerCase().includes("movie") ||
    mediaName.toLowerCase().includes("film") ||
    mediaName.toLowerCase().endsWith(" movie") ||
    mediaName.toLowerCase().endsWith(" film");

  const forceMovieOnly = mediaTypeFilter === "movie";
  const forceSeriesOnly = mediaTypeFilter === "tv";

  let cleanMediaName = mediaName;

  if (isTvSeriesHint) {
    cleanMediaName = mediaName
      .replace(/\b(tv series|tv show|series|show|tv)\b/gi, "")
      .trim();
  } else if (isMovieHint) {
    cleanMediaName = mediaName.replace(/\b(movie|film)\b/gi, "").trim();
  }

  const quotedMatch = mediaName.match(/["']([^"']+)["']/);
  if (quotedMatch) {
    cleanMediaName = quotedMatch[1].trim();
  }

  if (forceSeriesOnly || isTvSeriesHint) {
    const seriesResult = await searchSeriesTMDB(cleanMediaName);
    if (seriesResult) return { ...seriesResult, mediaType: "tv" };

    if (!forceSeriesOnly) {
      const movieResult = await searchMovieTMDB(cleanMediaName);
      if (movieResult) return { ...movieResult, mediaType: "movie" };
    }
  } else if (forceMovieOnly || isMovieHint) {
    const movieResult = await searchMovieTMDB(cleanMediaName);
    if (movieResult) return { ...movieResult, mediaType: "movie" };

    if (!forceMovieOnly) {
      const seriesResult = await searchSeriesTMDB(cleanMediaName);
      if (seriesResult) return { ...seriesResult, mediaType: "tv" };
    }
  } else {
    const results = await searchBothMediaTypes(cleanMediaName);

    if (results.movie && results.series) {
      const isExactMovieMatch =
        results.movie.title.toLowerCase() === cleanMediaName.toLowerCase();
      const isExactSeriesMatch =
        results.series.name.toLowerCase() === cleanMediaName.toLowerCase();

      if (isExactMovieMatch && !isExactSeriesMatch) {
        return results.movie;
      } else if (!isExactMovieMatch && isExactSeriesMatch) {
        return results.series;
      }

      const moviePopularity = results.movie.popularity || 0;
      const seriesPopularity = results.series.popularity || 0;

      const movieVotes = results.movie.vote_count || 0;
      const seriesVotes = results.series.vote_count || 0;

      const movieScore = moviePopularity * 0.7 + (movieVotes / 1000) * 0.3;
      const seriesScore = seriesPopularity * 0.7 + (seriesVotes / 1000) * 0.3;

      return movieScore > seriesScore ? results.movie : results.series;
    }

    return results.movie || results.series;
  }

  const simplifiedName = cleanMediaName.split(":")[0].split("(")[0].trim();
  if (simplifiedName.length > 3 && simplifiedName !== cleanMediaName) {
    if (forceSeriesOnly || isTvSeriesHint) {
      const seriesResult = await searchSeriesTMDB(simplifiedName);
      if (seriesResult) return { ...seriesResult, mediaType: "tv" };

      if (!forceSeriesOnly) {
        const movieResult = await searchMovieTMDB(simplifiedName);
        if (movieResult) return { ...movieResult, mediaType: "movie" };
      }
    } else if (forceMovieOnly || isMovieHint) {
      const movieResult = await searchMovieTMDB(simplifiedName);
      if (movieResult) return { ...movieResult, mediaType: "movie" };

      if (!forceMovieOnly) {
        const seriesResult = await searchSeriesTMDB(simplifiedName);
        if (seriesResult) return { ...seriesResult, mediaType: "tv" };
      }
    } else {
      const results = await searchBothMediaTypes(simplifiedName);

      if (results.movie && results.series) {
        const moviePopularity = results.movie.popularity || 0;
        const seriesPopularity = results.series.popularity || 0;
        const movieVotes = results.movie.vote_count || 0;
        const seriesVotes = results.series.vote_count || 0;

        const movieScore = moviePopularity * 0.7 + (movieVotes / 1000) * 0.3;
        const seriesScore = seriesPopularity * 0.7 + (seriesVotes / 1000) * 0.3;

        return movieScore > seriesScore ? results.movie : results.series;
      }

      return results.movie || results.series;
    }
  }

  return null;
};
const getMediaDetails = async (id, mediaType) => {
  if (mediaType === "movie") {
    return await getMovieDetails(id);
  } else if (mediaType === "tv") {
    const details = await getSeriesDetails(id);

    return details;
  }
  return null;
};

export {
  searchMovieTMDB,
  searchSeriesTMDB,
  getMovieDetails,
  getSeriesDetails,
  searchMovieWithFallback,
  getMediaDetails,
  generateGeminiPrompt,
  processGeminiResponse,
  getRelatedSeries,
  getRelatedMovies,
  searchBothMediaTypes,
};
