// import axios from 'axios';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { User } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { useTranslation } from 'react-i18next';
// import Nav from '../Components/Nav';
// import TealWaveBackground from "../Components/TealWaveBackground";
// import BrushTealWaves from '../Components/BrushTealWaves';
// import PageNavigator from "../Components/PageNavigator";
// import { useAuth } from '../AuthContext';


// // Constants
// const BACKEND_URL = 'http://localhost:5001/api';
// const REFRESH_INTERVAL = 10000; // 10 seconds
// const ESTIMATED_TIME_PER_SLOT = 5; // minutes
// const SLOT_STATUS = {
//   AVAILABLE: 'available',
//   BOOKED: 'booked',
//   SERVING: 'serving'
// };

// const TrackQueue = ({ userId }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { token, user } = useAuth();
  



//   const params = new URLSearchParams(location.search);
//   const userIdFromQuery = params.get('userId');
//   const slotIdFromQuery = params.get('slotId');
//   const effectiveUserId = userIdFromQuery ? parseInt(userIdFromQuery, 10) : userId;
//   const [slots, setSlots] = useState([]);
//   const [filteredSlots, setFilteredSlots] = useState([]);
//   const [currentServing, setCurrentServing] = useState(null);
//   const [userPosition, setUserPosition] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalSpots, setTotalSpots] = useState(0);
//   const [locations, setLocations] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const optimisticAppliedRef = useRef(false);

//   const routesOrder = [
//     "/home", 
//     "/TrackQueue",
//     "/home",
//   ];

//   const fetchQueue = useCallback(async (signal) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(`${BACKEND_URL}/slotsconfig/allSlot`, {
//         signal,
//         headers: { 
//           'Cache-Control': 'no-cache',
//           'Content-Type': 'application/json'
//         },
//         params: { ts: Date.now() }
//       });
      
//       if (!response.data.success) {
//         throw new Error(response.data.message || t('common.apiError.loadQueueFailed'));
//       }
  
//       const slotsData = (response.data.data || []).map(slot => ({
//         id: slot.id,
//         slot_number: slot.slot_number ?? 0,
//         status: (slot.status || '').toLowerCase(),
//         user_id: slot.user_id ?? null,
//         slot_location: slot.slot_location || 'Main Office',
//         patient_department: slot.patient_department || ''
//       }));
      
//       setSlots(slotsData);
      
      
//       // Extract unique locations and departments from slots
//       const uniqueLocations = [...new Set(slotsData.map(slot => slot.slot_location || 'Main Office'))];
//       setLocations(uniqueLocations);
      
//       const uniqueDepartments = [...new Set(slotsData.map(slot => slot.patient_department || '').filter(Boolean))];
//       setDepartments(uniqueDepartments);
      
//       // Apply filters to the new data
//       applyFilters(slotsData, selectedLocation, selectedDepartment);

//       const serving = slotsData.find(slot => (slot.status || '').toLowerCase() === 'serving');
//       setCurrentServing(serving ? serving.slot_number : null);

//       if (effectiveUserId) {
//         const userSlot = slotsData.find(slot => slot.user_id === effectiveUserId);
//         if (userSlot) {
//           const bookedSlots = slotsData.filter(slot => 
//             ['booked', 'serving'].includes((slot.status || '').toLowerCase())
//           );
//           const position = bookedSlots.findIndex(slot => slot.id === userSlot.id);
//           setUserPosition(position >= 0 ? position + 1 : null);
//         } else {
//           setUserPosition(null);
//         }
//       }
  
//     } catch (err) {
//       if (!axios.isCancel(err)) {
//         console.error('Failed to fetch queue:', err);
//         setError(`${t('common.apiError.title')}: ${err.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [effectiveUserId, t, selectedLocation, selectedDepartment]);

//   const applyFilters = (slotsData, locationFilter, departmentFilter) => {
//     let filtered = slotsData;
    
//     if (locationFilter) {
//       filtered = filtered.filter(slot => slot.slot_location === locationFilter);
//     }
    
