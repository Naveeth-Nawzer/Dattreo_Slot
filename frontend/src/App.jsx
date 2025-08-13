import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TrackQueue from './BookingComponents/TrackQueue'
import BookingAppointment from './BookingComponents/BookingAppointment'
import MyAppointment from './BookingComponents/MyAppointment'
import Finder from './Admin/Finder'
import Profile from './UserProfile/Profile'
import LanguageSelection from './UserProfile/LanguageSelection'
import Firstvist from './UserProfile/Firstvist'
import Register from './BookingComponents/Register'

import Home from './Home'
import OnboardingPage from './OnboardingPage'
import OnboardingPage2 from './OnboardingPage2'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Admin/Dashboard'
import AdminNotifications from './Admin/AdminNotification'
import Signup from './pages/Signup'
import SlotConfig from './Admin/SlotConfig';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter> 
    <Routes>    
    <Route path='/' element={<TrackQueue />} />
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

    
    <Route path='/home' element={<Home />} />
    <Route path='/OnboardingPage' element={<OnboardingPage />} />
    <Route path='/OnboardingPage2' element={<OnboardingPage2 />} />


    </Routes> </BrowserRouter>
    </>
  )
}

export default App
