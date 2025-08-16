import React, { useState } from "react";



export default function Sidebar() {
      return (

  <div className="flex flex-col items-center space-y-8 bg-white rounded-l-3xl p-6 shadow-lg w-20">
    <button className="bg-gray-300 rounded-xl p-3 hover:bg-gray-400 transition">
      <svg
        className="w-6 h-6 text-gray-700"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M3 9.75L12 3l9 6.75v10.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 20.25V9.75z" />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h4l3 8 4-16 3 8h4"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-4-12h4m-4 0v12m-4-6h.01M7 16h.01M7 12h.01M7 8h.01"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7"
        />
      </svg>
    </button>
  </div>
      )
};