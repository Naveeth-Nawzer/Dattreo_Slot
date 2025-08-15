// import React, { useState, useEffect } from 'react';
// import { User, Check, Clock, X, ChevronRight, MoreVertical } from 'lucide-react';
// import api from '../api';

// const Finder = () => {
//   const [queueStatus, setQueueStatus] = useState({
//     slots: [],
//     currentServing: null,
//     totalSpots: 50
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [activeSlot, setActiveSlot] = useState(null);

//   const fetchQueueStatus = async () => {
//     try {
//       setIsLoading(true);
//       const res = await api.get('/slots/status');
//       setQueueStatus({
//         ...res.data,
//         totalSpots: res.data.totalSpots || 50
//       });
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to load queue status");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateSlotStatus = async (slotId, status) => {
//     try {
//       setIsLoading(true);
      
//       // Optimistic UI update
//       setQueueStatus(prev => {
//         const updatedSlots = prev.slots.map(slot => 
//           slot.id === slotId ? { ...slot, status } : slot
//         );
        
//         return {
//           ...prev,
//           slots: updatedSlots,
//           currentServing: prev.currentServing?.id === slotId 
//             ? { ...prev.currentServing, status }
//             : prev.currentServing
//         };
//       });
      
//       const response = await api.patch(`/slots/${slotId}/status`, { status });
      
//       if (response.status !== 200) {
//         throw new Error(`Unexpected response: ${response.status}`);
//       }
      
