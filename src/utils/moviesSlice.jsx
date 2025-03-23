import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    trailerVideo: null,
    nowPopularMovies: null,
    nowTopRatedMovies: null,
    nowUpcomingMovies: null,
    nowTopRatedSeries: null,
    movieDetails: null,
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.nowPopularMovies = action.payload;
    },
    addTopRatedMovies: (state, action) => {
      state.nowTopRatedMovies = action.payload;
    },
    addUpcomingMovies: (state, action) => {
      state.nowUpcomingMovies = action.payload;
    },
    addTopRatedSeries: (state, action) => {
      state.nowTopRatedSeries = action.payload;
    },
    addTrailerVideo: (state, action) => {
      state.trailerVideo = action.payload;
    },
    addMovieDetails: (state, action) => {
      state.movieDetails = action.payload;
    },
  },
});

export const {
  addNowPlayingMovies,
  addTrailerVideo,
  addPopularMovies,
  addTopRatedMovies,
  addUpcomingMovies,
  addTopRatedSeries,
  addMovieDetails,
} = moviesSlice.actions;

export default moviesSlice.reducer;
