import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import TrackQueue from './BookingComponents/TrackQueue';
import Profile from './UserProfile/Profile';
import LanguageSelection from './UserProfile/LanguageSelection';
import Firstvist from './UserProfile/Firstvist';
import Register from './BookingComponents/Register';
import AdminDashboard from './Admin/admin';
import PredefinedNotifications from './Admin/adminmessage';
import Adminqueue from './Admin/adminqueue';
import AdminSettings from './Admin/adminform.jsx';
import AdminLogout from './Admin/logout.jsx';


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TrackQueue />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/LanguageSelection' element={<LanguageSelection />} />
        <Route path='/Firstvist' element={<Firstvist />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/adminmessage' element={<PredefinedNotifications />} />
        <Route path='/adminqueue' element={<Adminqueue />} />
        <Route path='/adminsettings' element={<AdminSettings />} />
        <Route path='/adminlogout' element={<AdminLogout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
