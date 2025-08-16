import React from 'react';

const PasswordVisibilityIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const FirstVisitForm = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background SVG paths for abstract lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="#B2DCD0"
        strokeWidth="1.5"
      >
        <path d="M0 150 Q200 200 400 150 T800 150 T1200 150" />
        <path d="M0 300 Q150 250 300 300 T600 300 T900 300 T1200 300" />
        <path d="M-100 500 Q150 550 400 500 T800 500 T1200 500" />
        <path d="M200 800 Q400 750 600 800 T1000 800 T1400 800" />
      </svg>

      <div className="bg-white rounded-3xl flex shadow-xl max-w-4xl w-full">
        {/* Left Form Section */}
        <div className="flex-1 p-16">
          <h2 className="text-3xl font-light text-gray-800">Book Your</h2>
          <h1 className="text-4xl font-bold text-teal-600 mt-2">
            First Visit
          </h1>

          <form className="mt-12 space-y-8">
            <div className="relative">
              <input
                type="text"
                id="name"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium"
                placeholder=" "
              />
              <label
                htmlFor="name"
                className="absolute left-0 top-0 text-gray-500 transition-all duration-300 ease-in-out transform -translate-y-6 scale-75 origin-top-left"
              >
                Name
              </label>
            </div>
            
            <div className="relative">
              <input
                type="text"
                id="nic"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium"
                placeholder=" "
              />
              <label
                htmlFor="nic"
                className="absolute left-0 top-0 text-gray-500 transition-all duration-300 ease-in-out transform -translate-y-6 scale-75 origin-top-left"
              >
                NIC Number
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="email"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-0 text-gray-500 transition-all duration-300 ease-in-out transform -translate-y-6 scale-75 origin-top-left"
              >
                Email / Mobile number
              </label>
            </div>
            
            <div className="relative flex items-center">
              <input
                type="password"
                id="passcode"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium"
                placeholder=" "
              />
              <label
                htmlFor="passcode"
                className="absolute left-0 top-0 text-gray-500 transition-all duration-300 ease-in-out transform -translate-y-6 scale-75 origin-top-left"
              >
                Pass code
              </label>
              <button
                type="button"
                className="absolute right-0 bottom-2"
                aria-label="Toggle password visibility"
              >
                <PasswordVisibilityIcon />
              </button>
            </div>
            
            <div className="relative flex items-center">
              <input
                type="password"
                id="confirm-passcode"
                className="w-full pb-2 border-b-2 border-gray-300 focus:outline-none focus:border-teal-600 text-lg font-medium"
                placeholder=" "
              />
              <label
                htmlFor="confirm-passcode"
                className="absolute left-0 top-0 text-gray-500 transition-all duration-300 ease-in-out transform -translate-y-6 scale-75 origin-top-left"
              >
                Confirm Pass code
              </label>
              <button
                type="button"
                className="absolute right-0 bottom-2"
                aria-label="Toggle password visibility"
              >
                <PasswordVisibilityIcon />
              </button>
            </div>
          </form>

          <button
            type="submit"
            className="mt-12 w-full max-w-xs p-4 text-center rounded-2xl border-2 border-gray-300 text-lg font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            Confirm
          </button>
        </div>

        {/* Right Gradient Shape Section */}
        <div className="flex-1 relative rounded-r-3xl overflow-hidden hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-700 opacity-80 rounded-r-3xl"></div>
          {/* Custom SVG for the abstract shape */}
          <svg
            className="absolute inset-0 w-full h-full text-white"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M338.455 125.75C345.925 158.85 292.007 151.785 260.672 174.524C229.338 197.262 178.683 207.24 163.66 242.062C148.636 276.884 186.291 324.908 197.433 361.341C208.574 397.773 216.745 425.467 225.109 444.606C233.473 463.745 242.029 474.329 250.298 481.564C258.567 488.799 266.353 492.684 269.957 487.671C273.56 482.658 274.962 468.647 278.47 448.974C281.979 429.301 287.591 403.966 295.66 381.168C303.728 358.371 314.254 338.11 327.319 320.387C340.384 302.664 355.986 287.478 372.49 276.103C389 264.728 406.403 257.165 407.452 249.789C408.5 242.412 393.197 235.215 378.718 227.027C364.24 218.84 350.584 209.661 338.455 198.887"
              stroke="#B2DCD0"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            {/* The main solid shape */}
            <path
              d="M174.454 135.25C181.924 168.35 235.842 161.285 267.177 184.024C298.511 206.762 349.167 216.74 364.19 251.562C379.213 286.384 341.558 334.408 330.417 370.841C319.275 407.273 311.104 434.967 302.74 454.106C294.376 473.245 285.82 483.829 277.551 491.064C269.282 498.299 261.496 502.184 257.892 497.171C254.288 492.158 252.886 478.147 249.378 458.474C245.869 438.801 240.257 413.466 232.188 390.668C224.12 367.871 213.594 347.61 200.529 329.887C187.464 312.164 171.862 296.978 155.358 285.603C138.855 274.228 121.451 266.665 120.402 259.289C119.354 251.912 134.657 244.715 149.136 236.527C163.614 228.34 177.27 219.161 189.4 208.387"
              stroke="#B2DCD0"
              strokeWidth="2"
              fill="url(#paint0_linear_2_23)"
              opacity="0.9"
            />
            {/* The second solid shape */}
            <path
              d="M174.454 135.25L237.952 10.25L327.319 320.387L174.454 135.25Z"
              stroke="#B2DCD0"
              strokeWidth="2"
              fill="url(#paint1_linear_2_23)"
              opacity="0.9"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2_23"
                x1="120.402"
                y1="135.25"
                x2="364.19"
                y2="491.064"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5DB9A6" />
                <stop offset="1" stopColor="#3E8D7F" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_2_23"
                x1="174.454"
                y1="135.25"
                x2="327.319"
                y2="320.387"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5DB9A6" />
                <stop offset="1" stopColor="#3E8D7F" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FirstVisitForm;