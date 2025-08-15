import React from "react";
import { useNavigate } from "react-router-dom";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves';
import Nav from "../Components/Nav";

export default function LanguageSelection() {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <TealWaveBackground />
      <BrushTealWaves />

      <div className="flex items-center justify-center bg-transparent relative overflow-hidden mt-[170px]">
        {/* Main container */}
        <div className="bg-[#F7FBFB] p-20 rounded-3xl shadow-lg text-center z-10 w-[800px]">
          <div className="flex flex-col gap-6 items-center">
            <button
              className="px-10 py-6 rounded-full border border-emerald-300 bg-white text-xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300 w-[350px] whitespace-nowrap"
              onClick={() => navigate('/signup')}
            >
              Book your first visit
            </button>

            <button
              className="px-10 py-6 rounded-full border border-emerald-300 bg-white text-xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300 w-[350px] whitespace-nowrap"
              onClick={() => navigate('/signIn')}
            >
              Continue with pass code
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