//       setActiveSlot(null);
//       setError(null);
//     } catch (err) {
//       console.error("Update error:", err);
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           err.message || 
//                           'Failed to update status';
//       setError(errorMessage);
//       // Revert by refetching
//       await fetchQueueStatus();
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const serveNextPatient = async () => {
//     try {
//       setIsLoading(true);
//       await api.post('/slots/next');
//       await fetchQueueStatus();
//     } catch (err) {
//       console.error("Move error:", err);
//       setError("Failed to move to next patient");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQueueStatus();
//   }, []);

//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>;
//   }

//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         {error}
//       </div>
//     </div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <header className="bg-white shadow-sm py-4 px-6">
//         <h1 className="text-2xl font-bold text-gray-800">Patient Queue Management</h1>
//       </header>

//       <main className="flex-1 py-8 px-4 sm:px-6">
//         <div className="max-w-5xl mx-auto">
//           <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Serving</h2>
//             {queueStatus.currentServing ? (
//               <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
//                 <div className="flex items-center">
//                   <div className={`p-2 rounded-full mr-3 ${
//                     queueStatus.currentServing.status === 'present' 
//                       ? 'bg-green-100 text-green-600' 
//                       : queueStatus.currentServing.status === 'left'
//                       ? 'bg-red-100 text-red-600'
//                       : 'bg-yellow-100 text-yellow-600'
//                   }`}>
//                     {queueStatus.currentServing.status === 'present' ? (
//                       <Check size={20} />
//                     ) : queueStatus.currentServing.status === 'left' ? (
//                       <X size={20} />
//                     ) : (
//                       <Clock size={20} />
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium">Position #{queueStatus.currentServing.position}</p>
//                     <p className="text-sm text-gray-600">
//                       {queueStatus.currentServing.patientName || 'Patient'}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={serveNextPatient}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//                 >
//                   Next Patient <ChevronRight className="ml-2" size={18} />
//                 </button>
//               </div>
//             ) : (
//               <p className="text-gray-500 py-2">No patient currently being served</p>
//             )}
//           </div>

//           {/* <div className="bg-white rounded-xl shadow-md p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Queue Positions</h2>
            
//             <div className="flex flex-wrap gap-4 mb-6 text-sm">
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2 flex items-center justify-center">
//                   <Check size={12} className="text-green-600" />
//                 </div>
//                 <span>Present</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300 mr-2 flex items-center justify-center">
//                   <Clock size={12} className="text-yellow-600" />
//                 </div>
//                 <span>Waiting</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 mr-2 flex items-center justify-center">
//                   <User size={12} className="text-blue-600" />
//                 </div>
//                 <span>Current</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2 flex items-center justify-center">
//                   <X size={12} className="text-red-600" />
//                 </div>
//                 <span>Left</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
//               {Array.from({ length: queueStatus.totalSpots }).map((_, index) => {
//                 const slot = queueStatus.slots.find(s => s.position === index + 1);
//                 const isCurrent = queueStatus.currentServing?.position === index + 1;
//                 const isActive = activeSlot === index;

//                 let spotClass = "bg-gray-200";
//                 let icon = <User size={16} className="text-gray-500" />;

//                 if (isCurrent) {
//                   spotClass = "bg-blue-100 border-2 border-blue-400";
//                   icon = <User size={16} className="text-blue-600" />;
//                 } else if (slot) {
//                   switch(slot.status) {
//                     case 'present':
//                       spotClass = "bg-green-100 border-2 border-green-400";
//                       icon = <Check size={16} className="text-green-600" />;
//                       break;
//                     case 'left':
//                       spotClass = "bg-red-100 border-2 border-red-400";
//                       icon = <X size={16} className="text-red-600" />;
//                       break;
//                     case 'serving':
//                       spotClass = "bg-purple-100 border-2 border-purple-400";
//                       icon = <User size={16} className="text-purple-600" />;
//                       break;
//                     case 'completed':
//                       spotClass = "bg-gray-100 border-2 border-gray-400";
//                       icon = <Check size={16} className="text-gray-600" />;
//                       break;
//                     case 'waiting':
//                       spotClass = "bg-yellow-100 border-2 border-yellow-400";
//                       icon = <Clock size={16} className="text-yellow-600" />;
//                       break;
//                     case 'available':
//                     case 'booked':
//                     case null:
//                     case undefined:
//                       spotClass = "bg-yellow-100 border-2 border-yellow-400";
//                       icon = <Clock size={16} className="text-yellow-600" />;
//                       break;
//                     default:
//                       spotClass = "bg-yellow-100 border-2 border-yellow-400";
//                       icon = <Clock size={16} className="text-yellow-600" />;
//                   }
//                 } else {
//                   // No slot for this position - empty spot
//                   spotClass = "bg-gray-200 border border-gray-300";
//                   icon = <User size={16} className="text-gray-400" />;
//                 }

//                 return (
//                   <div key={index} className="relative">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass} cursor-pointer`}
//                       onClick={() => slot && setActiveSlot(activeSlot === index ? null : index)}
//                       title={`Position ${index + 1}`}
//                     >
//                       {icon}
//                     </div>
                    
//                     {isActive && slot && (
//                       <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//                         <div className="py-1">
//                           <button
//                             onClick={() => updateSlotStatus(slot.id, 'waiting')}
//                             className={`block px-4 py-2 text-sm w-full text-left ${
//                               slot.status === 'waiting' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <Clock className="inline mr-2" size={14} /> Mark Waiting
//                           </button>
//                           <button
//                             onClick={() => updateSlotStatus(slot.id, 'present')}
//                             className={`block px-4 py-2 text-sm w-full text-left ${
//                               slot.status === 'present' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <Check className="inline mr-2" size={14} /> Mark Present
//                           </button>
//                           <button
//                             onClick={() => updateSlotStatus(slot.id, 'serving')}
//                             className={`block px-4 py-2 text-sm w-full text-left ${
//                               slot.status === 'serving' ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <User className="inline mr-2" size={14} /> Mark Serving
//                           </button>
//                           <button
//                             onClick={() => updateSlotStatus(slot.id, 'completed')}
//                             className={`block px-4 py-2 text-sm w-full text-left ${
//                               slot.status === 'completed' ? 'bg-gray-50 text-gray-700' : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <Check className="inline mr-2" size={14} /> Mark Completed
//                           </button>
//                           <button
//                             onClick={() => updateSlotStatus(slot.id, 'left')}
//                             className={`block px-4 py-2 text-sm w-full text-left ${
//                               slot.status === 'left' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
//                             }`}
//                           >
//                             <X className="inline mr-2" size={14} /> Mark Left
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mt-8 sm:hidden">
//               <h3 className="text-lg font-medium text-gray-800 mb-3">Detailed View</h3>
//               <div className="space-y-2">
//                 {queueStatus.slots.map((slot) => (
//                   <div
//                     key={slot.id}
//                     className={`p-3 rounded-lg flex items-center justify-between ${
//                       slot.status === 'present' ? 'bg-green-50 border border-green-200' :
//                       slot.status === 'left' ? 'bg-red-50 border border-red-200' :
//                       'bg-yellow-50 border border-yellow-200'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       {slot.status === 'present' ? (
//                         <Check className="text-green-600 mr-2" size={18} />
//                       ) : slot.status === 'left' ? (
//                         <X className="text-red-600 mr-2" size={18} />
//                       ) : (
//                         <Clock className="text-yellow-600 mr-2" size={18} />
//                       )}
//                       <span>Position #{slot.position}</span>
//                     </div>
//                     <div className="flex space-x-2">
//                       <select
//                         value={slot.status || 'waiting'}
//                         onChange={(e) => updateSlotStatus(slot.id, e.target.value)}
//                         className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
//                       >
//                         <option value="waiting">Waiting</option>
//                         <option value="present">Present</option>
//                         <option value="left">Left</option>
//                         <option value="serving">Serving</option>
//                         <option value="completed">Completed</option>
//                       </select>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div> */}

// <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold text-gray-800">Current Queue Status</h3>
//         </div>

//         {/* Metrics */}
//         <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
//           <div>
//             <p className="text-gray-500 text-sm uppercase tracking-wide">Your Position</p>
//             <p className="text-3xl font-bold text-gray-800">
//               {queueStatus.userPosition !== null ? queueStatus.userPosition + 1 : 'N/A'}
//               {queueStatus.userPosition !== null && (
//                 <span className="text-gray-400 text-lg">/{queueStatus.totalSpots}</span>
//               )}
//             </p>
//           </div>

//           <div>
//             <p className="text-gray-500 text-sm uppercase tracking-wide">Currently Serving</p>
//             <p className="text-3xl font-bold text-teal-600">
//               {queueStatus.currentServing !== null ? queueStatus.currentServing + 1 : 'None'}
//             </p>
//           </div>
//         </div>

//         {/* Queue Visualization */}
//         {/* // In your queue visualization section, replace the mapping with this: */}
// <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 mb-8">
//   {queueStatus.slots.map((slot) => {
//     let slotClasses = "w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-sm ";
//     let statusClasses = "text-xs mt-1 ";

//     if (slot.status === 'present') {
//       slotClasses += "bg-green-100 border-2 border-green-400 ";
//       statusClasses += "text-green-600";
//     } else if (slot.status === 'serving') {
//       slotClasses += "bg-teal-100 border-2 border-teal-400 ";
//       statusClasses += "text-teal-600";
//     } else if (slot.status === 'booked') {
//       slotClasses += "bg-yellow-100 border-2 border-yellow-400 ";
//       statusClasses += "text-yellow-600";
//     } else if (slot.status === 'left') {
//       slotClasses += "bg-red-100 border-2 border-red-400 ";
//       statusClasses += "text-red-600";
//     } else {
//       slotClasses += "bg-gray-200 ";
//       statusClasses += "text-gray-600";
//     }

//     return (
//       <div key={slot.id} className={slotClasses}>
//         <div className="font-medium">{slot.position}</div>
//         <div className={statusClasses}>
//           {slot.status === 'present'
//             ? "Present"
//             : slot.status === 'serving'
//               ? "Serving"
//               : slot.status === 'booked'
//                 ? "Booked"
//                 : slot.status === 'left'
//                   ? "Left"
//                   : "Available"}
//         </div>
//       </div>
//     );
//   })}
// </div>

//         {/* Legend */}
//         <div className="flex flex-wrap gap-4 text-sm">
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
//             <span className="text-gray-600">Currently Serving</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
//             <span className="text-gray-600">Your Position</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
//             <span className="text-gray-600">Booked</span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
//             <span className="text-gray-600">Available</span>
//           </div>

//           <div className="flex items-center">
//   <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-400 mr-2"></div>
//   <span className="text-gray-600">Present</span>
// </div>
//         </div>
//       </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Finder;

import React, { useState, useEffect } from 'react';
import { User, Check, Clock, X, ChevronRight } from 'lucide-react';
import api from '../api';

const Finder = () => {
  const [queueStatus, setQueueStatus] = useState({
    slots: [],
    currentServing: null,
    totalSpots: 50
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSlot, setActiveSlot] = useState(null);

  const fetchQueueStatus = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/slots/status');
      setQueueStatus({
        ...res.data,
        totalSpots: res.data.totalSpots || 50
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load queue status");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSlotStatus = async (slotId, status) => {
    try {
      setIsLoading(true);
      
      // Optimistic UI update
      setQueueStatus(prev => ({
        ...prev,
        slots: prev.slots.map(slot => 
          slot.id === slotId ? { ...slot, status } : slot
        ),
        currentServing: prev.currentServing?.id === slotId 
          ? { ...prev.currentServing, status }
          : prev.currentServing
      }));
      
      const response = await api.patch(`/slots/${slotId}/status`, { status });
      
      if (response.status !== 200) {
        throw new Error(`Unexpected response: ${response.status}`);
      }
      
      setActiveSlot(null);
      setError(null);
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to update status';
      setError(errorMessage);
      // Revert by refetching
      await fetchQueueStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const serveNextPatient = async () => {
    try {
      setIsLoading(true);
      await api.post('/slots/next');
      await fetchQueueStatus();
    } catch (err) {
      console.error("Move error:", err);
      setError("Failed to move to next patient");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Queue Management</h1>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Current Serving Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Currently Serving</h2>
            {queueStatus.currentServing ? (
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    queueStatus.currentServing.status === 'present' 
                      ? 'bg-green-100 text-green-600' 
                      : queueStatus.currentServing.status === 'left'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {queueStatus.currentServing.status === 'present' ? (
                      <Check size={20} />
                    ) : queueStatus.currentServing.status === 'left' ? (
                      <X size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Position #{queueStatus.currentServing.position}</p>
                    <p className="text-sm text-gray-600">
                      {queueStatus.currentServing.patientName || 'Patient'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={serveNextPatient}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Next Patient <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            ) : (
              <p className="text-gray-500 py-2">No patient currently being served</p>
            )}
          </div>

          {/* Queue Visualization - Grid View */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Queue Grid View</h2>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2 flex items-center justify-center">
                  <Check size={12} className="text-green-600" />
                </div>
                <span>Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300 mr-2 flex items-center justify-center">
                  <Clock size={12} className="text-yellow-600" />
                </div>
                <span>Waiting</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-300 mr-2 flex items-center justify-center">
                  <User size={12} className="text-blue-600" />
                </div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2 flex items-center justify-center">
                  <X size={12} className="text-red-600" />
                </div>
                <span>Left</span>
              </div>
            </div>

            {/* <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
              {Array.from({ length: queueStatus.totalSpots }).map((_, index) => {
                const slot = queueStatus.slots.find(s => s.position === index + 1);
                const isCurrent = queueStatus.currentServing?.position === index + 1;
                const isActive = activeSlot === index;

                let spotClass = "bg-gray-200";
                let icon = <User size={16} className="text-gray-500" />;

                if (isCurrent) {
                  spotClass = "bg-blue-100 border-2 border-blue-400";
                  icon = <User size={16} className="text-blue-600" />;
                } else if (slot) {
                  switch(slot.status) {
                    case 'present':
                      spotClass = "bg-green-100 border-2 border-green-400";
                      icon = <Check size={16} className="text-green-600" />;
                      break;
                    case 'left':
                      spotClass = "bg-red-100 border-2 border-red-400";
                      icon = <X size={16} className="text-red-600" />;
                      break;
                    case 'serving':
                      spotClass = "bg-purple-100 border-2 border-purple-400";
                      icon = <User size={16} className="text-purple-600" />;
                      break;
                    case 'completed':
                      spotClass = "bg-gray-100 border-2 border-gray-400";
                      icon = <Check size={16} className="text-gray-600" />;
                      break;
                    default: // waiting or null/undefined
                      spotClass = "bg-yellow-100 border-2 border-yellow-400";
                      icon = <Clock size={16} className="text-yellow-600" />;
                  }
                }

                return (
                  <div key={index} className="relative">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass} cursor-pointer`}
                      onClick={() => slot && setActiveSlot(activeSlot === index ? null : index)}
                      title={`Position ${index + 1}`}
                    >
                      {icon}
                    </div>
                    
                    {isActive && slot && (
                      <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={() => updateSlotStatus(slot.id, 'waiting')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              slot.status === 'waiting' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Clock className="inline mr-2" size={14} /> Mark Waiting
                          </button>
                          <button
                            onClick={() => updateSlotStatus(slot.id, 'present')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              slot.status === 'present' ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Check className="inline mr-2" size={14} /> Mark Present
                          </button>
                          <button
                            onClick={() => updateSlotStatus(slot.id, 'left')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              slot.status === 'left' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <X className="inline mr-2" size={14} /> Mark Left
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div> */}
<div className="grid grid-cols-5 sm:grid-cols-10 gap-4 mb-8">
  {queueStatus.slots.map((slot) => {
    let slotClasses = "w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-sm ";
    let statusClasses = "text-xs mt-1 ";

    if (slot.status === 'present') {
      slotClasses += "bg-green-100 border-2 border-green-400 ";
      statusClasses += "text-green-600";
    } else if (slot.status === 'serving') {
      slotClasses += "bg-teal-100 border-2 border-teal-400 ";
      statusClasses += "text-teal-600";
    } else if (slot.status === 'booked') {
      slotClasses += "bg-yellow-100 border-2 border-yellow-400 ";
      statusClasses += "text-yellow-600";
    } else if (slot.status === 'left') {
      slotClasses += "bg-red-100 border-2 border-red-400 ";
      statusClasses += "text-red-600";
    } else {
      slotClasses += "bg-gray-200 ";
      statusClasses += "text-gray-600";
    }

    return (
      <div key={slot.id} className={slotClasses}>
        <div className="font-medium">{slot.position}</div>
        <div className={statusClasses}>
          {slot.status === 'present'
            ? "Present"
            : slot.status === 'serving'
              ? "Serving"
              : slot.status === 'booked'
                ? "Booked"
                : slot.status === 'left'
                  ? "Left"
                  : "Available"}
        </div>
      </div>
    );
  })}
</div>
          </div>

          {/* Queue Visualization - List View */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Queue List View</h2>
            
            <div className="space-y-2">
              {queueStatus.slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    slot.status === 'present' ? 'bg-green-50 border border-green-200' :
                    slot.status === 'left' ? 'bg-red-50 border border-red-200' :
                    slot.status === 'serving' ? 'bg-blue-50 border border-blue-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div className="flex items-center">
                    {slot.status === 'present' ? (
                      <Check className="text-green-600 mr-2" size={18} />
                    ) : slot.status === 'left' ? (
                      <X className="text-red-600 mr-2" size={18} />
                    ) : slot.status === 'serving' ? (
                      <User className="text-blue-600 mr-2" size={18} />
                    ) : (
                      <Clock className="text-yellow-600 mr-2" size={18} />
                    )}
                    <div>
                      <p className="font-medium">Position #{slot.position}</p>
                      <p className="text-sm text-gray-600">
                        {slot.patientName || 'Available slot'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      value={slot.status || 'waiting'}
                      onChange={(e) => updateSlotStatus(slot.id, e.target.value)}
                      className="text-sm bg-white border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="waiting">Waiting</option>
                      <option value="present">Present</option>
                      <option value="serving">Serving</option>
                      <option value="left">Left</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Finder;