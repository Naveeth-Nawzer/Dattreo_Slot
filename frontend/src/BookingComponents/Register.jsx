import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // You can install lucide-react or replace with your own icons
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import register from '../assets/first_visit.png'


export default function FirstVisitForm() {
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);

  return (
    <div className="flex items-center justify-center">

      <TealWaveBackground/>
      <BrushTealWaves/>

      {/* Main card container */}
      <div className="relative bg-[#F7FBFB] rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Left side form */}
        <div className="p-12 flex flex-col text-start flex-1 max-w-md">
          <h2 className="text-3xl font-medium text-gray-900 mb-8">
            Book Your <br /><span className="text-[#0A8F70] font-bold">First Visit</span>
          </h2>

          <form className="flex flex-col gap-6">
            <label className="block text-sm font-normal text-gray-700">
              Name
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700">
              NIC Number
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700">
              Email / Mobile number
              <input
                type="text"
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]"
              />
            </label>

            <label className="block text-sm font-normal text-gray-700 relative">
              Pass code
              <input
                type={!passVisible ? "text" : "password"}
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

            <label className="block text-sm font-normal text-gray-700 relative">
              Confirm Pass code
              <input
                type={!confirmPassVisible ? "text" : "password"}
                className="mt-1 w-full border-b border-gray-400 focus:border-teal-600 outline-none px-0 py-1 pr-8 bg-[#F7FBFB]"
              />
              <button
                type="button"
                onClick={() => setConfirmPassVisible(!confirmPassVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
              >
                {confirmPassVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <button
              type="submit"
              className="mt-8 bg-[#F7FBFB] border border-teal-300 text-teal-900 font-medium rounded-xl py-3 hover:bg-teal-50 transition-colors"
            >
              Confirm
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center relative flex-1">
          {/* Right side big green shape */}
          <div className="relative w-80 h-96">
            {/* <div className="w-40 h-40 
                bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] 
                from-[#4CDBB9] to-[#297563] 
                rounded-tr-[30%] rounded-bl-[30%] 
                rounded-tl-[30%] rounded-br-[30%]
                rotate-[-35deg]">
</div>


<div className="absolute top-10 left-5 w-[300px] h-[400px]
                bg-[radial-gradient(ellipse_at_top_right,_#4CDBB9,_#297563)]
                clip-path-[polygon(0%_0%,_100%_0%,_75%_100%,_25%_100%)]
                shadow-inner
                rounded-tr-[20%] rounded-bl-[20%] 
                rounded-tl-[50%] rounded-br-[20%]">
</div> */}

            {/* Optional top-left small shape */}
            {/* <div className="absolute top-[-20px] left-10 w-32 h-20
                            bg-gradient-to-tr from-teal-300 to-teal-500
                            rounded-full
                            rotate-12">
            </div> */}
          </div>
          <img 
              src={register}
              alt="register_img"
              className="w-[500px] h-[600px] mr-[50px]"/>
        </div>
      </div>
    </div>
  );
}
