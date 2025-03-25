import React, { useRef, useState } from "react";
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

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const dispatch = useDispatch();

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrors({ name: "", email: "", password: "" }); // Clear errors on form switch
  };

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

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
        });
    } else {
      // Sign In
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {})
        .catch((error) => {
          setErrors({ ...errors, email: error.message });
        });
    }
  };

  return (
    <div>
      <Header />
      <div className="absolute">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img src={BG_URL} alt="background" />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-md absolute p-12 bg-black/80 my-36 mx-auto right-0 left-0 text-white rounded-lg"
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
        <div>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="p-4 my-2 w-full bg-gray-700"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <button
          className="p-4 my-6 bg-red-700 w-full rounded-lg cursor-pointer"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to CINCEPTION? Sign Up Now"
            : "Already a User? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
