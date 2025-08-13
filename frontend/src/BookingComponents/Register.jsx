import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // You can install lucide-react or replace with your own icons

export default function FirstVisitForm() {
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative px-6">
      {/* Abstract green strokes in background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        fill="none"
        viewBox="0 0 800 800"
      >
        <path
          fill="#63BFA7"
          fillOpacity="0.2"
          d="M140 720c70-160 160-280 270-360 50-40 130-70 170-40 35 25 70 170 90 240 30 110 40 150 10 200H140z"
          filter="url(#shadow)"
          style={{ mixBlendMode: "multiply" }}
        />
        <path
          fill="#63BFA7"
          fillOpacity="0.25"
          d="M0 440c90-150 120-280 190-360 40-50 140-70 170-40 35 25 80 170 110 240 40 110 30 150 20 200H0z"
          style={{ mixBlendMode: "multiply" }}
        />
      </svg>

      {/* Main card container */}
      <div className="relative bg-white rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Left side form */}
        <div className="p-12 flex flex-col justify-center flex-1 max-w-md">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Book Your <span className="text-teal-700 font-bold">First Visit</span>
          </h2>

          <form className="flex flex-col gap-6">
            <label className="block text-sm font-normal text-gray-700">
              Name
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1"
                placeholder="Your full name"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700">
              NIC Number
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1"
                placeholder="National ID Number"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700">
              Email / Mobile number
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1"
                placeholder="Email or Mobile"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700 relative">
              Pass code
              <input
                type={passVisible ? "text" : "password"}
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 pr-8"
                placeholder="Enter pass code"
              />
              <button
                type="button"
                onClick={() => setPassVisible(!passVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
              >
                {passVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <label className="block text-sm font-normal text-gray-700 relative">
              Confirm Pass code
              <input
                type={confirmPassVisible ? "text" : "password"}
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 pr-8"
                placeholder="Confirm pass code"
              />
              <button
                type="button"
                onClick={() => setConfirmPassVisible(!confirmPassVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
              >
                {confirmPassVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <button
              type="submit"
              className="mt-8 bg-white border border-teal-300 text-teal-900 font-medium rounded-xl py-3 hover:bg-teal-50 transition-colors"
            >
              Confirm
            </button>
          </form>
        </div>

        {/* Right side big green shape */}
        <div className="relative flex-1 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-r-3xl shadow-inner flex items-center justify-center">
          {/* The big abstract shape */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-64 h-64 md:w-80 md:h-80"
            viewBox="0 0 400 400"
            fill="url(#grad)"
          >
            <defs>
              <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#72bda3" />
                <stop offset="100%" stopColor="#3f8a72" />
              </radialGradient>
            </defs>
            <path
              d="M80 20 Q40 40 60 80 L90 120 Q20 110 70 180 L150 270 Q180 350 280 300 Q340 250 340 180 Q330 110 320 90 Q350 30 280 20 Z"
              fill="url(#grad)"
              filter="url(#shadow)"
              stroke="#2e6f5d"
              strokeWidth="3"
              rx="20"
              ry="20"
              style={{ filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.1))" }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
