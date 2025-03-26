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
            {/* Mobile Hamburger Menu Icon */}
            <div className="md:hidden">
              <GiHamburgerMenu
                className="text-white w-8 h-8 cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>

            {/* Desktop Menu */}
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

      {/* Mobile Menu */}
      {user && (
        <div
          className={`fixed z-50 bg-black h-screen w-full top-0 transition-transform duration-300 transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
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
            <Link to="/browse" onClick={() => setIsMenuOpen(false)}>
              <span
                className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer"
                onClick={navigateToBrowse}
              >
                Home
              </span>
            </Link>
            <Link to="/search" onClick={() => setIsMenuOpen(false)}>
              <span className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer">
                AI Search
              </span>
            </Link>
            <Link to="/watchlist" onClick={() => setIsMenuOpen(false)}>
              <span className="border-b-2 border-red-600 pb-1 text-white text-xl hover:text-red-600 transition duration-300 cursor-pointer">
                Watchlist
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
                href="https://x.com/BudhrajaHarshit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://www.linkedin.com/in/harshit-budhraja-621a70251/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/harshitisdelusional/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
