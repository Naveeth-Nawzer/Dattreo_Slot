// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const BACKEND_URL = 'http://localhost:5001';

// const SlotConfig = () => {
//   const [maxSlots, setMaxSlots] = useState(20);
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchConfig = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/slots/config`);
//       if (response.data.success) {
//         setMaxSlots(response.data.max_slots);
//       } else {
//         setMessage(response.data.message || 'Failed to load configuration');
//       }
//     } catch (err) {
//       console.error('Failed to fetch config:', err);
//       setMessage(err.response?.data?.message || 'Server error - please try again later');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchConfig();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');

//     if (!maxSlots || maxSlots < 1) {
//       setMessage('Please enter a valid number greater than 0');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.put(
//         `${BACKEND_URL}/api/slots/config`, 
//         { max_slots: maxSlots }
//       );
      
//       if (response.data.success) {
//         setMessage('Configuration updated successfully!');
//         fetchConfig(); // Refresh the config
//       } else {
//         setMessage(response.data.message || 'Update failed');
//       }
//     } catch (err) {
//       console.error('Failed to update config:', err);
//       setMessage(err.response?.data?.message || 'Failed to update configuration');
//     } finally {
//       setIsLoading(false);
//       setTimeout(() => setMessage(''), 5000);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Configure Available Slots</h2>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">
//             Maximum Slots Available
//           </label>
//           <input
//             type="number"
//             value={maxSlots}
//             onChange={(e) => setMaxSlots(parseInt(e.target.value, 10) || 0)}
//             className="w-full p-2 border rounded"
//             min="1"
//             max="1000"
//             disabled={isLoading}
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 disabled:opacity-50"
//           disabled={!maxSlots || maxSlots < 1 || isLoading}
//         >
//           {isLoading ? 'Processing...' : 'Update Configuration'}
//         </button>
//       </form>

//       {message && (
//         <div className={`mt-4 p-2 text-center rounded ${
//           message.toLowerCase().includes('fail') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//         }`}>
//           {message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SlotConfig;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlotConfig = () => {
  const [config, setConfig] = useState({
    max_slots: 20,
    location: 'Main Office' // Default location
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current config on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/slots/config');
        if (response.data.success) {
          setConfig({
            max_slots: response.data.max_slots,
            location: response.data.location || 'Main Office' // Fallback to default
          });
        }
      } catch (err) {
        console.error('Failed to fetch config:', err);
        setMessage(err.response?.data?.message || 'Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    // Validation
    if (!config.max_slots || config.max_slots < 1 || config.max_slots > 1000) {
      setMessage('Slots must be between 1 and 1000');
      return;
    }
    
    if (!config.location || config.location.trim() === '') {
      setMessage('Location is required');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.put(
        'http://localhost:5001/api/slots/config',
        { 
          max_slots: config.max_slots,
          location: config.location
        }
      );
      
      if (response.data.success) {
        setMessage('Configuration updated successfully!');
      } else {
        setMessage(response.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      setMessage(err.response?.data?.message || 'Failed to update configuration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Slot Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Max Slots</label>
          <input
            type="number"
            value={config.max_slots}
            onChange={(e) => setConfig({
              ...config, 
              max_slots: Number(e.target.value)
            })}
            className="w-full p-2 border rounded"
            min="1"
            max="1000"
            required
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={config.location}
            onChange={(e) => setConfig({
              ...config, 
              location: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
            disabled={isLoading}
            placeholder="Enter location name"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.toLowerCase().includes('fail') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SlotConfig;