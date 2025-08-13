import React from 'react'
import TealWaveBackground from "./Components/TealWaveBackground";
import logo from "./assets/logo.png"
import BrushTealWaves from './Components/BrushTealWaves'

const OnboardingPage2 = () => {
  return (
    <div className="fixed w-full h-screen">
      {/* Static background */}
      <div className="absolute inset-0 pointer-events-none">
        <TealWaveBackground />
        <BrushTealWaves />
      </div>

      {/* Centered logo */}
      {/* <div className="flex items-center justify-center w-full h-full relative z-10">
        <img
          src={logo}
          alt="logo"
          className="w-[500px] mr-[300px] mb-[60px] object-contain"
        />
      </div> */}
    </div>
  )
}

export default OnboardingPage2
