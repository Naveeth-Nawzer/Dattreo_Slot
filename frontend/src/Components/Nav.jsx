import React from 'react'
import slot from "../assets/slot.png"
import { GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Nav = () => {
  return (
    <div>
        <header className="flex items-center justify-between px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10 ">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={slot}
            alt="logo image"
            className="w-[150px] object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex space-x-8 text-black font-medium">
          <a href="#" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
            HOME
          </a>
          <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">Book Appointment</a>
          <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">My Appointments</a>
          <a href="#" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">Track Queue</a>
        </nav>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer">
            <GlobeAltIcon className="w-5 h-5" />
            <select className="bg-transparent outline-none ml-3">
              <option>English</option>
              <option>Tamil</option>
              <option>Sinhala</option>
            </select>
          </div>
          <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]" />
        </div>
      </header>
    </div>
  )
}

export default Nav