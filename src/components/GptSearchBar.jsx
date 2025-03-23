import React from "react";
import LangConstants from "../utils/LangConstants";
import { useSelector } from "react-redux";

const GptSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang);
  return (
    <div className="pt-[10%] flex justify-center">
      <form className=" bg-black w-1/2 grid grid-cols-12" action="">
        <input
          type="text"
          className="p-4 m-4 bg-white col-span-9"
          placeholder={LangConstants[langKey].GptSearchPlaceHolder}
        />
        <button className="col-span-3 m-4 py-2 px-4 bg-red-600 text-white rounded-lg">
          {LangConstants[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
