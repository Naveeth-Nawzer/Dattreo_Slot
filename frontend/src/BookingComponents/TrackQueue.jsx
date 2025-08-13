// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import { User, Clock } from 'lucide-react';

// const BACKEND_URL = 'http://localhost:5001';

// const TrackQueue = ({ userId }) => {
//   const [slots, setSlots] = useState([]);
//   const [currentServing, setCurrentServing] = useState(null);
//   const [userPosition, setUserPosition] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalSpots, setTotalSpots] = useState(20); // Default total spots

//   const fetchQueue = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(`${BACKEND_URL}/api/slots`);
      
//       // Handle different response formats
//       let slotsData = [];
//       if (Array.isArray(response.data)) {
//         slotsData = response.data;
//       } else if (response.data?.data) {
//         slotsData = response.data.data;
//       } else if (response.data?.rows) {
//         slotsData = response.data.rows;
//       } else {
//         throw new Error('Invalid response format');
//       }

//       if (!Array.isArray(slotsData)) {
//         throw new Error('Received slots data is not an array');
//       }

//       setSlots(slotsData);
//       setTotalSpots(slotsData.length);

//       // Find currently serving slot
//       const serving = slotsData.find(slot => slot.status === 'serving');
//       setCurrentServing(serving ? serving.slot_number : 0);

//       // Find user's position
//       const userSlot = slotsData.find(slot => slot.user_id === userId);
//       if (userSlot) {
//         const bookedSlots = slotsData.filter(slot => ['booked', 'serving'].includes(slot.status));
//         const position = bookedSlots.findIndex(slot => slot.id === userSlot.id);
//         setUserPosition(position >= 0 ? position : null);
//       } else {
//         setUserPosition(null);
//       }
//     } catch (err) {
//       console.error('Failed to fetch queue:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to load queue data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQueue();
//     const interval = setInterval(fetchQueue, 10000); // Refresh every 10 seconds
//     return () => clearInterval(interval);
//   }, [userId]);

//   const bookSlot = async (slotId) => {
//     try {
//       setLoading(true);
//       await axios.post(`${BACKEND_URL}/api/slots/${slotId}/book`, { user_id: userId });
//       await fetchQueue(); // Refresh queue after booking
//     } catch (err) {
//       console.error('Failed to book slot:', err);
//       setError(err.response?.data?.message || 'Failed to book slot. It may have been taken by someone else.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && slots.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading queue data...</p>
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
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading queue</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchQueue}
//             className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const calculateWaitTime = () => {
//     if (userPosition === null || currentServing === null) return 'Unknown';
//     const position = userPosition - currentServing;
//     if (position <= 0) return 'Now';
//     return `~${position * 5} min`; 
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
//       {/* Main Content */}
//       <main className="flex-1 py-10 px-4 sm:px-6">
//         <div className="max-w-5xl mx-auto">
  
//           {/* Queue Status */}
//           <div className="bg-white rounded-xl shadow-md p-6 mb-10">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//               <div>
//                 <p className="text-gray-500 text-sm uppercase tracking-wide">Your position</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {userPosition !== null ? userPosition + 1 : 'Not in queue'}
//                   {userPosition !== null && <span className="text-gray-400 text-lg">/{totalSpots}</span>}
//                 </p>
//               </div>
  
//               <div>
//                 <p className="text-gray-500 text-sm uppercase tracking-wide">Currently serving</p>
//                 <p className="text-3xl font-bold text-teal-600">
//                   {currentServing !== null ? currentServing + 1 : 'None'}
//                 </p>
//               </div>
  
//               <div>
//                 <p className="text-gray-500 text-sm uppercase tracking-wide">Estimated wait time</p>
//                 <p className="text-3xl font-bold text-gray-800">
//                   {userPosition !== null ? calculateWaitTime() : 'N/A'}
//                 </p>
//               </div>
//             </div>
//           </div>
  
//           {/* Queue Visualization */}
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-6">Queue Positions</h3>
//             <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
//               {Array.from({ length: totalSpots }).map((_, index) => {
//                 let spotClass = "bg-gray-200";
//                 let iconClass = "text-gray-500";
  
//                 if (userPosition !== null && index === userPosition) {
//                   spotClass = "bg-yellow-100 border-2 border-yellow-400";
//                   iconClass = "text-yellow-600";
//                 } else if (currentServing !== null && index < currentServing) {
//                   spotClass = "bg-green-100";
//                   iconClass = "text-green-600";
//                 } else if (currentServing !== null && index === currentServing) {
//                   spotClass = "bg-teal-100 border-2 border-teal-400";
//                   iconClass = "text-teal-600";
//                 } else if (slots[index]?.status === 'booked') {
//                   spotClass = "bg-red-100";
//                   iconClass = "text-red-600";
//                 }
  
//                 return (
//                   <div
//                     key={index}
//                     className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass}`}
//                     title={`Position ${index + 1}`}
//                   >
//                     <User size={18} className={iconClass} />
//                   </div>
//                 );
//               })}
//             </div>
  
