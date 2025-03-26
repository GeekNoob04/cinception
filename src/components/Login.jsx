import React, { useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "./Header";
import { checkValidDAta } from "../utils/Validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BG_URL, USER_AVATAR } from "../utils/constant";

const LoadingSpinner = () => (
  <div className="inline-block align-middle mr-2">
    <div className="w-5 h-5 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const dispatch = useDispatch();

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrors({ name: "", email: "", password: "" });
    setIsPasswordVisible(false);
    setPasswordValue("");
  };

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
  };

  const handleButtonClick = () => {
    const name = nameRef.current?.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const errorMessage = checkValidDAta(
      isSignInForm ? null : name,
      email,
      password
    );

    if (errorMessage) {
      setErrors({
        name: errorMessage.includes("Name") ? errorMessage : "",
        email: errorMessage.includes("Email") ? errorMessage : "",
        password: errorMessage.includes("Password") ? errorMessage : "",
      });
      return;
    }

    setIsLoading(true);

    if (!isSignInForm) {
      // Sign Up
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return updateProfile(user, {
            displayName: name,
            photoURL: USER_AVATAR,
          });
        })
        .then(() => {
          const { uid, email, displayName, photoURL } = auth.currentUser;
          dispatch(addUser({ uid, email, displayName, photoURL }));
        })
        .catch((error) => {
          setErrors({ ...errors, email: error.message });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Sign In
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {})
        .catch((error) => {
          setErrors({ ...errors, email: error.message });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src={BG_URL}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-md absolute p-12 bg-black/80 my-36 mx-auto right-0 left-0 text-white rounded-lg"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <div>
            <input
              ref={nameRef}
              type="text"
              placeholder="Enter Your Name"
              className="p-4 my-2 w-full bg-gray-700"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
        )}
        <div>
          <input
            ref={emailRef}
            type="text"
            placeholder="Email Address"
            className="p-4 my-2 w-full bg-gray-700"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <input
            ref={passwordRef}
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={passwordValue}
            onChange={handlePasswordChange}
            className="p-4 my-2 w-full bg-gray-700 pr-12"
          />
          {passwordValue && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-900 focus:outline-none cursor-pointer"
            >
              {isPasswordVisible ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          )}
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <button
          className="p-4 my-6 bg-red-700 w-full rounded-lg cursor-pointer hover:bg-red-800 transition-colors relative"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
              <span>{isSignInForm ? "Signing In..." : "Signing Up..."}</span>
            </div>
          ) : isSignInForm ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </button>
        <p
          className="py-4 cursor-pointer text-center hover:underline"
          onClick={toggleSignInForm}
        >
          {isSignInForm ? "New to CINCEPTION? " : "Already a User? "}
          <span className="font-bold">
            {isSignInForm ? "Sign Up Now" : "Sign In Now"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
