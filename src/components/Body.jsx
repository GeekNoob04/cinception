import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./Header"; // Import the Header component
import Login from "./Login";
import Browse from "./Browse";
import Watchlist from "./watchlist";
import GptSearch from "./GptSearch";
import ErrorPage from "./ErrorPage";

// Define the layout inside Body.jsx
const Layout = () => {
  return (
    <div>
      <Header /> {/* Header will always be visible */}
      <Outlet /> {/* This will render the current page component */}
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Wrap all routes inside Layout
    children: [
      { path: "/", element: <Login /> },
      { path: "/browse", element: <Browse /> },
      { path: "/search", element: <GptSearch /> },
      { path: "/watchlist", element: <Watchlist /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

const Body = () => {
  return <RouterProvider router={appRouter} />;
};

export default Body;
