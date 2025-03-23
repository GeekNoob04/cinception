// import { useDispatch } from "react-redux";
// import { API_OPTIONS } from "../utils/constant";
// import { addTrailerVideo } from "../utils/moviesSlice";
// import { useEffect } from "react";

// const useMovieTrailer = (movieId) => {
//   const dispatch = useDispatch();
//   // fetch trailer video and updating the store with trailer video data
//   const getMovieVideo = async () => {
//     const data = await fetch(
//       "https://api.themoviedb.org/3/movie/" +
//         movieId +
//         "/videos?language=en-US",
//       API_OPTIONS
//     );
//     const json = await data.json();
//     // console.log(json);
//     const filterData = json.results.filter((video) => video.type === "Trailer");
//     const trailer = filterData.length ? filterData[0] : json.results[0];
//     // console.log(trailer);
//     dispatch(addTrailerVideo(trailer));
//   };
//   useEffect(() => {
//     getMovieVideo();
//   }, []);
// };

// export default useMovieTrailer;
// import { useDispatch } from "react-redux";
// import { API_OPTIONS } from "../utils/constant";
// import { addTrailerVideo, addMovieDetails } from "../utils/moviesSlice";
// import { useEffect } from "react";

// const useMovieTrailer = (movieId) => {
//   const dispatch = useDispatch();

//   // Fetch trailer video
//   const getMovieVideo = async () => {
//     try {
//       const data = await fetch(
//         "https://api.themoviedb.org/3/movie/" +
//           movieId +
//           "/videos?language=en-US",
//         API_OPTIONS
//       );
//       const json = await data.json();
//       const filterData = json.results.filter(
//         (video) => video.type === "Trailer"
//       );
//       const trailer = filterData.length ? filterData[0] : json.results[0];
//       dispatch(addTrailerVideo(trailer));
//     } catch (error) {
//       console.error("Error fetching movie trailer:", error);
//     }
//   };

//   // Fetch complete movie details
//   const getMovieDetails = async () => {
//     try {
//       const data = await fetch(
//         "https://api.themoviedb.org/3/movie/" + movieId + "?language=en-US",
//         API_OPTIONS
//       );
//       const movieDetails = await data.json();
//       dispatch(addMovieDetails(movieDetails));
//     } catch (error) {
//       console.error("Error fetching movie details:", error);
//     }
//   };

//   useEffect(() => {
//     getMovieVideo();
//     getMovieDetails(); // Also fetch the complete movie details
//   }, [movieId]); // Add movieId as a dependency to avoid stale data
// };

// export default useMovieTrailer;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTrailerVideo, addMovieDetails } from "../utils/moviesSlice";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();

  const getMovieVideos = async (id) => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        API_OPTIONS
      );
      const json = await data.json();

      const filterData = json.results.filter(
        (video) => video.type === "Trailer"
      );
      const trailer = filterData.length ? filterData[0] : json.results[0];
      dispatch(addTrailerVideo(trailer));
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        API_OPTIONS
      );
      const movieDetails = await data.json();
      dispatch(addMovieDetails(movieDetails));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  useEffect(() => {
    // Only fetch if movieId is provided
    if (movieId) {
      getMovieVideos(movieId);
      getMovieDetails(movieId);
    }
  }, [movieId]);
};

export default useMovieTrailer;
