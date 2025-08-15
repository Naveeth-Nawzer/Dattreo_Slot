import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves';

export default function LanguageSelection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: "en", label: "English" },
    { code: "ta", label: "Tamil" },
    { code: "si", label: "Sinhala" },
  ];

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code); // Change the language globally
    navigate('/home'); // Redirect to home page after selection
  };

  return (
    <div className="flex items-center justify-center bg-transparent relative overflow-hidden fixed w-full h-screen">
      <TealWaveBackground />
      <BrushTealWaves />

      {/* Main container */}
      <div className="bg-[#F7FBFB] p-20 rounded-3xl shadow-lg text-center z-10 w-[800px] mt-[120px]">
        <h2 className="text-5xl font-medium mb-4">Select your</h2>
        <h2 className="text-5xl font-bold text-[#0A8F70] mb-14">
          Preferred Language
        </h2>

        <div className="flex gap-10 justify-center">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="px-16 py-6 rounded-full border border-emerald-300 bg-white text-2xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
