import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: {
    favourites: [],
  },
  reducers: {
    addFav: (state, action) => {
      state.favourites.push(action.payload);
    },
    removeFav: (state, action) => {
      state.favourites = state.favourites.filter(
        (movie) => movie.id !== action.payload // Removing based on movie ID
      );
    },
  },
});

export const { addFav, removeFav } = favouriteSlice.actions;
export default favouriteSlice.reducer;
