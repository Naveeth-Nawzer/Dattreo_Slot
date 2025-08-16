import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import { useLocation, useNavigate } from "react-router-dom";
import PageNavigator from "../Components/PageNavigator"
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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
    "/SlotConfig"
  ];

  const [config, setConfig] = useState({
    max_slots: 20,
    location: 'Main Office',
    department: 'General'
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [configData, setConfigData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all configurations
        const allConfigs = await axios.get('http://localhost:5001/api/slotsconfig/all');
        if (allConfigs.data.success) {
          setConfigData(allConfigs.data.configurations);
          
          // Extract unique departments and locations from existing configs
          const departments = [...new Set(allConfigs.data.configurations.map(c => c.department))];
          const locations = [...new Set(allConfigs.data.configurations.map(c => c.location))];
          
          setDepartmentSuggestions(departments.length ? departments : ['General', 'Cardiology', 'Pediatrics']);
          setLocationSuggestions(locations.length ? locations : ['Main Office']);
        }

      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setMessage(err.response?.data?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleDepartmentChange = (e) => {
    setConfig({
      ...config,
      department: e.target.value
    });
    setShowSuggestions(true);
  };

  const handleLocationChange = (e) => {
    setConfig({
      ...config,
      location: e.target.value
    });
    setShowLocationSuggestions(true);
  };

  const selectSuggestion = (suggestion, field) => {
    setConfig({
      ...config,
      [field]: suggestion
    });
    if (field === 'department') {
      setShowSuggestions(false);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleAddNew = () => {
    setConfig({
      max_slots: 20,
      location: 'Main Office',
      department: 'General'
    });
    setEditingId(null);
    setIsAddingNew(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!config.max_slots || config.max_slots < 1 || config.max_slots > 1000) {
      setMessage('Slots must be between 1 and 1000');
      return;
    }
    
    if (!config.location || config.location.trim() === '') {
      setMessage('Location is required');
      return;
    }

    if (!config.department || config.department.trim() === '') {
      setMessage('Department is required');
      return;
    }
  
    setIsLoading(true);
    try {
      let response;
      
      if (editingId) {
        // Update existing config
        response = await axios.put(
          `http://localhost:5001/api/slotsconfig/${editingId}`,
          { 
            max_slots: config.max_slots,
            location: config.location,
            department: config.department
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new config
        response = await axios.post(
          'http://localhost:5001/api/slotsconfig',
          { 
            max_slots: config.max_slots,
            location: config.location,
            department: config.department
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      if (response.data.success) {
        setMessage(editingId ? 'Configuration updated successfully!' : 'Configuration added successfully!');
        
        // Refresh config data
        const allConfigs = await axios.get('http://localhost:5001/api/slotsconfig/all');
        setConfigData(allConfigs.data.configurations);
        
        // Update suggestions
        const departments = [...new Set(allConfigs.data.configurations.map(c => c.department))];
        const locations = [...new Set(allConfigs.data.configurations.map(c => c.location))];
        setDepartmentSuggestions(departments);
        setLocationSuggestions(locations);
        
        // Reset form
        setConfig({
          max_slots: 20,
          location: 'Main Office',
          department: 'General'
        });
        setEditingId(null);
        setIsAddingNew(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (configItem) => {
    setConfig({
      max_slots: configItem.max_slots,
      location: configItem.location,
      department: configItem.department
    });
    setEditingId(configItem.config_id);
    setIsAddingNew(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.delete(`http://localhost:5001/api/slotsconfig/${id}`);
      
      if (response.data.success) {
        setMessage('Configuration deleted successfully');
        const allConfigs = await axios.get('http://localhost:5001/api/slotsconfig/all');
        setConfigData(allConfigs.data.configurations);
        
        // Update suggestions
        const departments = [...new Set(allConfigs.data.configurations.map(c => c.department))];
        const locations = [...new Set(allConfigs.data.configurations.map(c => c.location))];
        setDepartmentSuggestions(departments);
        setLocationSuggestions(locations);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setMessage(err.response?.data?.message || 'Failed to delete configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setConfig({
      max_slots: 20,
      location: 'Main Office',
      department: 'General'
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  const filteredDeptSuggestions = departmentSuggestions.filter(dept =>
    dept.toLowerCase().includes(config.department.toLowerCase())
  );

  const filteredLocSuggestions = locationSuggestions.filter(loc =>
    loc.toLowerCase().includes(config.location.toLowerCase())
  );

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
      
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md mt-[200px] sm:mt-[170px]">
        <TealWaveBackground/>
        <BrushTealWaves/>

        {(editingId || isAddingNew) ? (
          <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center">
            {editingId ? 'Edit Configuration' : 'Add New Configuration'}
          </h2>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">Slot Configurations</h2>
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add New
            </button>
          </div>
        )}

        {(editingId || isAddingNew) && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
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

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={config.location}
                  onChange={handleLocationChange}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isLoading}
                  placeholder="Enter location"
                />
                {showLocationSuggestions && filteredLocSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredLocSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => selectSuggestion(suggestion, 'location')}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  value={config.department}
                  onChange={handleDepartmentChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isLoading}
                  placeholder="Type department name"
                />
                {showSuggestions && filteredDeptSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredDeptSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => selectSuggestion(suggestion, 'department')}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.toLowerCase().includes('fail') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* Configuration Table */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Existing Configurations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Config ID</th>
                  <th className="py-2 px-4 border-b">Max Slots</th>
                  <th className="py-2 px-4 border-b">Location</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {configData.length > 0 ? (
                  configData.map((item) => (
                    <tr key={item.config_id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">{item.config_id}</td>
                      <td className="py-2 px-4 border-b text-center">{item.max_slots}</td>
                      <td className="py-2 px-4 border-b text-center">{item.location}</td>
                      <td className="py-2 px-4 border-b text-center">{item.department}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.config_id)}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">
                      No configuration data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotConfig;