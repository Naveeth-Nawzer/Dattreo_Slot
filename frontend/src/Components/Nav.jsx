import React from 'react';
import slot from "../assets/slot.png";
import { GlobeAltIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={slot}
          alt="logo image"
          className="w-[150px] object-contain cursor-pointer"
          onClick={() => navigate('/home')}
        />
      </div>

      {/* Nav */}
      <nav className="hidden md:flex space-x-8 text-black font-medium">
        <button
          onClick={() => navigate('/home')}
          className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
        >
          HOME
        </button>
        <button
          onClick={() => navigate('/BookingAppointment')}
          className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
        >
          Book Appointment
        </button>
        <button
          onClick={() => navigate('/MyAppointment')}
          className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
        >
          My Appointments
        </button>
        <button
          onClick={() => navigate('/queue')}
          className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
        >
          Track Queue
        </button>
      </nav>

      {/* Right icons */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer">
          <GlobeAltIcon className="w-5 h-5" />
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-teal-300 bg-clip-text outline-none ml-3"
          >
            <option value="en">English</option>
            <option value="ta">தமிழ்</option>
            <option value="si">සිංහල</option>
          </select>
        </div>

        {/* Profile icon navigation */}
        <UserCircleIcon
          className="w-8 h-8 text-[#4CDBB9] cursor-pointer"
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  );
};

export default Nav;