//             {/* Legend */}
//             <div className="mt-8 flex flex-wrap gap-4 text-sm select-none">
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
//                 <span className="text-gray-600">Served</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
//                 <span className="text-gray-600">Currently serving</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
//                 <span className="text-gray-600">Your position</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
//                 <span className="text-gray-600">Booked by others</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
//                 <span className="text-gray-600">Available</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TrackQueue;


import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BACKEND_URL = 'http://localhost:5001';

const TrackQueue = ({ userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userIdFromQuery = params.get('userId');
  const slotIdFromQuery = params.get('slotId');
  const effectiveUserId = userIdFromQuery ? parseInt(userIdFromQuery, 10) : userId;
  const [slots, setSlots] = useState([]);
  const [currentServing, setCurrentServing] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSpots, setTotalSpots] = useState(0);
  const optimisticAppliedRef = useRef(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${BACKEND_URL}/api/slots`, {
        headers: { 'Cache-Control': 'no-cache' },
        params: { ts: Date.now() }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to load queue data');
      }

      const slotsData = response.data.data;
      setSlots(slotsData);
      setTotalSpots(slotsData.length);

      const serving = slotsData.find(slot => (slot.status || '').toLowerCase() === 'serving');
      setCurrentServing(serving ? serving.slot_number : null);

      if (effectiveUserId) {
        const userSlot = slotsData.find(slot => slot.user_id === effectiveUserId);
        if (userSlot) {
          const bookedSlots = slotsData.filter(slot => 
            ['booked', 'serving'].includes((slot.status || '').toLowerCase())
          );
          const position = bookedSlots.findIndex(slot => slot.id === userSlot.id);
          setUserPosition(position >= 0 ? position : null);
        } else {
          setUserPosition(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch queue:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [effectiveUserId]);

  useEffect(() => {
    if (slotIdFromQuery) {
      fetchQueue();
    }
  }, [slotIdFromQuery]);

  useEffect(() => {
    if (!slotIdFromQuery || !effectiveUserId || optimisticAppliedRef.current) return;
    const idNum = parseInt(slotIdFromQuery, 10);
    if (!Number.isFinite(idNum)) return;
    if (slots.length === 0) return;

    const target = slots.find(s => s.id === idNum);
    if (!target) return;
    const statusLower = (target.status || '').toLowerCase();
    if (statusLower === 'booked') {
      optimisticAppliedRef.current = true;
      return;
    }

    setSlots(prev => prev.map(s => 
      s.id === idNum ? { ...s, status: 'booked', user_id: effectiveUserId } : s
    ));
    optimisticAppliedRef.current = true;
  }, [slotIdFromQuery, effectiveUserId, slots]);

  const goToBooking = (slotId) => {
    navigate(`/BookingAppointment?slotId=${slotId}`);
  };

  const calculateWaitTime = () => {
    if (userPosition === null || currentServing === null) return 'Unknown';
    const position = userPosition - (currentServing || 0);
    if (position <= 0) return 'Now';
    return `~${position * 5} min`;
  };

  if (loading && slots.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading queue data...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading queue</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchQueue}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Your position</p>
                <p className="text-3xl font-bold text-gray-800">
                  {userPosition !== null ? userPosition + 1 : 'Not in queue'}
                  {userPosition !== null && <span className="text-gray-400 text-lg">/{totalSpots}</span>}
                </p>
              </div>
  
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Currently serving</p>
                <p className="text-3xl font-bold text-teal-600">
                  {currentServing !== null ? currentServing + 1 : 'None'}
                </p>
              </div>
  
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Estimated wait time</p>
                <p className="text-3xl font-bold text-gray-800">
                  {userPosition !== null ? calculateWaitTime() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
  
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Queue Positions</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
              {slots.map((slot) => {
                let spotClass = "bg-gray-200";
                let iconClass = "text-gray-500";

                const status = (slot.status || '').toLowerCase();
                const isUserSlot = effectiveUserId && slot.user_id === effectiveUserId;

                if (isUserSlot) {
                  spotClass = "bg-yellow-100 border-2 border-yellow-400";
                  iconClass = "text-yellow-600";
                } else if (status === 'serving') {
                  spotClass = "bg-teal-100 border-2 border-teal-400";
                  iconClass = "text-teal-600";
                } else if (status === 'booked') {
                  spotClass = "bg-red-100 border border-red-300";
                  iconClass = "text-red-600";
                }

                return (
                  <button
                    key={slot.id}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass}`}
                    title={`Position ${slot.slot_number + 1}`}
                    onClick={() => status === 'available' && goToBooking(slot.id)}
                    disabled={status !== 'available'}
                  >
                    <User size={18} className={iconClass} />
                  </button>
                );
              })}
            </div>
  
            <div className="mt-8 flex flex-wrap gap-4 text-sm select-none">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
                <span className="text-gray-600">Currently serving</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
                <span className="text-gray-600">Your position</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
                <span className="text-gray-600">Booked by others</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                <span className="text-gray-600">Available</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackQueue;