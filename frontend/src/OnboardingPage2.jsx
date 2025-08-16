import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TealWaveBackground from "./Components/TealWaveBackground";
import BrushTealWaves from './Components/BrushTealWaves';

const OnboardingPage2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait 2 seconds, then go to home page
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed w-full h-screen">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none">
        <TealWaveBackground />
        <BrushTealWaves />
      </div>

      {/* Optional message or animation */}
      <div className="flex items-center justify-center w-full h-full relative z-10 animate-slideIn">
        <h1 className="text-white text-4xl font-bold">Almost There!</h1>
      </div>
    </div>
  );
};

export default OnboardingPage2;
