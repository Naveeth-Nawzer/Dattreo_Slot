import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import { useLocation, useNavigate } from "react-router-dom";
import PageNavigator from "../Components/PageNavigator"

const SlotConfig = () => {
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
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setMessage('Configuration updated successfully!');
        // Optionally refresh the config
        const newConfig = await axios.get('http://localhost:5001/api/slots/config');
        setConfig({
          max_slots: newConfig.data.max_slots,
          location: newConfig.data.location
        });
      } else {
        setMessage(response.data.message || 'Update failed');
      }
    } catch (err) {
      console.error('Full update error:', err);
      let errorMsg = 'Failed to update configuration';
      
      if (err.response) {
        errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        
        if (err.response.status === 409) {
          errorMsg = 'Configuration conflict - please refresh and try again';
        }
        
        if (err.response.data?.detail) {
          console.error('Server error details:', err.response.data.detail);
          errorMsg += ` (${err.response.data.detail.error || 'no details'})`;
        }
      } else if (err.request) {
        errorMsg = 'No response from server - check backend is running';
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
      
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-[200px] sm:mt-[170px]">
      <TealWaveBackground/>
      <BrushTealWaves/>

      <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center">Slot Configuration</h2>
      
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
          className="mt-5 bg-teal-500 text-white w-full border border-teal-300 text-teal-800 font-medium rounded-xl py-3 hover:bg-teal-600 transition-colors"
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
    </div>
    
  );
};

export default SlotConfig;