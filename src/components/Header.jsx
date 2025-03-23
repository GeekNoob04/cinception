// import { signOut } from "firebase/auth";
// import React from "react";
// import { auth } from "../utils/firebase";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { addUser, removeUser } from "../utils/userSlice";
// import { LOGO } from "../utils/constant";
// import { toggleGptSearchView } from "../utils/gptSlice";
// import { SUPPORTED_LANGUAGES } from "../utils/LangConstants";
// import { changeLang } from "../utils/configSlice";

// const Header = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((store) => store.user);
//   const showGptSearch = useSelector((store) => store.gemini.showGptSearch);

//   const handleSignOut = () => {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful.
//       })
//       .catch(() => {
//         // An error happened.
//         navigate("/error"); // TODO - to build
//       });
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const { uid, email, displayName, photoURL } = user;
//         dispatch(
//           addUser({
//             uid: uid,
//             email: email,
//             displayName: displayName,
//             photoURL: photoURL,
//           })
//         );
//         navigate("/browse");
//       } else {
//         // User is signed out
//         dispatch(removeUser());
//         navigate("/");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleGptSearchClick = () => {
//     dispatch(toggleGptSearchView());
//   };

//   const handleLangChange = (e) => {
//     dispatch(changeLang(e.target.value));
//   };

//   return (
//     <div className="fixed top-0 w-full px-4 md:px-10 py-4 md:py-6 bg-gradient-to-b from-black to-transparent z-50 flex flex-col md:flex-row md:justify-between items-center">
//       <img className="w-32 md:w-44" src={LOGO} alt="logo" />
//       {user && (
//         <div className="flex flex-wrap items-center justify-center mt-4 md:mt-0">
//           {showGptSearch && (
//             <select
//               className="p-2 m-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//               onChange={handleLangChange}
//             >
//               {SUPPORTED_LANGUAGES.map((lang) => (
//                 <option key={lang.identifier} value={lang.identifier}>
//                   {lang.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           <button
//             className="py-2 px-4 mx-2 my-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition-colors duration-300 font-medium"
//             onClick={handleGptSearchClick}
//           >
//             {showGptSearch ? "Home" : "AI Search"}
//           </button>

//           <div className="flex items-center mx-2">
//             <img
//               className="w-10 h-10 rounded-full mr-2 border-2 border-white"
//               src={user?.photoURL}
//               alt="User avatar"
//             />
//             <button
//               onClick={handleSignOut}
//               className="font-bold text-white hover:underline"
//             >
//               Sign Out
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Header;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLang } from "../utils/configSlice";
import { SUPPORTED_LANGUAGES } from "../utils/LangConstants";
import { LOGO } from "../utils/constant";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gemini.showGptSearch);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLangChange = (e) => {
    dispatch(changeLang(e.target.value));
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

  return (
    <div>
      <div className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent flex justify-between items-center p-4 md:px-10 md:py-6">
        <Link to="/browse">
          <img
            src={LOGO}
            className={`w-32 md:w-44 ${!user ? "mx-auto md:ml-4" : ""}`}
            alt="Logo"
          />
        </Link>

        {user && (
          <>
            {/* Mobile Hamburger Menu Icon */}
            <div className="md:hidden">
              <GiHamburgerMenu
                className="text-white w-8 h-8 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-6 md:ml-auto">
              {showGptSearch && (
                <select
                  className="p-2 mr-6 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onChange={handleLangChange}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.identifier} value={lang.identifier}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Only show Home button when not in GPT search view */}
              {!showGptSearch && (
                <Link to="/browse">
                  <button className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300">
                    Home
                  </button>
                </Link>
              )}

              <button
                onClick={handleGptSearchClick}
                className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
              >
                {showGptSearch ? "Home" : "AI Recommends"}
              </button>

              <Link to="/favourites">
                <button className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300">
                  Favourites
                </button>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed z-50 bg-black h-screen w-full top-0 transition-transform duration-300 transform ${
          isMenuOpen && user ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-0 left-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="flex justify-end p-4">
          <IoMdClose
            className="text-white w-8 h-8 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        </div>
        <div className="flex flex-col items-end pr-4 pt-8 space-y-8">
          {showGptSearch && (
            <select
              className="p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 w-full max-w-xs"
              onChange={handleLangChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}

          {/* Only show Home link when not in GPT search view */}
          {!showGptSearch && (
            <Link to="/browse" onClick={() => setIsMenuOpen(false)}>
              <span className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer">
                Home
              </span>
            </Link>
          )}

          <span
            onClick={() => {
              handleGptSearchClick();
              setIsMenuOpen(false);
            }}
            className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
          >
            {showGptSearch ? "Home" : "AI Recommends"}
          </span>

          <Link to="/favourites" onClick={() => setIsMenuOpen(false)}>
            <span className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer">
              Favourites
            </span>
          </Link>

          <span
            onClick={() => {
              handleSignOut();
              setIsMenuOpen(false);
            }}
            className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
          >
            Sign Out
          </span>

          <div className="flex justify-around w-[35%] text-3xl">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