//     if (departmentFilter) {
//       filtered = filtered.filter(slot => slot.patient_department === departmentFilter);
//     }
    
//     setFilteredSlots(filtered);
//     setTotalSpots(filtered.length);
//   };

//   const handleLocationChange = (e) => {
//     const newLocation = e.target.value;
//     setSelectedLocation(newLocation);
//     applyFilters(slots, newLocation, selectedDepartment);
//   };

//   const handleDepartmentChange = (e) => {
//     const newDepartment = e.target.value;
//     setSelectedDepartment(newDepartment);
//     applyFilters(slots, selectedLocation, newDepartment);
//   };

//   const resetFilters = () => {
//     setSelectedLocation('');
//     setSelectedDepartment('');
//     setFilteredSlots(slots);
//     setTotalSpots(slots.length);
//   };

//   useEffect(() => {

    

//     const abortController = new AbortController();
//     fetchQueue(abortController.signal);


    
    
//     const interval = setInterval(() => {
//       fetchQueue(abortController.signal);
//     }, REFRESH_INTERVAL);
    
//     return () => {
//       abortController.abort();
//       clearInterval(interval);
//     };
//   }, [fetchQueue]);

//   useEffect(() => {
//     if (slotIdFromQuery) {
//       fetchQueue();
//     }
//   }, [slotIdFromQuery, fetchQueue]);

//   useEffect(() => {

    
//     if (!slotIdFromQuery || !effectiveUserId || optimisticAppliedRef.current) return;
    
//     const idNum = parseInt(slotIdFromQuery, 10);
//     if (!Number.isFinite(idNum)) return;
//     if (slots.length === 0) return;

//     const target = slots.find(s => s.id === idNum);
//     if (!target) return;
    
//     const statusLower = (target.status || '').toLowerCase();
//     if (statusLower === SLOT_STATUS.BOOKED) {
//       optimisticAppliedRef.current = true;
//       return;
//     }

//     setSlots(prev => prev.map(s => 
//       s.id === idNum 
//         ? { ...s, status: SLOT_STATUS.BOOKED, user_id: effectiveUserId } 
//         : s
//     ));
//     optimisticAppliedRef.current = true;
//   }, [slotIdFromQuery, effectiveUserId, slots]);

//   const goToBooking = (slotId) => {
//     navigate(`/BookingAppointment?slotId=${slotId}`);
//   };

//   const calculateWaitTime = useCallback(() => {
//     if (userPosition === null || currentServing === null) return t('queue.waitTime.unknown');
//     const position = userPosition - (currentServing || 0);
//     if (position <= 0) return t('queue.waitTime.now');
//     return `~${position * ESTIMATED_TIME_PER_SLOT} ${t('queue.waitTime.min')}`;
//   }, [userPosition, currentServing, t]);

//   const handleRetry = useCallback(async () => {
//     setLoading(true);
//     await fetchQueue();
//   }, [fetchQueue]);

//   if (loading && slots.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">{t('common.loading')}</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
//           <div className="text-red-500 mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.error.title')}</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={handleRetry}
//             className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             {t('common.error.retry')}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <PageNavigator routesOrder={routesOrder}/>
//       <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
//         <Nav showLanguageSelector={true} />
        
//         <TealWaveBackground/>
//         <BrushTealWaves/>
//         <main className="flex-1 py-10 px-4 sm:px-6">
//           <div className="max-w-5xl mx-auto">
//             <div className="bg-white rounded-xl shadow-md p-6 mb-10">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//                 <div>
//                   <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.yourPosition')}</p>
//                   <p className="text-3xl font-bold text-gray-800">
//                     {userPosition !== null ? userPosition : t('queue.notInQueue')}
//                     {userPosition !== null && <span className="text-gray-400 text-lg">/{totalSpots}</span>}
//                   </p>
//                 </div>
    
//                 <div>
//                   <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.currentlyServing')}</p>
//                   <p className="text-3xl font-bold text-teal-600">
//                     {currentServing !== null ? currentServing + 1 : t('queue.none')}
//                   </p>
//                 </div>
    
