import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO } from "../utils/constant";
import { toggleGptSearchView } from "../utils/gptSlice";
import { SUPPORTED_LANGUAGES } from "../utils/LangConstants";
import { changeLang } from "../utils/configSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gemini.showGptSearch);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch(() => {
        // An error happened.
        navigate("/error"); // TODO - to build
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        // User is signed out
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLangChange = (e) => {
    dispatch(changeLang(e.target.value));
  };

  return (
    <div className="fixed top-0 w-full px-4 md:px-10 py-4 md:py-6 bg-gradient-to-b from-black to-transparent z-50 flex flex-col md:flex-row md:justify-between items-center">
      <img className="w-32 md:w-44" src={LOGO} alt="logo" />
      {user && (
        <div className="flex flex-wrap items-center justify-center mt-4 md:mt-0">
          {showGptSearch && (
            <select
              className="p-2 m-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={handleLangChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          <button
            className="py-2 px-4 mx-2 my-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition-colors duration-300 font-medium"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Home" : "AI Search"}
          </button>

          <div className="flex items-center mx-2">
            <img
              className="w-10 h-10 rounded-full mr-2 border-2 border-white"
              src={user?.photoURL}
              alt="User avatar"
            />
            <button
              onClick={handleSignOut}
              className="font-bold text-white hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
