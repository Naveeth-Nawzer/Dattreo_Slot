// import React, { useState, useEffect } from "react";
// import { Home, ClipboardList, MessageSquare, Settings, LogOut, Clock, QrCode, Search } from "lucide-react";
// import TealWaveBackground from "../Components/TealWaveBackground";
// import { useNavigate } from 'react-router-dom';
// import AttendanceScanner from "./AttendanceScanner";
// import AdminQueue from "./adminqueue";
// import slotConfig from "./slotConfig";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [appointments, setAppointments] = useState([]);
//   const [queue, setQueue] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Check authentication on component mount
//   useEffect(() => {
//     const userData = JSON.parse(localStorage.getItem('userData'));
//     if (!userData || userData.role !== 'admin') {
//       navigate('/SignIn');
//     }
//     fetchAppointments();
//     fetchQueue();
//   }, [navigate]);

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/appointments');
//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     }
//   };

//   const fetchQueue = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/queue');
//       const data = await response.json();
//       setQueue(data);
//     } catch (error) {
//       console.error('Error fetching queue:', error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userData');
//     navigate('/login');
//   };

//   const filteredAppointments = appointments.filter(appt => 
//     appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     appt.id.includes(searchTerm)
//   );

//   return (
//     <>
//       <TealWaveBackground />
//       <div className="flex min-h-screen bg-transparent">
//         {/* Sidebar - Fixed width and height */}
//         <aside className="w-20 bg-gradient-to-b from-teal-50 to-white flex flex-col justify-between py-6 shadow-md rounded-r-2xl sticky top-0 h-screen">
//           <div className="flex flex-col items-center gap-6">
//             <button 
//               onClick={() => setActiveTab('config')}
//               className={`p-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Dashboard"
//             >
//               <Home className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               onClick={() => setActiveTab('scanner')}
//               className={`p-3 rounded-xl ${activeTab === 'scanner' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Scanner"
//             >
//               <QrCode className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               onClick={() => setActiveTab('queue')}
//               className={`p-3 rounded-xl ${activeTab === 'queue' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Queue"
//             >
//               <ClipboardList className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               className="p-3 hover:bg-teal-100 rounded-xl"
//               title="Messages"
//             >
//               <MessageSquare className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               className="p-3 hover:bg-teal-100 rounded-xl"
//               title="Settings"
//             >
//               <Settings className="w-6 h-6 text-teal-700" />
//             </button>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="p-3 hover:bg-teal-100 rounded-xl"
//             title="Logout"
//           >
//             <LogOut className="w-6 h-6 text-teal-700" />
//           </button>
//         </aside>

//         {/* Main content - Flexible width */}
//         <main className="flex-1 p-8 max-w-4xl mx-auto">
//           {/* Header with search */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//             <h1 className="text-2xl font-bold">
//               Admin <span className="font-extrabold">Dashboard</span>
//             </h1>
//             <div className="relative w-full md:w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search patients..."
//                 className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="bg-white rounded-2xl shadow-md p-6 min-h-[70vh]">
//             {activeTab === 'dashboard' && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   {filteredAppointments.slice(0, 2).map((appt) => (
//                     <div
//                       key={appt.id}
//                       className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 relative hover:shadow-md transition-shadow"
//                     >
//                       <span className="absolute top-4 right-4 text-gray-400 font-bold">
//                         #{appt.id}
//                       </span>
//                       <div>
//                         <p className="font-semibold text-teal-700 text-lg">{appt.name}</p>
//                         <p className="text-gray-600">{appt.hospital}</p>
//                         <p className="text-gray-600">{appt.department}</p>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </div>
//                         <Clock className="text-teal-500" />
//                         <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
//                           {appt.time}
//                         </div>
//                       </div>
//                       {appt.status && (
//                         <div className={`absolute top-4 right-12 px-3 py-1 rounded-lg text-sm ${
//                           appt.status === 'Left' ? 'bg-red-500' : 'bg-green-500'
//                         } text-white`}>
//                           {appt.status}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {filteredAppointments.slice(2).map((appt) => (
//                     <div
//                       key={appt.id}
//                       className="border border-gray-100 rounded-xl p-4 relative hover:shadow-md transition-shadow"
//                     >
//                       <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-xl font-bold">
//                         #{appt.id}
//                       </span>
//                       <p className="font-semibold text-teal-700 mt-4">{appt.name}</p>
//                       <p className="text-gray-600 text-sm">{appt.hospital}</p>
//                       <p className="text-gray-600 text-sm">{appt.department}</p>
//                       <div className="mt-3 bg-teal-100 px-3 py-1 rounded-xl font-semibold text-sm">
//                         {new Date(appt.date).toLocaleDateString()} • {appt.time}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {activeTab === 'scanner' && <AttendanceScanner />}
//             {activeTab === 'queue' && <AdminQueue />}
//             {activeTab === 'config' && <slotConfig />}
//           </div>
//         </main>

