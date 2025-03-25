import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-red-500 p-6 flex items-center justify-center">
          <AlertTriangle className="text-white w-16 h-16" strokeWidth={1.5} />
        </div>
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Something went wrong. Don't worry, our team has been notified and is
            working on a fix.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md inline-block"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
