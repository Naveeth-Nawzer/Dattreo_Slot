import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrackQueue from './BookingComponents/TrackQueue'
import Profile from './UserProfile/Profile'
import LanguageSelection from './UserProfile/LanguageSelection'
import Firstvist from './UserProfile/Firstvist'
import Register from './BookingComponents/Register'
import SignIn from './UserProfile/SignIn'
import Home from './Home'
import OnboardingPage from './OnboardingPage'
import OnboardingPage2 from './OnboardingPage2'
import BookingAppointment from './BookingComponents/BookingAppointment'
import MyAppointment from './BookingComponents/MyAppointment'
import Finder from './Admin/Finder'
import SlotConfig from './Admin/SlotConfig';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter> <Routes>    
    <Route path='/' element={<TrackQueue />} />
    <Route path='/profile' element={<Profile/>} />
    <Route path='/LanguageSelection' element={<LanguageSelection/>} />
    <Route path='/Firstvist' element={<Firstvist/>} />
    <Route path='/Register' element={<Register/>} />
    <Route path='/SignIn' element={<SignIn />}/>
    <Route path='/BookingAppointment' element={<BookingAppointment />} />
    <Route path='/MyAppointment' element={<MyAppointment />} />
    <Route path='/Finder' element={<Finder />} />
    <Route path='/SlotConfig' element={<SlotConfig />} />
    
    <Route path='/home' element={<Home />} />
    <Route path='/OnboardingPage' element={<OnboardingPage />} />
    <Route path='/OnboardingPage2' element={<OnboardingPage2 />} />


    </Routes> </BrowserRouter>
    </>
  )
}

export default App