//                 <div>
//                   <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.estimatedWait')}</p>
//                   <p className="text-3xl font-bold text-gray-800">
//                     {userPosition !== null ? calculateWaitTime() : 'N/A'}
//                   </p>
//                 </div>
//               </div>
//             </div>
    
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h3 className="text-xl font-semibold text-gray-800">{t('queue.queuePositions')}</h3>
                
//                 <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                   <div className="flex items-center w-full sm:w-auto">
//                     <label htmlFor="location-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
//                       {t('queue.filterByLocation')}:
//                     </label>
//                     <select
//                       id="location-filter"
//                       value={selectedLocation}
//                       onChange={handleLocationChange}
//                       className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
//                     >
//                       <option value="">{t('queue.selectLocation')}</option>
//                       {locations.map((location) => (
//                         <option key={location} value={location}>
//                           {location}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex items-center w-full sm:w-auto">
//                     <label htmlFor="department-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
//                       {t('queue.filterByDepartment')}:
//                     </label>
//                     <select
//                       id="department-filter"
//                       value={selectedDepartment}
//                       onChange={handleDepartmentChange}
//                       className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
//                     >
//                       <option value="">{t('queue.selectDepartment')}</option>
//                       {departments.map((department) => (
//                         <option key={department} value={department}>
//                           {department}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {(selectedLocation || selectedDepartment) && (
//                     <button
//                       onClick={resetFilters}
//                       className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
//                     >
//                       {t('queue.resetFilters')}
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
//                 {filteredSlots.map((slot) => {
//                   let spotClass = "bg-gray-200";
//                   let iconClass = "text-gray-500";
//                   const slotStatus = (slot.status || '').toLowerCase();

//                   if (effectiveUserId && slot.user_id === effectiveUserId) {
//                     spotClass = "bg-yellow-100 border-2 border-yellow-400";
//                     iconClass = "text-yellow-600";
//                   } else if (slotStatus === SLOT_STATUS.SERVING) {
//                     spotClass = "bg-teal-100 border-2 border-teal-400";
//                     iconClass = "text-teal-600";
//                   } else if (slotStatus === SLOT_STATUS.BOOKED) {
//                     spotClass = "bg-red-100";
//                     iconClass = "text-red-600";
//                   }

//                   return (
//                     <button
//                       key={slot.id}
//                       className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass}`}
//                       aria-label={`${t('queue.position')} ${slot.slot_number + 1} - ${slotStatus}`}
//                       onClick={() => slotStatus === SLOT_STATUS.AVAILABLE && goToBooking(slot.id)}
//                       disabled={slotStatus !== SLOT_STATUS.AVAILABLE}
//                       aria-disabled={slotStatus !== SLOT_STATUS.AVAILABLE}
//                     >
//                       <User size={18} className={iconClass} />
//                     </button>
//                   );
//                 })}
//               </div>
    
//               <div className="mt-8 flex flex-wrap gap-4 text-sm select-none">
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
//                   <span className="text-gray-600">{t('queue.currentlyServing')}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
//                   <span className="text-gray-600">{t('queue.yourPosition')}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
//                   <span className="text-gray-600">{t('queue.bookedByOthers')}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
//                   <span className="text-gray-600">{t('queue.available')}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// TrackQueue.propTypes = {
//   userId: PropTypes.number,
// };

// export default TrackQueue;


import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Nav from '../Components/Nav';
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves';
import PageNavigator from "../Components/PageNavigator";
import { useAuth } from '../AuthContext.jsx';

// Constants
const BACKEND_URL = 'http://localhost:5001/api';
const REFRESH_INTERVAL = 10000; // 10 seconds
const ESTIMATED_TIME_PER_SLOT = 5; // minutes
const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  SERVING: 'serving'
};

