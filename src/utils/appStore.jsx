import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";
import favouritesReducer from "./favoritesSlice"; // Ensure the correct file name is used

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  gemini: gptReducer,
  config: configReducer,
  favourites: favouritesReducer, // Use correct reducer key
});

const isClient = typeof window !== "undefined";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["gemini"], // Exclude unnecessary persistence
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = configureStore({
    reducer: isClient ? persistedReducer : rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
    devTools: process.env.NODE_ENV !== "production", // Ensure Redux DevTools work
  });

  if (isClient) {
    store.__persistor = persistStore(store);
  }

  return store;
};

const appStore = makeStore();
export const persistor = isClient ? appStore.__persistor : null;
export default appStore;
