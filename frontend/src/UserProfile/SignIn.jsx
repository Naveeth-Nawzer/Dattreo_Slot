import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import register from '../assets/first_visit.png'

export default function FirstVisitForm() {
  const [passVisible, setPassVisible] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <TealWaveBackground/>
      <BrushTealWaves/>

      {/* Main card container */}
      <div className="relative bg-[#F7FBFB] rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden mt-[70px]">
        {/* Left side form */}
        <div className="p-12 flex flex-col text-end flex-1 max-w-md">
          <h2 className="text-3xl font-medium text-gray-900 mb-8">
            Continue with <br /><span className="text-[#0A8F70] font-bold">pass code</span>
          </h2>

          <form className="flex flex-col gap-6">
                <label className="block text-sm font-normal text-gray-700 relative mt-[80px] text-start">
                  Pass code
                  <input
                    type={passVisible ? "password" : "text"}
                    className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 pr-8 bg-[#F7FBFB]"
                  />
                  <button
                    type="button"
                    onClick={() => setPassVisible(!passVisible)}
                    className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
                  >
                    {passVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </label>

                <button
                type="submit"
                className="mt-[120px] bg-[#F7FBFB] border border-teal-300 text-teal-900 font-medium rounded-xl py-3 hover:bg-teal-50 transition-colors"
                >
                Confirm
                </button>
              </form>
        </div>

        {/* Right side*/}
        
          <div className="flex items-center justify-center relative flex-1">
            <img 
                src={register}
                alt="register_img"
                className="w-[400px] h-[500px] mr-[50px]"/>
          </div>

        </div>
    </div>
  );
}