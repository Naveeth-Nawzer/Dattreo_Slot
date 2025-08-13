import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TrackQueue from './BookingComponents/TrackQueue'
import Home from './Home'
import OnboardingPage from './OnboardingPage'
import OnboardingPage2 from './OnboardingPage2'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter> <Routes>    
    <Route path='/' element={<TrackQueue />} />
    <Route path='/home' element={<Home />} />
    <Route path='/OnboardingPage' element={<OnboardingPage />} />
    <Route path='/OnboardingPage2' element={<OnboardingPage2 />} />


    </Routes> </BrowserRouter>
    </>
  )
}

export default App
