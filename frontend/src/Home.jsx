// import React from "react";
// import { GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";
// import peopleImage from "./assets/people.png";
// import Nav from './Components/Nav'
// import TealWaveBackground from './Components/TealWaveBackground'

// function Home() {
  
//   return (
//     <>
//     <div className="bg-transparent font-sans">
//       {/* Background SVGs */}
//       <TealWaveBackground/>

//       {/* Header */}
//       <Nav />

//       {/* Body */}
//       <main className="flex flex-col md:flex-row items-start justify-between px-8 py-12 fixed z-10">
//         {/* Left Content */}
//         <div className="max-w-xl text-left">
//           <h1 className="text-6xl font-bold leading-tight">
//             Welcome <br />
//             back, <span className="text-[#4CDBB9]">Henry!</span>
//           </h1>
//           <p className="mt-4 text-gray-600">
//             Let's make your hospital visit faster and smarter
//           </p>

//           {/* Buttons */}
//           <div className="grid grid-cols-2 gap-6 mt-8">
//             <button className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4">
//               Book <br/> Appointments
//             </button>
//             <button className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4">
//               My <br/> Appointment
//             </button>
//             <button className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4">
//               Track <br/> Queue
//             </button>
//             <button className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4">
//               QR <br/> Code
//             </button>
//           </div>
//         </div>

//         {/* Right Image */}
//         <div className="relative mt-12 md:mt-0">
//           <img
//             src={peopleImage}
//             alt="Queue"
//             className="w-[550px] object-contain"
//           />
//         </div>
//       </main>
//     </div>
//     </>
//   );
// }

// export default Home;






import React from "react";
import { useTranslation } from 'react-i18next';
import peopleImage from "./assets/people.png";
import Nav from './Components/Nav';
import TealWaveBackground from './Components/TealWaveBackground';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="bg-transparent font-sans">
        {/* Background SVGs */}
        <TealWaveBackground/>

        {/* Header with language selector */}
        <Nav />

        {/* Main content */}
        <main className="flex flex-col lg:flex-row items-center lg:items-start justify-between px-4 sm:px-8 py-8 gap-16 sm:py-12 lg:min-h-0">
          {/* Left Content */}
          <div className="max-w-xl text-center lg:text-left mb-8 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t('welcome')} <br />
              <span className="text-[#4CDBB9]">{t('name')}</span>
            </h1>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              {t('subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
              <button 
                onClick={() => navigate('/queue')} 
                className="bg-[#4CDBB9] text-white font-semibold h-24 sm:h-[120px] w-full sm:w-[200px] lg:w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
              >
                {t('bookAppointments')}
              </button>
              <button 
                onClick={() => navigate('/MyAppointment')} 
                className="bg-[#4CDBB9] text-white font-semibold h-24 sm:h-[120px] w-full sm:w-[200px] lg:w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
              >
                {t('myAppointment')}
              </button>
              <button 
                onClick={() => navigate('/queue')} 
                className="bg-[#4CDBB9] text-white font-semibold h-24 sm:h-[120px] w-full sm:w-[200px] lg:w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
              >
                {t('trackQueue')}
              </button>
              <button 
                onClick={() => navigate('/qr')} 
                className="bg-[#4CDBB9] text-white font-semibold h-24 sm:h-[120px] w-full sm:w-[200px] lg:w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
              >
                {t('qrCode')}
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-auto flex justify-center">
            <img
              src={peopleImage}
              alt="Queue"
              className="w-full max-w-md sm:max-w-lg lg:w-[550px] object-contain"
            />
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;