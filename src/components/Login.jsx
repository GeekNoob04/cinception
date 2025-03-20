import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidDAta } from "../utils/Validate";
const Login = () => {
  const [isSignInForm, setisSignInForm] = useState(true);

  const [errorMessage, seterrorMessage] = useState(null);

  const toggleSignInForm = () => {
    setisSignInForm(!isSignInForm);
  };
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    // validate
    console.log(email.current.value);
    console.log(password.current.value);

    const message = checkValidDAta(
      isSignInForm ? null : name.current?.value,
      email.current.value,
      password.current.value
    );
    seterrorMessage(message);

    // Sign In / Sign Up
  };
  return (
    <div>
      <Header />
      <div className="absolute">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f6e7f6df-6973-46ef-b98f-12560d2b3c69/web/IN-en-20250317-TRIFECTA-perspective_26f87873-6014-460d-a6fb-1d96d85ffe5f_large.jpg"
          alt="background image"
          className="w-full"
        />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-3/12 absolute p-12 bg-black/80 my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-50"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Enter Your Name"
            className="p-4 my-4  w-full bg-gray-700 "
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 "
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4  w-full bg-gray-700 "
        />
        <p className="text-red-400 font-bold text-lg py-2">{errorMessage}</p>
        <button
          className="p-4 my-6 bg-red-700 w-full rounded-lg"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to NETFLIX? Sign Up Now"
            : "Already a User? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
