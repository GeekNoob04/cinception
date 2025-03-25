import { createSlice } from "@reduxjs/toolkit";

const Watchlistlice = createSlice({
  name: "Watchlist",
  initialState: {
    Watchlist: [],
  },
  reducers: {
    addFav: (state, action) => {
      state.Watchlist.push(action.payload);
    },
    removeFav: (state, action) => {
      state.Watchlist = state.Watchlist.filter(
        (movie) => movie.id !== action.payload // Removing based on movie ID
      );
    },
  },
});

export const { addFav, removeFav } = Watchlistlice.actions;
export default Watchlistlice.reducer;
