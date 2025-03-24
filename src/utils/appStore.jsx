// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import { combineReducers } from "redux";
// import userReducer from "./userSlice";
// import moviesReducer from "./moviesSlice";
// import gptReducer from "./gptSlice";
// import configReducer from "./configSlice";

// const rootReducer = combineReducers({
//   user: userReducer,
//   movies: moviesReducer,
//   gemini: gptReducer,
//   config: configReducer,
// });

// // Only apply Redux Persist in a browser environment
// const isClient = typeof window !== "undefined";

// const makeStore = () => {
//   if (isClient) {
//     const persistConfig = {
//       key: "root",
//       storage,
//       // You might want to blacklist certain reducers
//       blacklist: ["gemini"], // Don't persist Gemini search results
//     };

//     const persistedReducer = persistReducer(persistConfig, rootReducer);

//     const store = configureStore({
//       reducer: persistedReducer,
//       middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//           serializableCheck: {
//             ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//           },
//         }),
//     });

//     store.__persistor = persistStore(store);
//     return store;
//   } else {
//     // Return a regular store for SSR
//     return configureStore({
//       reducer: rootReducer,
//     });
//   }
// };

// const appStore = makeStore();
// export const persistor = appStore.__persistor;
// export default appStore;
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";
import favoritesReducer from "./favoritesSlice";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  gemini: gptReducer,
  config: configReducer,
  favorites: favoritesReducer,
});

// Only apply Redux Persist in a browser environment
const isClient = typeof window !== "undefined";

const makeStore = () => {
  if (isClient) {
    const persistConfig = {
      key: "root",
      storage,
      // You might want to blacklist certain reducers
      blacklist: ["gemini"], // Don't persist Gemini search results
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
          },
        }),
    });

    store.__persistor = persistStore(store);
    return store;
  } else {
    // Return a regular store for SSR
    return configureStore({
      reducer: rootReducer,
    });
  }
};

const appStore = makeStore();
export const persistor = appStore.__persistor;
export default appStore;
