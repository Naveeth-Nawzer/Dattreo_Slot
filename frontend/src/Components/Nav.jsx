// import React, { useState } from 'react';
// import slot from "../assets/slot.png";
// import { GlobeAltIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

// const Nav = () => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const changeLanguage = (lng) => {
//     i18n.changeLanguage(lng);
//   };

//   return (
//     <div>
//       <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10">
//         {/* Logo */}
//         <div className="flex items-center space-x-2">
//           <img
//             src={slot}
//             alt="logo image"
//             className="w-24 md:w-[150px] object-contain"
//           />
//         </div>

//         {/* Mobile menu button */}
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="text-gray-700 hover:text-[#4CDBB9] focus:outline-none"
//           >
//             {mobileMenuOpen ? (
//               <XMarkIcon className="w-8 h-8" />
//             ) : (
//               <Bars3Icon className="w-8 h-8" />
//             )}
//           </button>
//         </div>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex space-x-6 lg:space-x-8 text-black font-medium">
//           <a href="/home" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
//             HOME
//           </a>
//           <a href="/queue" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
//             Book Appointment
//           </a>
//           <a href="/MyAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
//             My Appointments
//           </a>
//           <a href="/queue" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors">
//             Track Queue
//           </a>
//         </nav>

//         {/* Right icons */}
//         <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
//           <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer text-sm lg:text-base">
//             <GlobeAltIcon className="w-4 lg:w-5 h-4 lg:h-5" />
//             <select
//               value={i18n.language}
//               onChange={(e) => changeLanguage(e.target.value)}
//               className="bg-teal-300 bg-clip-text outline-none ml-2 lg:ml-3 text-xs lg:text-sm"
//             >
//               <option value="en">English</option>
//               <option value="ta">தமிழ்</option>
//               <option value="si">සිංහල</option>
//             </select>
//           </div>

//           <div className='cursor-pointer'
//                 onClick={() => navigate("/profile")}>
//             <UserCircleIcon className="w-7 lg:w-8 h-7 lg:h-8 text-[#4CDBB9]" />
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden absolute top-full left-0 right-0 bg-[#F7FBFB] shadow-lg rounded-b-2xl px-4 py-2">
//             <nav className="flex flex-col space-y-4 text-black font-medium">
//               <a href="/home" className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
//                 HOME
//               </a>
//               <a href="/BookingAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
//                 Book Appointment
//               </a>
//               <a href="/MyAppointment" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
//                 My Appointments
//               </a>
//               <a href="/TrackQueue" className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2">
//                 Track Queue
//               </a>
//             </nav>
//             <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
//               <div className="flex items-center bg-[#4CDBB9] text-white px-3 py-1 rounded-full cursor-pointer">
//                 <GlobeAltIcon className="w-5 h-5" />
//                 <select
//                   value={i18n.language}
//                   onChange={(e) => changeLanguage(e.target.value)} 
//                   className="bg-teal-300 bg-clip-text outline-none ml-2">
//                   <option value="en">English</option>
//                   <option value="ta">தமிழ்</option>
//                   <option value="si">සිංහල</option>
//                 </select>
//               </div>

//               <div className='cursor-pointer'
//               onClick={() => navigate("/profile")}>
//                 <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]"/>
//               </div>
//             </div>
//           </div>
//         )}
//       </header>
//     </div>
//   );
// };

// export default Nav;


import React, { useState } from 'react';
import slot from "../assets/slot.png";
import { GlobeAltIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Add this import

const Nav = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout } = useAuth(); // Get auth status and logout function

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleProfileClick = () => {
    if (!token) {
      navigate('/SignIn', { state: { from: location } });
    } else {
      navigate('/profile');
    }
  };

  const handleNavClick = (path) => {
    if (!token && path !== '/home') {
      navigate('/SignIn', { state: { from: location } });
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-[#F7FBFB] rounded-b-3xl relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={slot}
            alt="logo image"
            className="w-24 md:w-[150px] object-contain"
            onClick={() => navigate('/home')}
            style={{ cursor: 'pointer' }}
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
          <a 
            href="/home" 
            className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
            onClick={(e) => { e.preventDefault(); navigate('/home'); }}
          >
            HOME
          </a>
          <a 
            href="/BookingAppointment" 
            className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
            onClick={(e) => { e.preventDefault(); handleNavClick('/BookingAppointment'); }}
          >
            Book Appointment
          </a>
          <a 
            href="/MyAppointment" 
            className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
            onClick={(e) => { e.preventDefault(); handleNavClick('/MyAppointment'); }}
          >
            My Appointments
          </a>
          <a 
            href="/queue" 
            className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors"
            onClick={(e) => { e.preventDefault(); handleNavClick('/queue'); }}
          >
            Track Queue
          </a>
        </nav>

        {/* Right icons */}
        <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
          <div className="flex items-center bg-[#4CDBB9] text-white px-2 py-1 rounded-full cursor-pointer text-sm lg:text-base">
            <GlobeAltIcon className="w-4 lg:w-5 h-4 lg:h-5" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-teal-300 bg-clip-text outline-none ml-2 lg:ml-3 text-xs lg:text-sm"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="si">සිංහල</option>
            </select>
          </div>

          {token ? (
            <div className="flex items-center space-x-4">
              <div className='cursor-pointer' onClick={handleProfileClick}>
                <UserCircleIcon className="w-7 lg:w-8 h-7 lg:h-8 text-[#4CDBB9]" />
              </div>
              <button 
                onClick={logout}
                className="text-sm text-gray-600 hover:text-[#4CDBB9]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='cursor-pointer' onClick={handleProfileClick}>
              <UserCircleIcon className="w-7 lg:w-8 h-7 lg:h-8 text-[#4CDBB9]" />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#F7FBFB] shadow-lg rounded-b-2xl px-4 py-2">
            <nav className="flex flex-col space-y-4 text-black font-medium">
              <a 
                href="/home" 
                className="cursor-pointer bg-gradient-to-r from-[#4CDBB9] to-[#0A8F70] bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2"
                onClick={(e) => { e.preventDefault(); navigate('/home'); }}
              >
                HOME
              </a>
              <a 
                href="/BookingAppointment" 
                className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2"
                onClick={(e) => { e.preventDefault(); handleNavClick('/BookingAppointment'); }}
              >
                Book Appointment
              </a>
              <a 
                href="/MyAppointment" 
                className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2"
                onClick={(e) => { e.preventDefault(); handleNavClick('/MyAppointment'); }}
              >
                My Appointments
              </a>
              <a 
                href="/queue" 
                className="cursor-pointer bg-gradient-to-r from-black to-black bg-clip-text text-transparent hover:from-[#4CDBB9] hover:to-[#0A8F70] transition-colors py-2"
                onClick={(e) => { e.preventDefault(); handleNavClick('/queue'); }}
              >
                Track Queue
              </a>
            </nav>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center bg-[#4CDBB9] text-white px-3 py-1 rounded-full cursor-pointer">
                <GlobeAltIcon className="w-5 h-5" />
                <select
                  value={i18n.language}
                  onChange={(e) => changeLanguage(e.target.value)} 
                  className="bg-teal-300 bg-clip-text outline-none ml-2">
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                  <option value="si">සිංහල</option>
                </select>
              </div>

              {token ? (
                <div className="flex items-center space-x-4">
                  <div className='cursor-pointer' onClick={handleProfileClick}>
                    <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]"/>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-[#4CDBB9]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className='cursor-pointer' onClick={handleProfileClick}>
                  <UserCircleIcon className="w-8 h-8 text-[#4CDBB9]"/>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Nav;