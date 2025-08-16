// src/Components/PageNavigator.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PageNavigator = ({ routesOrder }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = routesOrder.indexOf(location.pathname);

  const goPrevious = () => {
    if (currentIndex > 0) navigate(routesOrder[currentIndex - 1]);
  };

  const goNext = () => {
    if (currentIndex < routesOrder.length - 1) navigate(routesOrder[currentIndex + 1]);
  };

  return (
    <div className="flex justify-between my-4">
      <button
        onClick={goPrevious}
        disabled={currentIndex === 0}
        className="bg-teal-500 text-white px-3 py-1 rounded disabled:opacity-50 hover:bg-transparent hover:text-teal-500"
      >
        ⬅ Prev
      </button>
      {/* <button
        onClick={goNext}
        disabled={currentIndex === routesOrder.length - 1}
        className="bg-teal-500 text-white px-3 py-1 rounded disabled:opacity-50 hover:bg-transparent hover:text-teal-500"
      >
        Next ➡
      </button> */}
    </div>
  );
};

export default PageNavigator;
