import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TrackQueue from './BookingComponents/TrackQueue'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Admin/Dashboard'
import AdminNotifications from './Admin/AdminNotification'
import Signup from './pages/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter> <Routes>    
    <Route path='/' element={<TrackQueue />} />
    <Route path='/admin' element={<Dashboard />} />  
    <Route path='/adminnotifications' element={<AdminNotifications />} />  
    <Route path='/signup' element={<Signup />} />
    
    </Routes> </BrowserRouter>
    </>
  )
}

export default App
