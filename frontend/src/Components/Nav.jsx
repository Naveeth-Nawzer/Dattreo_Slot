// import React from 'react'
// import slot from "../assets/slot.png"
// import { GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";

// const Nav = () => {
//   return (
//     <div>
//         <header className="flex items-center justify-between px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10 ">
//         {/* Logo */}
//         <div className="flex items-center space-x-2">
//           <img
//             src={slot}
//             alt="logo image"
//             className="w-[150px] object-contain"
//           />
//         </div>

//         {/* Nav */}
//         <nav className="hidden md:flex space-x-8 text-black font-medium">
//           <a href="#" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
//             HOME
//           </a>
//           <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">Book Appointment</a>
//           <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">My Appointments</a>
//           <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">Track Queue</a>
//         </nav>

//         {/* Right icons */}
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer">
//             <GlobeAltIcon className="w-5 h-5" />
//             <select className="bg-teal-300 bg-clip-text outline-none ml-3">
//               <option>English</option>
//               <option>Tamil</option>
//               <option>Sinhala</option>
//             </select>
//           </div>
//           <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]" />
//         </div>
//       </header>
//     </div>
//   )
// }

// export default Nav




import React from 'react'
import slot from "../assets/slot.png"
import { GlobeAltIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import {useNavigate } from "react-router-dom";

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={slot}
            alt="logo image"
            className="w-24 md:w-[150px] object-contain"
          />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-[#4CDBB9] focus:outline-none"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-8 h-8" />
            ) : (
              <Bars3Icon className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 text-black font-medium">
          <a href="/home" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
            HOME
          </a>
          <a href="/BookingAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
            Book Appointment
          </a>
          <a href="/MyAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
            My Appointments
          </a>
          <a href="/TrackQueue" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
            Track Queue
          </a>
        </nav>

        {/* Right icons - Hidden on small mobile, visible on larger */}
        <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
          <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer text-sm lg:text-base">
            <GlobeAltIcon className="w-4 lg:w-5 h-4 lg:h-5" />
            <select className="bg-teal-300 bg-clip-text outline-none ml-2 lg:ml-3 text-xs lg:text-sm">
              <option>English</option>
              <option>Tamil</option>
              <option>Sinhala</option>
            </select>
          </div>

          <div className='cursor-pointer'
              onClick={() => navigate("/profile")}>
          <UserCircleIcon className="w-7 lg:w-8 h-7 lg:h-8 text-[#4CDBB9]" />
            </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F7FBFB] shadow-lg rounded-b-2xl px-4 py-2">
            <nav className="flex flex-col space-y-4 text-black font-medium">
              <a href="/home" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
                HOME
              </a>
              <a href="/BookingAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
                Book Appointment
              </a>
              <a href="/MyAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
                My Appointments
              </a>
              <a href="/TrackQueue" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
                Track Queue
              </a>
            </nav>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center bg-[#4CDBB9] text-white px-3 py-1 rounded-full cursor-pointer">
                <GlobeAltIcon className="w-5 h-5" />
                <select className="bg-teal-300 bg-clip-text outline-none ml-2">
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Sinhala</option>
                </select>
              </div>

              <div className='cursor-pointer'
              onClick={() => navigate("/profile")}>
                <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]"/>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

export default Nav