import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO } from "../utils/constant";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);

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

  const navigateToBrowse = () => {
    navigate("/browse");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid,
            email,
            displayName,
            photoURL,
          })
        );

        if (location.pathname === "/" || location.pathname === "*") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, location.pathname]);

  return (
    <div>
      <div className="absolute top-0 w-full z-50 bg-gradient-to-b from-black to-transparent flex justify-between items-center p-4 md:px-10 md:py-6">
        <div className="w-32 md:w-44 md:ml-4">
          <img
            draggable="false"
            src={LOGO}
            className="w-full cursor-pointer"
            alt="Logo"
            onClick={() => {
              user ? window.location.reload() : navigate("/");
            }}
          />
        </div>

        {user && (
          <>
            <div className="md:hidden">
              <GiHamburgerMenu
                className="text-white w-8 h-8 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>

            <div className="hidden md:flex md:items-center md:space-x-6 md:ml-auto">
              <Link to="/browse">
                <button
                  onClick={navigateToBrowse}
                  className="text-white font-medium relative group px-2 py-1"
                >
                  <span className="relative inline-block cursor-pointer">
                    <span className="block transition-colors duration-300 group-hover:text-gray-300">
                      Home
                    </span>
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white 
                    transform origin-center scale-x-0 
                    transition-transform duration-300 
                    group-hover:scale-x-100 group-hover:origin-center"
                    ></span>
                  </span>
                </button>
              </Link>

              {/* AI Search Button - No toggling, direct navigation */}
              <Link to="/search">
                <button className="text-white font-medium relative group px-2 py-1 flex items-center">
                  <FaSearch className="mr-2 w-4 h-4 align-middle" />
                  <span className="block transition-colors duration-300 group-hover:text-gray-300 align-middle cursor-pointer">
                    AI Search
                  </span>
                  <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white 
                    transform origin-center scale-x-0 
                    transition-transform duration-300 
                    group-hover:scale-x-100 group-hover:origin-center"
                  ></span>
                </button>
              </Link>

              <Link to="/watchlist">
                <button className="text-white font-medium relative group px-2 py-1">
                  <span className="relative inline-block cursor-pointer">
                    <span className="block transition-colors duration-300 group-hover:text-gray-300">
                      Watchlist
                    </span>
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white 
                      transform origin-center scale-x-0 
                      transition-transform duration-300 
                      group-hover:scale-x-100 group-hover:origin-center"
                    ></span>
                  </span>
                </button>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-white font-medium relative group px-2 py-1"
              >
                <span className="relative inline-block cursor-pointer">
                  <span className="block transition-colors duration-300 group-hover:text-gray-300">
                    Sign Out
                  </span>
                  <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white 
                    transform origin-center scale-x-0 
                    transition-transform duration-300 
                    group-hover:scale-x-100 group-hover:origin-center"
                  ></span>
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
