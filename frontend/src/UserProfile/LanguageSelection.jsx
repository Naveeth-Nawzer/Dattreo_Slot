import React from "react";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'

export default function LanguageSelection() {
  const languages = ["English", "Tamil", "Sinhala"];

  return (
    <div className="flex items-center justify-center bg-transparent relative overflow-hidden fixed ">
      <TealWaveBackground/>
      <BrushTealWaves/>
      

      {/* Main container */}
      <div className="bg-[#F7FBFB] p-20 rounded-3xl shadow-lg text-center z-10 w-[800px] mt-[120px]">
        <h2 className="text-5xl font-medium mb-4">Select your</h2>
        <h2 className="text-5xl font-bold text-[#0A8F70] mb-14">
          Prefer Language
        </h2>

        <div className="flex gap-10 justify-center">
          {languages.map((lang) => (
            <button
              key={lang}
              className="px-16 py-6 rounded-full border border-emerald-300 bg-white text-2xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