//         {/* Right panel - Fixed width */}
//         <aside className="w-60 bg-white flex flex-col items-center py-6 space-y-6 sticky top-0 h-screen">
//           <div className="text-center w-full px-4">
//             <h3 className="font-semibold text-gray-700 mb-4">Queue Summary</h3>
//             <div className="bg-teal-50 rounded-xl p-4 mb-4">
//               <p className="text-3xl font-bold text-teal-600">{queue.length}</p>
//               <p className="text-sm text-gray-600">In Queue</p>
//             </div>
//             <div className="bg-green-50 rounded-xl p-4 mb-4">
//               <p className="text-3xl font-bold text-green-600">
//                 {appointments.filter(a => a.status === 'Completed').length}
//               </p>
//               <p className="text-sm text-gray-600">Completed</p>
//             </div>
//             <div className="bg-red-50 rounded-xl p-4">
//               <p className="text-3xl font-bold text-red-600">
//                 {appointments.filter(a => a.status === 'Left').length}
//               </p>
//               <p className="text-sm text-gray-600">Left</p>
//             </div>
//           </div>
          
//           <div className="w-full px-4">
//             <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
//             <button className="w-full bg-teal-500 text-white py-2 rounded-lg mb-2 hover:bg-teal-600 transition-colors">
//               Add New Appointment
//             </button>
//             <button className="w-full bg-white border border-teal-500 text-teal-500 py-2 rounded-lg hover:bg-teal-50 transition-colors">
//               Generate Report
//             </button>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { Home, ClipboardList, MessageSquare, Settings, LogOut, Clock, QrCode, Search } from "lucide-react";
// import TealWaveBackground from "../Components/TealWaveBackground";
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext'; // Add this import
// import AttendanceScanner from "./AttendanceScanner";
// import AdminQueue from "./adminqueue";
// import slotConfig from "./slotConfig";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { token, logout } = useAuth(); // Get auth token and logout function
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [appointments, setAppointments] = useState([]);
//   const [queue, setQueue] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Check authentication on component mount
//   useEffect(() => {
//     if (!token) {
//       navigate('/SignIn');
//       return;
//     }

//     // Verify admin role
//     const verifyAdmin = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/api/auth/verify-admin', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Not authorized');
//         }
        
//         fetchAppointments();
//         fetchQueue();
//       } catch (error) {
//         console.error('Admin verification failed:', error);
//         logout();
//         navigate('/SignIn');
//       }
//     };

//     verifyAdmin();
//   }, [token, navigate, logout]);

//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/appointments', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       setAppointments(data);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       if (error.response?.status === 401) {
//         logout();
//         navigate('/SignIn');
//       }
//     }
//   };

//   const fetchQueue = async () => {
//     try {
//       const response = await fetch('http://localhost:5001/api/queue', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();
//       setQueue(data);
//     } catch (error) {
//       console.error('Error fetching queue:', error);
//       if (error.response?.status === 401) {
//         logout();
//         navigate('/SignIn');
//       }
//     }
//   };