const TrackQueue = ({ userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();
  const params = new URLSearchParams(location.search);
  const userIdFromQuery = params.get('userId');
  const slotIdFromQuery = params.get('slotId');
  const effectiveUserId = userIdFromQuery ? parseInt(userIdFromQuery, 10) : user?.id || userId;
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpots, setTotalSpots] = useState(0);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const optimisticAppliedRef = useRef(false);

  const routesOrder = [
    "/home", 
    "/TrackQueue",
    "/home",
  ];

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate('/SignIn', { state: { from: location } });
    }
  }, [token, navigate, location]);

  const fetchQueue = useCallback(async (signal) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${BACKEND_URL}/slotsconfig/allSlot`, {
        signal,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        },
        params: { ts: Date.now() }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || t('common.apiError.loadQueueFailed'));
      }
  
      const slotsData = (response.data.data || []).map(slot => ({
        id: slot.id,
        slot_number: slot.slot_number ?? 0,
        status: (slot.status || '').toLowerCase(),
        user_id: slot.user_id ?? null,
        slot_location: slot.slot_location || 'Main Office',
        patient_department: slot.patient_department || ''
      }));
      
      setSlots(slotsData);
      
      // Extract unique locations and departments from slots
      const uniqueLocations = [...new Set(slotsData.map(slot => slot.slot_location || 'Main Office'))];
      setLocations(uniqueLocations);
      
      const uniqueDepartments = [...new Set(slotsData.map(slot => slot.patient_department || '').filter(Boolean))];
      setDepartments(uniqueDepartments);
      
      // Apply filters to the new data
      applyFilters(slotsData, selectedLocation, selectedDepartment);

      const serving = slotsData.find(slot => (slot.status || '').toLowerCase() === 'serving');
      setCurrentServing(serving ? serving.slot_number : null);

      if (effectiveUserId) {
        const userSlot = slotsData.find(slot => slot.user_id === effectiveUserId);
        if (userSlot) {
          const bookedSlots = slotsData.filter(slot => 
            ['booked', 'serving'].includes((slot.status || '').toLowerCase())
          );
          const position = bookedSlots.findIndex(slot => slot.id === userSlot.id);
          setUserPosition(position >= 0 ? position + 1 : null);
        } else {
          setUserPosition(null);
        }
      }
  
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Failed to fetch queue:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError(`${t('common.apiError.title')}: ${err.message}`);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, t, selectedLocation, selectedDepartment, token, navigate]);

  const applyFilters = (slotsData, locationFilter, departmentFilter) => {
    let filtered = slotsData;
    
    if (locationFilter) {
      filtered = filtered.filter(slot => slot.slot_location === locationFilter);
    }
    
    if (departmentFilter) {
      filtered = filtered.filter(slot => slot.patient_department === departmentFilter);
    }
    
    setFilteredSlots(filtered);
    setTotalSpots(filtered.length);
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    applyFilters(slots, newLocation, selectedDepartment);
  };

  const handleDepartmentChange = (e) => {
    const newDepartment = e.target.value;
    setSelectedDepartment(newDepartment);
    applyFilters(slots, selectedLocation, newDepartment);
  };

  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedDepartment('');
    setFilteredSlots(slots);
    setTotalSpots(slots.length);
  };

  useEffect(() => {
    if (!token) return;
    
    const abortController = new AbortController();
    fetchQueue(abortController.signal);
    
    const interval = setInterval(() => {
      fetchQueue(abortController.signal);
    }, REFRESH_INTERVAL);
    
    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, [fetchQueue, token]);

  useEffect(() => {
    if (!token || !slotIdFromQuery) return;
    fetchQueue();
  }, [slotIdFromQuery, fetchQueue, token]);

  useEffect(() => {
    if (!token || !slotIdFromQuery || !effectiveUserId || optimisticAppliedRef.current) return;
    
    const idNum = parseInt(slotIdFromQuery, 10);
    if (!Number.isFinite(idNum)) return;
    if (slots.length === 0) return;

    const target = slots.find(s => s.id === idNum);
    if (!target) return;
    
    const statusLower = (target.status || '').toLowerCase();
    if (statusLower === SLOT_STATUS.BOOKED) {
      optimisticAppliedRef.current = true;
      return;
    }

    setSlots(prev => prev.map(s => 
      s.id === idNum 
        ? { ...s, status: SLOT_STATUS.BOOKED, user_id: effectiveUserId } 
        : s
    ));
    optimisticAppliedRef.current = true;
  }, [slotIdFromQuery, effectiveUserId, slots, token]);

  const goToBooking = (slotId) => {
    navigate(`/BookingAppointment?slotId=${slotId}`);
  };

  const calculateWaitTime = useCallback(() => {
    if (userPosition === null || currentServing === null) return t('queue.waitTime.unknown');
    const position = userPosition - (currentServing || 0);
    if (position <= 0) return t('queue.waitTime.now');
    return `~${position * ESTIMATED_TIME_PER_SLOT} ${t('queue.waitTime.min')}`;
  }, [userPosition, currentServing, t]);

  const handleRetry = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    await fetchQueue();
  }, [fetchQueue, token]);

  if (!token) {
    return null; // Or a loading spinner while redirect happens
  }

  if (loading && slots.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.error.title')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {t('common.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Nav showLanguageSelector={true} />
        
        <TealWaveBackground/>
        <BrushTealWaves/>
        <main className="flex-1 py-10 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.yourPosition')}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {userPosition !== null ? userPosition : t('queue.notInQueue')}
                    {userPosition !== null && <span className="text-gray-400 text-lg">/{totalSpots}</span>}
                  </p>
                </div>
    
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.currentlyServing')}</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {currentServing !== null ? currentServing + 1 : t('queue.none')}
                  </p>
                </div>
    
                <div>
                  <p className="text-gray-500 text-sm uppercase tracking-wide">{t('queue.estimatedWait')}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {userPosition !== null ? calculateWaitTime() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
    
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">{t('queue.queuePositions')}</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="flex items-center w-full sm:w-auto">
                    <label htmlFor="location-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
                      {t('queue.filterByLocation')}:
                    </label>
                    <select
                      id="location-filter"
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
                    >
                      <option value="">{t('queue.selectLocation')}</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center w-full sm:w-auto">
                    <label htmlFor="department-filter" className="mr-2 text-sm text-gray-600 whitespace-nowrap">
                      {t('queue.filterByDepartment')}:
                    </label>
                    <select
                      id="department-filter"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
                    >
                      <option value="">{t('queue.selectDepartment')}</option>
                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(selectedLocation || selectedDepartment) && (
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 whitespace-nowrap"
                    >
                      {t('queue.resetFilters')}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
                {filteredSlots.map((slot) => {
                  let spotClass = "bg-gray-200";
                  let iconClass = "text-gray-500";
                  const slotStatus = (slot.status || '').toLowerCase();

                  if (effectiveUserId && slot.user_id === effectiveUserId) {
                    spotClass = "bg-yellow-100 border-2 border-yellow-400";
                    iconClass = "text-yellow-600";
                  } else if (slotStatus === SLOT_STATUS.SERVING) {
                    spotClass = "bg-teal-100 border-2 border-teal-400";
                    iconClass = "text-teal-600";
                  } else if (slotStatus === SLOT_STATUS.BOOKED) {
                    spotClass = "bg-red-100";
                    iconClass = "text-red-600";
                  }

                  return (
                    <button
                      key={slot.id}
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass}`}
                      aria-label={`${t('queue.position')} ${slot.slot_number + 1} - ${slotStatus}`}
                      onClick={() => slotStatus === SLOT_STATUS.AVAILABLE && goToBooking(slot.id)}
                      disabled={slotStatus !== SLOT_STATUS.AVAILABLE}
                      aria-disabled={slotStatus !== SLOT_STATUS.AVAILABLE}
                    >
                      <User size={18} className={iconClass} />
                    </button>
                  );
                })}
              </div>
    
              <div className="mt-8 flex flex-wrap gap-4 text-sm select-none">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
                  <span className="text-gray-600">{t('queue.currentlyServing')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
                  <span className="text-gray-600">{t('queue.yourPosition')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
                  <span className="text-gray-600">{t('queue.bookedByOthers')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                  <span className="text-gray-600">{t('queue.available')}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

TrackQueue.propTypes = {
  userId: PropTypes.number,
};

export default TrackQueue;