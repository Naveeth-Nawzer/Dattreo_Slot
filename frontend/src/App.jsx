import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TrackQueue from './BookingComponents/TrackQueue'
import Profile from './UserProfile/Profile'
import LanguageSelection from './UserProfile/LanguageSelection'
import Firstvist from './UserProfile/Firstvist'
import Register from './BookingComponents/Register'

import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

    </Routes> </BrowserRouter>
    </>
  )
}

export default App
