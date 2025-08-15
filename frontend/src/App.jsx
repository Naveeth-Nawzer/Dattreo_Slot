import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import TrackQueue from './BookingComponents/TrackQueue';
import BookingAppointment from './BookingComponents/BookingAppointment';
import MyAppointment from './BookingComponents/MyAppointment';
import Finder from './Admin/Finder';
import Profile from './UserProfile/Profile';
import LanguageSelection from './UserProfile/LanguageSelection';
import Firstvist from './UserProfile/Firstvist';
import Register from './BookingComponents/Register';
import SignIn from './UserProfile/SignIn';
import Home from './Home';
import OnboardingPage from './OnboardingPage';
import OnboardingPage2 from './OnboardingPage2';
import Dashboard from './Admin/Dashboard';
import AdminNotifications from './Admin/AdminNotification';
import Signup from './pages/Signup';
import SlotConfig from './Admin/SlotConfig';
import i18n from './i18n';
import AttendanceScanner from './Admin/AttendanceScanner'
import QRCodePage from './pages/QRCodePage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Routes>
          <Route path='/queue' element={<TrackQueue />} />
          <Route path='/admin' element={<Dashboard />} />  
          <Route path='/adminnotifications' element={<AdminNotifications />} />  
          <Route path='/signup' element={<Signup />} />
          <Route path='/BookingAppointment' element={<BookingAppointment />} />
          <Route path='/MyAppointment' element={<MyAppointment />} />
          <Route path='/Finder' element={<Finder />} />
          <Route path='/SlotConfig' element={<SlotConfig />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/LanguageSelection' element={<LanguageSelection/>} />
          <Route path='/Firstvist' element={<Firstvist/>} />
          <Route path='/Register' element={<Register/>} />
          <Route path='/SignIn' element={<SignIn />}/>
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<OnboardingPage />} />
          <Route path='/OnboardingPage2' element={<OnboardingPage2 />} />
          <Route path='/AttendanceScanner' element={<AttendanceScanner />} />
          <Route path='/qr' element={<QRCodePage />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;