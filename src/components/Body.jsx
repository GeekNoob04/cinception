import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Browse from "./Browse";
import Watchlist from "./watchlist";
import GptSearch from "./GptSearch";
import ErrorPage from "./ErrorPage";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
