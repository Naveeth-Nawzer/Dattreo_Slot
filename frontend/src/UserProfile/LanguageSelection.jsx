// import React from "react";
// import TealWaveBackground from "../Components/TealWaveBackground";
// import BrushTealWaves from '../Components/BrushTealWaves'

// export default function LanguageSelection() {
//   const languages = ["English", "Tamil", "Sinhala"];

//   return (
//     <div className="flex items-center justify-center bg-transparent relative overflow-hidden fixed ">
//       <TealWaveBackground/>
//       <BrushTealWaves/>
      

//       {/* Main container */}
//       <div className="bg-[#F7FBFB] p-20 rounded-3xl shadow-lg text-center z-10 w-[800px] mt-[120px]">
//         <h2 className="text-5xl font-medium mb-4">Select your</h2>
//         <h2 className="text-5xl font-bold text-[#0A8F70] mb-14">
//           Prefer Language
//         </h2>

//         <div className="flex gap-10 justify-center">
//           {languages.map((lang) => (
//             <button
//               key={lang}
//               className="px-16 py-6 rounded-full border border-emerald-300 bg-white text-2xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300"
//             >
//               {lang}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



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
      <div className="bg-[#F7FBFB] p-6 sm:p-10 md:p-20 rounded-3xl shadow-lg text-center z-10 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:w-[800px] mt-[80px] sm:mt-[60px] md:mt-[120px]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-2 sm:mb-4">Select your</h2>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A8F70] mb-8 sm:mb-14">
          Preferred Language
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 justify-center">
          {languages.map((lang) => (
            <button
              key={lang.code}
                className="px-6 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 rounded-full border border-emerald-300 bg-white text-lg sm:text-xl md:text-2xl text-black font-semibold hover:bg-emerald-50 transition outline outline-1 outline-emerald-300 w-full sm:w-auto"              onClick={() => handleLanguageSelect(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}