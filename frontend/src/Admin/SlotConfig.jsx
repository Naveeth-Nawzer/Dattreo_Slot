import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SlotConfig = () => {
  const [config, setConfig] = useState({
    max_slots: 20,
    location: 'Main Office' // Default location
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allConfigs, setAllConfigs] = useState([]);

  // Fetch all existing configs
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
      const response = await axios.post(
        'http://localhost:5001/api/slots/config', // POST to create new config
        { 
          max_slots: config.max_slots,
          location: config.location
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setMessage('New configuration created successfully!');
        setAllConfigs(prev => [...prev, response.data.config]);
        // Reset form
        setConfig({ max_slots: 20, location: 'Main Office' });
      } else {
        setMessage(response.data.message || 'Creation failed');
      }
    } catch (err) {
      console.error('Create config error:', err);
      let errorMsg = 'Failed to create configuration';

      if (err.response) {
        errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = 'No response from server - check backend is running';
      }

      setMessage(errorMsg);
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

      {/* Optional: Display all saved configs */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">All Configurations:</h3>
        <ul className="list-disc pl-5">
          {allConfigs.map((cfg, idx) => (
            <li key={idx}>
              Slots: {cfg.max_slots}, Location: {cfg.location}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SlotConfig;
