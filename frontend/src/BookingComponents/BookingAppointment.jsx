// import React, { useState } from "react";
// import axios from "axios";

// export default function BookingAppointment() {
//   const [formData, setFormData] = useState({
//     name: "",
//     NIC: "",
//     number: "",
//     hospital: "",
//     department: "",
//     date: "",
//     time: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       const response = await axios.post("http://localhost:5001/api/createBooking", {
//         name: formData.name,
//         NIC: formData.NIC,
//         number: formData.number,
//         hospital: formData.hospital,
//         department: formData.department
//       });

//       setSuccess(true);
//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         NIC: "",
//         number: "",
//         hospital: "",
//         department: "",
//         date: "",
//         time: ""
//       });
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to book appointment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center p-6">
//       {/* Heading */}
//       <div className="w-full max-w-lg">
//         <h1 className="text-5xl font-bold text-teal-500">Booking</h1>
//         <h2 className="text-4xl font-bold text-black mt-1">Appointment</h2>
//         <p className="mt-1 text-gray-600">Book slot with date & time</p>
//         <hr className="my-6" />
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
//         <h3 className="text-center text-teal-500 text-lg font-semibold mb-6">Booking Form</h3>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//             Appointment booked successfully!
//           </div>
//         )}

//         <input 
//           type="text" 
//           name="name"
//           placeholder="name" 
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           required
//         />
//         <input 
//           type="text" 
//           name="NIC"
//           placeholder="NIC" 
//           value={formData.NIC}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           required
//           minLength="10"
//         />
//         <input 
//           type="text" 
//           name="number"
//           placeholder="mobile number" 
//           value={formData.number}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           required
//           minLength="10"
//         />
//         <input 
//           type="text" 
//           name="hospital"
//           placeholder="hospital" 
//           value={formData.hospital}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           required
//         />
//         <input 
//           type="text" 
//           name="department"
//           placeholder="department" 
//           value={formData.department}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           required
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input 
//             type="date" 
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           />
//           <input 
//             type="time" 
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className={`w-full ${loading ? 'bg-gray-300' : 'bg-gray-100 hover:bg-teal-500 hover:text-white'} transition-colors py-3 rounded-lg font-semibold`}
//         >
//           {loading ? 'Booking...' : 'Book Now'}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation and slotId

export default function BookingAppointment() {
  const navigate = useNavigate(); // Initialize navigation
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const slotId = params.get('slotId');
  const [formData, setFormData] = useState({
    name: "",
    NIC: "",
    number: "",
    hospital: "",
    department: "",
    date: "",
    time: "",
    location: "" // Added location field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setConfigLoading(true);
        const res = await axios.get('http://localhost:5001/api/slots/config');
        if (res.data?.success) {
          const loc = res.data.location || '';
          setAvailableLocations(loc ? [loc] : []);
          if (loc) {
            setFormData(prev => ({ ...prev, location: loc }));
          }
        }
      } catch (err) {
        // Leave locations empty; user can still choose manually if options exist
      } finally {
        setConfigLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate all fields including date and time
    if (!formData.date || !formData.time || !formData.location) {
      setError("Please fill all fields including date, time, and location");
      setLoading(false);
      return;
    }

    try {
      // First create the patient booking
      const bookingResponse = await axios.post("http://localhost:5001/api/createBooking", {
        name: formData.name,
        NIC: formData.NIC,
        number: formData.number,
        hospital: formData.hospital,
        department: formData.department,
        location: formData.location
      });

      if (bookingResponse.data?.patient) {
        // Then book the selected slot by id
        if (!slotId) {
          throw new Error("Missing slotId from selection");
        }

        const userId = bookingResponse.data.patient.id;
        const slotResponse = await axios.post(`http://localhost:5001/api/slots/${slotId}/book`, {
          user_id: userId,
          location: formData.location
        });

        if (slotResponse.data?.success) {
          setSuccess(true);
          // Reset form after successful submission
          setFormData({
            name: "",
            NIC: "",
            number: "",
            hospital: "",
            department: "",
            date: "",
            time: "",
            location: ""
          });
          
          // Navigate to tracking page after 2 seconds
          setTimeout(() => {
            navigate(`/?userId=${userId}&slotId=${slotId}`);
          }, 2000);
        } else {
          throw new Error(slotResponse.data?.message || "Slot booking failed");
        }
      } else {
        throw new Error("Patient registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Heading */}
      <div className="w-full max-w-lg">
        <h1 className="text-5xl font-bold text-teal-500">Booking</h1>
        <h2 className="text-4xl font-bold text-black mt-1">Appointment</h2>
        <p className="mt-1 text-gray-600">Book slot with date & time</p>
        <hr className="my-6" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <h3 className="text-center text-teal-500 text-lg font-semibold mb-6">Booking Form</h3>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Appointment booked successfully! Redirecting...
          </div>
        )}

        <input 
          type="text" 
          name="name"
          placeholder="Name" 
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          required
        />
        <input 
          type="text" 
          name="NIC"
          placeholder="NIC" 
          value={formData.NIC}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          required
          minLength="10"
        />
        <input 
          type="tel" 
          name="number"
          placeholder="Mobile Number" 
          value={formData.number}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          required
          minLength="10"
        />
        <input 
          type="text" 
          name="hospital"
          placeholder="Hospital" 
          value={formData.hospital}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          required
        />
        <input 
          type="text" 
          name="department"
          placeholder="Department" 
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
          required
        />
        
        {/* Location Select (pre-filled from slot config if available) */}
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
          disabled={configLoading || (availableLocations.length === 1)}
        >
          <option value="">Select Location</option>
          {availableLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
          {/* fallback options if no config present */}
          {availableLocations.length === 0 && (
            <>
              <option value="Main Building">Main Building</option>
              <option value="Emergency Wing">Emergency Wing</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Cardiology">Cardiology</option>
            </>
          )}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
            required
            min={new Date().toISOString().split('T')[0]} // Disable past dates
          />
          <input 
            type="time" 
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" 
            required
            min="08:00" 
            max="17:00"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full ${loading ? 'bg-gray-300' : 'bg-teal-500 hover:bg-teal-600 text-white'} transition-colors py-3 rounded-lg font-semibold`}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}