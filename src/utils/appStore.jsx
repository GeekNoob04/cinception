import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";
import WatchlistReducer from "./favoritesSlice";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  gemini: gptReducer,
  config: configReducer,
  Watchlist: WatchlistReducer,
});

const isClient = typeof window !== "undefined";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["gemini"],
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
    devTools: process.env.NODE_ENV !== "production",
  });

  if (isClient) {
    store.__persistor = persistStore(store);
  }

  return store;
};

const appStore = makeStore();
export const persistor = isClient ? appStore.__persistor : null;
export default appStore;
