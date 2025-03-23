import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gemini",
  initialState: {
    showGptSearch: false,
    geminiMovies: null,
    movieResults: null,
    movieNames: null,
    isLoading: false,
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGeminiMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
      state.isLoading = false;
    },
    setGeminiLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleGptSearchView, addGeminiMovieResult, setGeminiLoading } =
  gptSlice.actions;
export default gptSlice.reducer;
