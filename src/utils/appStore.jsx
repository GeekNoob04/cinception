// // import { configureStore } from "@reduxjs/toolkit";
// // import userReducer from "./userSlice";
// // import moviesReducer from "./moviesSlice";
// // import gptReducer from "./gptSlice";
// // import configReducer from "./configSlice";
// // const appStore = configureStore({
// //   reducer: {
// //     user: userReducer,
// //     movies: moviesReducer,
// //     gemini: gptReducer,
// //     config: configReducer,
// //   },
// // });
// // export default appStore;
// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import { combineReducers } from "redux";
// import userReducer from "./userSlice";
// import moviesReducer from "./moviesSlice";
// import gptReducer from "./gptSlice";
// import configReducer from "./configSlice";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// // Combine all reducers
// const rootReducer = combineReducers({
//   user: userReducer,
//   movies: moviesReducer,
//   gemini: gptReducer,
//   config: configReducer,
// });

// // Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Create store with persisted reducer
// const appStore = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       },
//     }),
// });

// // Create persistor
// export const persistor = persistStore(appStore);

// export default appStore;

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  gemini: gptReducer,
  config: configReducer,
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
