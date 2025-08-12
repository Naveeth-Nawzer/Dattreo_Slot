import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TrackQueue from './BookingComponents/TrackQueue'
import BookingAppointment from './BookingComponents/BookingAppointment'
import MyAppointment from './BookingComponents/MyAppointment'
import Finder from './Admin/Finder'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { User } from "lucide-react";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter> <Routes>    
    <Route path='/' element={<TrackQueue />} />
    <Route path='/BookingAppointment' element={<BookingAppointment />} />
    <Route path='/MyAppointment' element={<MyAppointment />} />
    <Route path='/Finder' element={<Finder />} />
    
    
    </Routes> </BrowserRouter>
    </>
  )
}

export default App
