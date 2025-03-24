// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";
// import moviesReducer from "./moviesSlice";
// import gptReducer from "./gptSlice";
// import configReducer from "./configSlice";
// const appStore = configureStore({
//   reducer: {
//     user: userReducer,
//     movies: moviesReducer,
//     gemini: gptReducer,
//     config: configReducer,
//   },
// });
// export default appStore;
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";

// Configure persist options
const persistConfig = {
  key: "root",
  storage,
  // Optionally blacklist slices you don't want to persist
  // blacklist: ["gemini"], // Example: don't persist gemini state
  // Or whitelist only specific slices
  // whitelist: ["user", "config"], // Example: only persist these slices
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  gemini: gptReducer,
  config: configReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create persistor
export const persistor = persistStore(appStore);

export default appStore;
