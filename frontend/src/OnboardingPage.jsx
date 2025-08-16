import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TealWaveBackground from "./Components/TealWaveBackground";
import BrushTealWaves from './Components/BrushTealWaves';
import logo from "./assets/logo.png";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Navigate to home after fade-out completes (total 2s)
    const navTimer = setTimeout(() => {
      navigate('/LanguageSelection');
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed w-full h-screen">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none">
        <TealWaveBackground />
        <BrushTealWaves />
      </div>

      {/* Centered logo with fade-in and fade-out */}
      <div className={`flex items-center justify-center w-full h-full relative z-10
                        ${fadeOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
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
