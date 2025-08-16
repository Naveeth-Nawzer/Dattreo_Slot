import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from "../Components/BrushTealWaves";

export default function FirstVisit() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const options = [
    { 
      text: t('firstVisit.bookVisit'), 
      action: () => navigate('/register') 
    },
    { 
      text: t('firstVisit.continueWithPasscode'), 
      action: () => navigate('/signin') 
    }
  ];

  return (
    <>
      <TealWaveBackground />
      <BrushTealWaves />

      <div className="flex items-center justify-center bg-transparent relative overflow-hidden mt-[200px] sm:mt-[170px] px-4">
        <div className="bg-[#F7FBFB] p-6 sm:p-12 md:p-20 rounded-3xl shadow-lg text-center z-10 w-full max-w-4xl">
          <div className="flex flex-col gap-4 sm:gap-6 items-center">
            {options.map((option) => (
              <button
                key={option.text}
                className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-full border border-emerald-300 bg-white text-base sm:text-lg md:text-xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300 w-auto min-w-[200px] whitespace-nowrap"
                onClick={option.action}
              >
                {option.text}
              </button>
            ))}

          </div>
        </div>
      </div>
    </>
  );
}