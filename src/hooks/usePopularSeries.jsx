import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addTopRatedSeries } from "../utils/moviesSlice";
import { useEffect } from "react";

const useTopRatedSeries = () => {
  const dispatch = useDispatch();
  const nowTopRatedSeries = useSelector(
    (store) => store.movies.nowTopRatedSeries
  );
  const getTopRatedSeries = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/tv/top_rated?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log(json.results);
    dispatch(addTopRatedSeries(json.results));
  };

  useEffect(() => {
    !nowTopRatedSeries && getTopRatedSeries();
  }, []);
};

export default useTopRatedSeries;