//   const handleLogout = () => {
//     logout(); // Use the logout function from AuthContext
//     navigate('/SignIn');
//   };

//   const filteredAppointments = appointments.filter(appt => 
//     appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     appt.id.includes(searchTerm)
//   );

//   return (
//     <>
//       <TealWaveBackground />
//       <div className="flex min-h-screen bg-transparent">
//         {/* Sidebar - Fixed width and height */}
//         <aside className="w-20 bg-gradient-to-b from-teal-50 to-white flex flex-col justify-between py-6 shadow-md rounded-r-2xl sticky top-0 h-screen">
//           <div className="flex flex-col items-center gap-6">
//             <button 
//               onClick={() => setActiveTab('dashboard')}
//               className={`p-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Dashboard"
//             >
//               <Home className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               onClick={() => setActiveTab('scanner')}
//               className={`p-3 rounded-xl ${activeTab === 'scanner' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Scanner"
//             >
//               <QrCode className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               onClick={() => setActiveTab('queue')}
//               className={`p-3 rounded-xl ${activeTab === 'queue' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
//               title="Queue"
//             >
//               <ClipboardList className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               className="p-3 hover:bg-teal-100 rounded-xl"
//               title="Messages"
//             >
//               <MessageSquare className="w-6 h-6 text-teal-700" />
//             </button>
//             <button 
//               className="p-3 hover:bg-teal-100 rounded-xl"
//               title="Settings"
//             >
//               <Settings className="w-6 h-6 text-teal-700" />
//             </button>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="p-3 hover:bg-teal-100 rounded-xl"
//             title="Logout"
//           >
//             <LogOut className="w-6 h-6 text-teal-700" />
//           </button>
//         </aside>

//         {/* Main content - Flexible width */}
//         <main className="flex-1 p-8 max-w-4xl mx-auto">
//           {/* Header with search */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//             <h1 className="text-2xl font-bold">
//               Admin <span className="font-extrabold">Dashboard</span>
//             </h1>
//             <div className="relative w-full md:w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search patients..."
//                 className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Tab Content */}
//           <div className="bg-white rounded-2xl shadow-md p-6 min-h-[70vh]">
//             {activeTab === 'dashboard' && (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   {filteredAppointments.slice(0, 2).map((appt) => (
//                     <div
//                       key={appt.id}
//                       className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 relative hover:shadow-md transition-shadow"
//                     >
//                       <span className="absolute top-4 right-4 text-gray-400 font-bold">
//                         #{appt.id}
//                       </span>
//                       <div>
//                         <p className="font-semibold text-teal-700 text-lg">{appt.name}</p>
//                         <p className="text-gray-600">{appt.hospital}</p>
//                         <p className="text-gray-600">{appt.department}</p>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
//                           {new Date(appt.date).toLocaleDateString()}
//                         </div>
//                         <Clock className="text-teal-500" />
//                         <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
//                           {appt.time}
//                         </div>
//                       </div>
//                       {appt.status && (
//                         <div className={`absolute top-4 right-12 px-3 py-1 rounded-lg text-sm ${
//                           appt.status === 'Left' ? 'bg-red-500' : 'bg-green-500'
//                         } text-white`}>
//                           {appt.status}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {filteredAppointments.slice(2).map((appt) => (
//                     <div
//                       key={appt.id}
//                       className="border border-gray-100 rounded-xl p-4 relative hover:shadow-md transition-shadow"
//                     >
//                       <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-xl font-bold">
//                         #{appt.id}
//                       </span>
//                       <p className="font-semibold text-teal-700 mt-4">{appt.name}</p>
//                       <p className="text-gray-600 text-sm">{appt.hospital}</p>
//                       <p className="text-gray-600 text-sm">{appt.department}</p>
//                       <div className="mt-3 bg-teal-100 px-3 py-1 rounded-xl font-semibold text-sm">
//                         {new Date(appt.date).toLocaleDateString()} • {appt.time}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {activeTab === 'scanner' && <AttendanceScanner />}
//             {activeTab === 'queue' && <AdminQueue />}
//             {activeTab === 'config' && <slotConfig />}
//           </div>
//         </main>

