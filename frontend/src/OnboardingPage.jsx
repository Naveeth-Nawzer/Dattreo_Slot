import React from 'react'
import TealWaveBackground from "./Components/TealWaveBackground";
import logo from "./assets/logo.png";
import BrushTealWaves from './Components/BrushTealWaves';

const OnboardingPage = () => {
  return (
    <div className="fixed w-full h-screen">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none">
        <TealWaveBackground />
        <BrushTealWaves />
      </div>

      {/* Centered logo */}
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <img
          src={logo}
          alt="logo"
          className="object-contain 
            w-[400px] sm:w-[400px] md:w-[400px] lg:w-[500px] 
            mb-4 sm:mb-8 md:mb-[60px] 
            mr-16 sm:mr-0 md:mr-[100px] lg:mr-[300px]"
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
