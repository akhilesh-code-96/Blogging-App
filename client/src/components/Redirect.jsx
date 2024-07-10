import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Redirect() {
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(intervalId);
      window.location.href = "/login";
    }, 3000);

    return () => clearInterval(intervalId);
  }, [counter]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 md:p-12 bg-green-50 rounded-md shadow-md">
      {/* Green background & rounded corners */}
      <h2 className="text-3xl font-bold text-gray-900">
        Thank you for registering!
      </h2>
      <p className="text-gray-600 text-lg">
        You will be redirected shortly within <span>{counter}</span>.
      </p>
      <Link to="/login">
        <button className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700">
          Login
        </button>
      </Link>
    </div>
  );
}
