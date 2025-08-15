import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import peopleImage from "./assets/people.png";
import Nav from './Components/Nav';
import TealWaveBackground from './Components/TealWaveBackground';

function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-transparent font-sans relative">
      {/* Background SVGs */}
      <TealWaveBackground />

      {/* Header */}
      <Nav />

      {/* Body */}
      <main className="flex flex-col md:flex-row items-start justify-between px-8 py-12 relative z-10">
        {/* Left Content */}
        <div className="max-w-xl text-left">
          <h1 className="text-6xl font-bold leading-tight">
            {t('welcome')} <br />
            <span className="text-[#4CDBB9]">{t('name')}</span>
          </h1>
          <p className="mt-4 text-gray-600">
            {t('subtitle')}
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <button
              onClick={() => navigate('/queue')}
              className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
            >
              {t('bookAppointments')}
            </button>

            <button
              onClick={() => navigate('/MyAppointment')}
              className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
            >
              {t('myAppointment')}
            </button>

            <button
              onClick={() => navigate('/queue')}
              className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
            >
              {t('trackQueue')}
            </button>

            <button
              onClick={() => navigate('/qr')}
              className="bg-[#4CDBB9] text-white font-semibold h-[120px] w-[250px] shadow hover:bg-[#0A8F70] flex items-end text-left justify-start p-4 whitespace-pre-line"
            >
              {t('qrCode')}
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-12 md:mt-0">
          <img
            src={peopleImage}
            alt="Queue"
            className="w-[550px] object-contain"
          />
        </div>
      </main>
    </div>
  );
}

export default Home;