//         {/* Right panel - Fixed width */}
//         <aside className="w-60 bg-white flex flex-col items-center py-6 space-y-6 sticky top-0 h-screen">
//           <div className="text-center w-full px-4">
//             <h3 className="font-semibold text-gray-700 mb-4">Queue Summary</h3>
//             <div className="bg-teal-50 rounded-xl p-4 mb-4">
//               <p className="text-3xl font-bold text-teal-600">{queue.length}</p>
//               <p className="text-sm text-gray-600">In Queue</p>
//             </div>
//             <div className="bg-green-50 rounded-xl p-4 mb-4">
//               <p className="text-3xl font-bold text-green-600">
//                 {appointments.filter(a => a.status === 'Completed').length}
//               </p>
//               <p className="text-sm text-gray-600">Completed</p>
//             </div>
//             <div className="bg-red-50 rounded-xl p-4">
//               <p className="text-3xl font-bold text-red-600">
//                 {appointments.filter(a => a.status === 'Left').length}
//               </p>
//               <p className="text-sm text-gray-600">Left</p>
//             </div>
//           </div>
          
//           <div className="w-full px-4">
//             <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
//             <button className="w-full bg-teal-500 text-white py-2 rounded-lg mb-2 hover:bg-teal-600 transition-colors">
//               Add New Appointment
//             </button>
//             <button className="w-full bg-white border border-teal-500 text-teal-500 py-2 rounded-lg hover:bg-teal-50 transition-colors">
//               Generate Report
//             </button>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { Home, ClipboardList, MessageSquare, Settings, LogOut, Clock, QrCode, Search } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AttendanceScanner from "./AttendanceScanner";
import AdminQueue from "./adminqueue";
import slotConfig from "./slotConfig";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth(); // Get user data from AuthContext
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication and admin status on component mount
  useEffect(() => {
    if (!token) {
      navigate('/SignIn');
      return;
    }

    // Verify admin role from user data
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
      console.error('Not authorized - User is not admin');
      logout();
      navigate('/SignIn');
      return;
    }

    // If admin, fetch data
    // fetchAppointments();
    // fetchQueue();
  }, [token, user, navigate, logout]);

  // const fetchAppointments = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5001/api/appointments', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch appointments');
  //     }
      
  //     const data = await response.json();
  //     setAppointments(data);
  //   } catch (error) {
  //     console.error('Error fetching appointments:', error);
  //     if (error.response?.status === 401) {
  //       logout();
  //       navigate('/SignIn');
  //     }
  //   }
  // };

  // const fetchQueue = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5001/api/queue', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch queue');
  //     }
      
  //     const data = await response.json();
  //     setQueue(data);
  //   } catch (error) {
  //     console.error('Error fetching queue:', error);
  //     if (error.response?.status === 401) {
  //       logout();
  //       navigate('/SignIn');
  //     }
  //   }
  // };

  const handleLogout = () => {
    logout();
    navigate('/SignIn');
  };

  const filteredAppointments = appointments.filter(appt => 
    appt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.id.includes(searchTerm)
  );

  return (
    <>
      <TealWaveBackground />
      <div className="flex min-h-screen bg-transparent">
        {/* Sidebar - Fixed width and height */}
        <aside className="w-20 bg-gradient-to-b from-teal-50 to-white flex flex-col justify-between py-6 shadow-md rounded-r-2xl sticky top-0 h-screen">
          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`p-3 rounded-xl ${activeTab === 'dashboard' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
              title="Dashboard"
            >
              <Home className="w-6 h-6 text-teal-700" />
            </button>
            <button 
              onClick={() => setActiveTab('scanner')}
              className={`p-3 rounded-xl ${activeTab === 'scanner' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
              title="Scanner"
            >
              <QrCode className="w-6 h-6 text-teal-700" />
            </button>
            <button 
              onClick={() => setActiveTab('queue')}
              className={`p-3 rounded-xl ${activeTab === 'queue' ? 'bg-teal-100' : 'hover:bg-teal-100'}`}
              title="Queue"
            >
              <ClipboardList className="w-6 h-6 text-teal-700" />
            </button>
            <button 
              className="p-3 hover:bg-teal-100 rounded-xl"
              title="Messages"
            >
              <MessageSquare className="w-6 h-6 text-teal-700" />
            </button>
            <button 
              className="p-3 hover:bg-teal-100 rounded-xl"
              title="Settings"
            >
              <Settings className="w-6 h-6 text-teal-700" />
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className="p-3 hover:bg-teal-100 rounded-xl"
            title="Logout"
          >
            <LogOut className="w-6 h-6 text-teal-700" />
          </button>
        </aside>

        {/* Main content - Flexible width */}
        <main className="flex-1 p-8 max-w-4xl mx-auto">
          {/* Header with search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">
              Admin <span className="font-extrabold">Dashboard</span>
            </h1>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-md p-6 min-h-[70vh]">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {filteredAppointments.slice(0, 2).map((appt) => (
                    <div
                      key={appt.id}
                      className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 relative hover:shadow-md transition-shadow"
                    >
                      <span className="absolute top-4 right-4 text-gray-400 font-bold">
                        #{appt.id}
                      </span>
                      <div>
                        <p className="font-semibold text-teal-700 text-lg">{appt.name}</p>
                        <p className="text-gray-600">{appt.hospital}</p>
                        <p className="text-gray-600">{appt.department}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
                          {new Date(appt.date).toLocaleDateString()}
                        </div>
                        <Clock className="text-teal-500" />
                        <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
                          {appt.time}
                        </div>
                      </div>
                      {appt.status && (
                        <div className={`absolute top-4 right-12 px-3 py-1 rounded-lg text-sm ${
                          appt.status === 'Left' ? 'bg-red-500' : 'bg-green-500'
                        } text-white`}>
                          {appt.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAppointments.slice(2).map((appt) => (
                    <div
                      key={appt.id}
                      className="border border-gray-100 rounded-xl p-4 relative hover:shadow-md transition-shadow"
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-xl font-bold">
                        #{appt.id}
                      </span>
                      <p className="font-semibold text-teal-700 mt-4">{appt.name}</p>
                      <p className="text-gray-600 text-sm">{appt.hospital}</p>
                      <p className="text-gray-600 text-sm">{appt.department}</p>
                      <div className="mt-3 bg-teal-100 px-3 py-1 rounded-xl font-semibold text-sm">
                        {new Date(appt.date).toLocaleDateString()} • {appt.time}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'scanner' && <AttendanceScanner />}
            {activeTab === 'queue' && <AdminQueue />}
            {activeTab === 'config' && <slotConfig />}
          </div>
        </main>

        {/* Right panel - Fixed width */}
        <aside className="w-60 bg-white flex flex-col items-center py-6 space-y-6 sticky top-0 h-screen">
          <div className="text-center w-full px-4">
            <h3 className="font-semibold text-gray-700 mb-4">Queue Summary</h3>
            <div className="bg-teal-50 rounded-xl p-4 mb-4">
              <p className="text-3xl font-bold text-teal-600">{queue.length}</p>
              <p className="text-sm text-gray-600">In Queue</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <p className="text-3xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'Completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-red-600">
                {appointments.filter(a => a.status === 'Left').length}
              </p>
              <p className="text-sm text-gray-600">Left</p>
            </div>
          </div>
          
          <div className="w-full px-4">
            <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <button className="w-full bg-teal-500 text-white py-2 rounded-lg mb-2 hover:bg-teal-600 transition-colors">
              Add New Appointment
            </button>
            <button className="w-full bg-white border border-teal-500 text-teal-500 py-2 rounded-lg hover:bg-teal-50 transition-colors">
              Generate Report
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}