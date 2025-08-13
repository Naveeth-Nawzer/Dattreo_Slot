import React from "react";

export default function LanguageSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Decorative background strokes */}
      <div className="absolute inset-0">
        {/* Add SVG or images for green strokes */}
      </div>

      {/* Main container */}
      <div className="bg-[#F7FBFB] p-20 rounded-3xl shadow-lg text-center z-10 w-[800px]">
        <div className="flex flex-col gap-6 items-center">
          {["Book your first visit", "Continue with pass code"].map((text) => (
            <button
              key={text}
              className="px-10 py-6 rounded-full border border-emerald-300 bg-white text-xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300 w-[350px] whitespace-nowrap"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
