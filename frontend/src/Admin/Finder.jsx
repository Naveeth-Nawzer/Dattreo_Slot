import React from 'react'
import { User } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import PageNavigator from "../Components/PageNavigator"

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

  const routesOrder = [
    "/OnboardingPage2",
    "/OnboardingPage",
    "/LanguageSelection",
    "/Firstvist",
    "/Register",
    "/SignIn",
    "/home",
    "/BookingAppointment",
    "/MyAppointment", 
    "/",
    "/profile",
    "/Finder",         
    "/SlotConfig" ];

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
    <div className="min-h-screen bg-transparent flex flex-col">
      <TealWaveBackground/>
      <BrushTealWaves/>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6">
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

          {/* Queue Visualization */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Queue Positions</h3>
            <div className="grid grid-cols-4 sm:grid-cols-10 gap-4">
              {Array.from({ length: totalSpots }).map((_, index) => {
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
            </div> 
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
    </div>
  );
};

export default Finder;