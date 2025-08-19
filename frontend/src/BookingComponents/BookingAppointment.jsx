// import React, { useEffect, useState, useRef, useCallback } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { QRCodeCanvas } from 'qrcode.react';
// import PropTypes from 'prop-types';
// import TealWaveBackground from "../Components/TealWaveBackground";
// import BrushTealWaves from '../Components/BrushTealWaves'
// import PageNavigator from "../Components/PageNavigator"

// // Configure axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:5001/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });

// // Constants
// const MIN_NIC_LENGTH = 10;
// const MIN_PHONE_LENGTH = 10;
// const WORKING_HOURS = {
//   start: "08:00",
//   end: "17:00"
// };

// const BookingAppointment = () => {
//   const navigate = useNavigate();
//   const locationHook = useLocation();
//   const params = new URLSearchParams(locationHook.search);
//   const slotId = params.get('slotId');

//   const routesOrder = [
//     "/home",
//     "/BookingAppointment",
//    ];
  
//   const [formData, setFormData] = useState({
//     name: "",
//     nic: "",
//     number: "",
//     hospital: "",
//     department: "",
//     date: "",
//     time: "",
//     location: ""
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [configLoading, setConfigLoading] = useState(true);
//   const [availableLocations, setAvailableLocations] = useState([]);
//   const [availableDepartments, setAvailableDepartments] = useState([]);
//   const [qrCodeData, setQrCodeData] = useState(null);
//   const [bookingInfo, setBookingInfo] = useState(null);
//   const qrCodeRef = useRef(null);
//   const qrCodeSectionRef = useRef(null);

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }, []);

//   const fetchConfig = useCallback(async () => {
//   try {
//     setConfigLoading(true);
//     const configRes = await api.get('/slots/config');

//     if (configRes.data?.success) {
//       // Process location
//       const location = configRes.data.location || 'Main Office';
//       setAvailableLocations([location]);
//       setFormData(prev => ({ ...prev, location }));

//       // Process department - assuming it's a single department string
//       const department = configRes.data.department || 'General';
//       setAvailableDepartments([{ id: 1, name: department }]);
//       setFormData(prev => ({ ...prev, department }));
//     }
//   } catch (err) {
//     console.error('Config fetch error:', err);
//   } finally {
//     setConfigLoading(false);
//   }
// }, []);

//   useEffect(() => {
//     fetchConfig();
//   }, [fetchConfig]);


//   useEffect(() => {
//   if (success && qrCodeSectionRef.current) {
//     const timer = setTimeout(() => {
//       qrCodeSectionRef.current.scrollIntoView({ 
//         behavior: 'smooth',
//         block: 'center'
//       });
//     }, 300); // 300ms delay
    
//     return () => clearTimeout(timer);
//   }
// }, [success]);

//   const downloadQRCode = useCallback(() => {
//     if (!qrCodeRef.current) return;
//     const canvas = qrCodeRef.current.querySelector('canvas');
//     if (!canvas) return;
    
//     const pngUrl = canvas.toDataURL('image/png');
//     const downloadLink = document.createElement('a');
//     downloadLink.href = pngUrl;
//     downloadLink.download = `booking-${bookingInfo.patient.id}.png`;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//   }, [bookingInfo]);

//   const validateForm = useCallback(() => {
//     setError(null);

//     const validations = [
//       { condition: !formData.name.trim(), message: "Name is required" },
//       { 
//         condition: !formData.nic.trim() || formData.nic.length < MIN_NIC_LENGTH, 
//         message: `Valid NIC (at least ${MIN_NIC_LENGTH} characters) is required` 
//       },
//       { 
//         condition: !formData.number.trim() || formData.number.length < MIN_PHONE_LENGTH, 
//         message: `Valid phone number (at least ${MIN_PHONE_LENGTH} digits) is required` 
//       },
//       { condition: !formData.hospital.trim(), message: "Hospital is required" },
//       { condition: !formData.department.trim(), message: "Department is required" },
//       { condition: !formData.date, message: "Date is required" },
//       { condition: !formData.time, message: "Time is required" },
//       { condition: !formData.location, message: "Location is required" },
//       { condition: !slotId || isNaN(slotId), message: "Invalid slot selection" }
//     ];

//     const failedValidation = validations.find(v => v.condition);
//     if (failedValidation) {
//       setError(failedValidation.message);
//       return false;
//     }

//     return true;
//   }, [formData, slotId]);

//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
  
//     // Validate form before submission
//     if (!validateForm()) {
//       return;
//     }
  
//     setLoading(true);
//     setError(null);
  
//     try {
//       // 1. Prepare payload matching backend expectations
//       const bookingPayload = {
//         name: formData.name.trim(),
//         NIC: formData.nic.trim(),  // backend expects uppercase NIC
//         number: formData.number.trim(),
//         hospital: formData.hospital.trim(),
//         department: formData.department.trim(),
//         location: formData.location || 'Main Office',
//         date: formData.date,
//         time: formData.time,
//         slot_id: parseInt(slotId, 10) // ensure number
//       };
  
//       console.log('Submitting booking payload:', bookingPayload);
  
//       // 2. Create the patient booking
//       const bookingResponse = await api.post("/bookings", bookingPayload);
//       if (!bookingResponse.data?.patient?.id) {
//         throw new Error("Patient booking failed - no ID returned");
//       }
//       const patientId = bookingResponse.data.patient.id;
  
//       // 3. Book the slot
//       const userId = bookingResponse.data.patient.id;
//       const slotResponse = await api.post(`/slots/${slotId}/book`, {
//         user_id: patientId,
//         location: bookingPayload.location
//       });
  
//       // 4. Handle success
//       setSuccess(true);
//       setBookingInfo({
//         patient: bookingResponse.data.patient,
//         slot: slotResponse.data.slot
//       });
  
//       // 5. Generate QR code data in backend-expected format
//       setQrCodeData({
//         slotId: parseInt(slotId, 10),
//         patientId: parseInt(patientId, 10)
//       });
  
//     } catch (err) {
//       let errorMessage = "Booking failed. Please try again.";
//       if (err.response) {
//         if (err.response.status === 400) {
//           errorMessage = err.response.data?.error ||
//                         err.response.data?.message ||
//                         "Invalid data submitted";
//         } else if (err.response.status === 409) {
//           errorMessage = "This slot is no longer available";
//         }
//       } else if (err.request) {
//         errorMessage = "No response from server. Please check your connection.";
//       }
  
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, slotId, validateForm]);

//   return (
//     <div>
//       <PageNavigator routesOrder={routesOrder}/>
//     <div className="bg-white flex flex-col items-center p-4 sm:p-6 mt-[10px] sm:mt-[60px] rounded-lg">
//       <TealWaveBackground/>
//       <BrushTealWaves/>
//       {/* Heading */}
//       <div className="w-full max-w-xl">
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-500">Booking</h1>
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mt-1">Appointment</h2>
//         <p className="mt-1 text-gray-400 text-sm sm:text-base">Book slot with date & time</p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3 sm:space-y-4 mt-6 sm:mt-8">
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm sm:text-base">
//             Appointment booked successfully!
//           </div>
//         )}

//         <input 
//           type="text" 
//           name="name"
//           placeholder="Name" 
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//           required
//         />
        
//         <input 
//           type="text" 
//           name="nic"
//           placeholder="NIC" 
//           value={formData.nic}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//           required
//           minLength={MIN_NIC_LENGTH}
//         />
        
//         <input 
//           type="tel" 
//           name="number"
//           placeholder="Mobile Number" 
//           value={formData.number}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//           required
//           minLength={MIN_PHONE_LENGTH}
//         />
        
//         <input 
//           type="text" 
//           name="hospital"
//           placeholder="Hospital" 
//           value={formData.hospital}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//           required
//         />
        
//         <select
//           name="department"
//           value={formData.department}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//           required
//           disabled={configLoading}
//         >
//           {configLoading ? (
//             <option value="">Loading...</option>
//           ) : (
//             availableDepartments.map((dept) => (
//               <option key={dept.id} value={dept.name}>{dept.name}</option>
//             ))
//           )}
//         </select>
        
//         <select
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
//           required
//           disabled={configLoading || availableLocations.length === 0}
//         >
//           {availableLocations.length === 0 ? (
//             <option value="">Loading locations...</option>
//           ) : (
//             <>
//               {availableLocations.map((loc) => (
//                 <option key={loc} value={loc}>{loc}</option>
//               ))}
//             </>
//           )}
//         </select>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//           <input 
//             type="date" 
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//             required
//             min={new Date().toISOString().split('T')[0]}
//           />
//           <input 
//             type="time" 
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
//             required
//             min={WORKING_HOURS.start}
//             max={WORKING_HOURS.end}
//           />
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading}
//           className={`w-full ${loading ? 'bg-gray-300' : 'bg-teal-500 hover:bg-teal-600 text-white'} transition-colors py-3 rounded-lg font-semibold text-sm sm:text-base`}
//         >
//           {loading ? 'Booking...' : configLoading ? 'Loading...' : 'Book Now'}
//         </button>
//       </form>

//       {/* QR Code Display */}
//       {success && qrCodeData && bookingInfo && (
//         <div ref={qrCodeSectionRef}
//         className="w-full max-w-lg mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
//           <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4">Your Booking QR Code</h3>
          
//           <div className="flex flex-col items-center">
//             <div 
//               className="p-3 sm:p-4 bg-white rounded-lg border border-gray-300 mb-3 sm:mb-4"
//               ref={qrCodeRef}
//             >
//               <QRCodeCanvas
//                 value={JSON.stringify(qrCodeData)}
//                 size={window.innerWidth < 640 ? 160 : 200}
//                 level="H"
//                 includeMargin
//               />
//             </div>
            
//             <div className="w-full space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
//               <p><strong>Booking ID:</strong> {bookingInfo.patient.id}</p>
//               <p><strong>Patient:</strong> {bookingInfo.patient.name}</p>
//               <p><strong>NIC:</strong> {bookingInfo.patient.nic}</p>
//               <p><strong>Hospital:</strong> {bookingInfo.patient.hospital}</p>
//               <p><strong>Department:</strong> {bookingInfo.patient.department}</p>
//               <p><strong>Date & Time:</strong> {formData.date} {formData.time}</p>
//               <p><strong>Location:</strong> {bookingInfo.slot.location}</p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
//               <button 
//                 onClick={downloadQRCode}
//                 className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base flex-1"
//               >
//                 Download QR Code
//               </button>
//               <button 
//                 onClick={() => navigate(`/queue`)}
//                 className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base flex-1"
//               >
//                 Track Booking
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default BookingAppointment;


import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from "../AuthContext";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves';
import PageNavigator from "../Components/PageNavigator";

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Constants
const MIN_NIC_LENGTH = 10;
const MIN_PHONE_LENGTH = 10;
const WORKING_HOURS = {
  start: "08:00",
  end: "17:00"
};

const BookingAppointment = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const params = new URLSearchParams(locationHook.search);
  const slotId = params.get('slotId');
  const { token } = useAuth();

  const routesOrder = [
    "/home",
    "/BookingAppointment",
  ];
  
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    number: "",
    hospital: "",
    department: "",
    date: "",
    time: "",
    location: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const qrCodeRef = useRef(null);
  const qrCodeSectionRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/SignIn', { state: { from: locationHook } });
      return;
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchConfig();
  }, [token, navigate, locationHook]);

  const fetchConfig = useCallback(async () => {
    try {
      setConfigLoading(true);
      const configRes = await api.get('/slots/config');

      if (configRes.data?.success) {
        const location = configRes.data.location || 'Main Office';
        setAvailableLocations([location]);
        setFormData(prev => ({ ...prev, location }));

        const department = configRes.data.department || 'General';
        setAvailableDepartments([{ id: 1, name: department }]);
        setFormData(prev => ({ ...prev, department }));
      }
    } catch (err) {
      console.error('Config fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/SignIn');
      }
    } finally {
      setConfigLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (success && qrCodeSectionRef.current) {
      const timer = setTimeout(() => {
        qrCodeSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const downloadQRCode = useCallback(() => {
    if (!qrCodeRef.current) return;
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;
    
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `booking-${bookingInfo.patient.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, [bookingInfo]);

  const validateForm = useCallback(() => {
    setError(null);

    const validations = [
      { condition: !formData.name.trim(), message: "Name is required" },
      { 
        condition: !formData.nic.trim() || formData.nic.length < MIN_NIC_LENGTH, 
        message: `Valid NIC (at least ${MIN_NIC_LENGTH} characters) is required` 
      },
      { 
        condition: !formData.number.trim() || formData.number.length < MIN_PHONE_LENGTH, 
        message: `Valid phone number (at least ${MIN_PHONE_LENGTH} digits) is required` 
      },
      { condition: !formData.hospital.trim(), message: "Hospital is required" },
      { condition: !formData.department.trim(), message: "Department is required" },
      { condition: !formData.date, message: "Date is required" },
      { condition: !formData.time, message: "Time is required" },
      { condition: !formData.location, message: "Location is required" },
      { condition: !slotId || isNaN(slotId), message: "Invalid slot selection" }
    ];

    const failedValidation = validations.find(v => v.condition);
    if (failedValidation) {
      setError(failedValidation.message);
      return false;
    }

    return true;
  }, [formData, slotId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
  
    if (!token) {
      navigate('/SignIn');
      return;
    }

    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const bookingPayload = {
        name: formData.name.trim(),
        NIC: formData.nic.trim(),
        number: formData.number.trim(),
        hospital: formData.hospital.trim(),
        department: formData.department.trim(),
        location: formData.location || 'Main Office',
        date: formData.date,
        time: formData.time,
        slot_id: parseInt(slotId, 10)
      };
  
      const bookingResponse = await api.post("/bookings", bookingPayload);
      if (!bookingResponse.data?.patient?.id) {
        throw new Error("Patient booking failed - no ID returned");
      }
      const patientId = bookingResponse.data.patient.id;
  
      const slotResponse = await api.post(`/slots/${slotId}/book`, {
        user_id: patientId,
        location: bookingPayload.location
      });
  
      setSuccess(true);
      setBookingInfo({
        patient: bookingResponse.data.patient,
        slot: slotResponse.data.slot
      });
  
      setQrCodeData({
        slotId: parseInt(slotId, 10),
        patientId: parseInt(patientId, 10)
      });
  
    } catch (err) {
      let errorMessage = "Booking failed. Please try again.";
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data?.error ||
                        err.response.data?.message ||
                        "Invalid data submitted";
        } else if (err.response.status === 401) {
          navigate('/SignIn');
          return;
        } else if (err.response.status === 409) {
          errorMessage = "This slot is no longer available";
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
      }
  
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, slotId, validateForm, token, navigate]);

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
      <div className="bg-white flex flex-col items-center p-4 sm:p-6 mt-[10px] sm:mt-[60px] rounded-lg">
        <TealWaveBackground/>
        <BrushTealWaves/>
        <div className="w-full max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-500">Booking</h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mt-1">Appointment</h2>
          <p className="mt-1 text-gray-400 text-sm sm:text-base">Book slot with date & time</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3 sm:space-y-4 mt-6 sm:mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm sm:text-base">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm sm:text-base">
              Appointment booked successfully!
            </div>
          )}

          <input 
            type="text" 
            name="name"
            placeholder="Name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
            required
          />
          
          <input 
            type="text" 
            name="nic"
            placeholder="NIC" 
            value={formData.nic}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
            required
            minLength={MIN_NIC_LENGTH}
          />
          
          <input 
            type="tel" 
            name="number"
            placeholder="Mobile Number" 
            value={formData.number}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
            required
            minLength={MIN_PHONE_LENGTH}
          />
          
          <input 
            type="text" 
            name="hospital"
            placeholder="Hospital" 
            value={formData.hospital}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
            required
          />
          
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
            required
            disabled={configLoading}
          >
            {configLoading ? (
              <option value="">Loading...</option>
            ) : (
              availableDepartments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))
            )}
          </select>
          
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            required
            disabled={configLoading || availableLocations.length === 0}
          >
            {availableLocations.length === 0 ? (
              <option value="">Loading locations...</option>
            ) : (
              <>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </>
            )}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
              required
              min={new Date().toISOString().split('T')[0]}
            />
            <input 
              type="time" 
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base" 
              required
              min={WORKING_HOURS.start}
              max={WORKING_HOURS.end}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-300' : 'bg-teal-500 hover:bg-teal-600 text-white'} transition-colors py-3 rounded-lg font-semibold text-sm sm:text-base`}
          >
            {loading ? 'Booking...' : configLoading ? 'Loading...' : 'Book Now'}
          </button>
        </form>

        {success && qrCodeData && bookingInfo && (
          <div ref={qrCodeSectionRef}
          className="w-full max-w-lg mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-center mb-3 sm:mb-4">Your Booking QR Code</h3>
            
            <div className="flex flex-col items-center">
              <div 
                className="p-3 sm:p-4 bg-white rounded-lg border border-gray-300 mb-3 sm:mb-4"
                ref={qrCodeRef}
              >
                <QRCodeCanvas
                  value={JSON.stringify(qrCodeData)}
                  size={window.innerWidth < 640 ? 160 : 200}
                  level="H"
                  includeMargin
                />
              </div>
              
              <div className="w-full space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                <p><strong>Booking ID:</strong> {bookingInfo.patient.id}</p>
                <p><strong>Patient:</strong> {bookingInfo.patient.name}</p>
                <p><strong>NIC:</strong> {bookingInfo.patient.nic}</p>
                <p><strong>Hospital:</strong> {bookingInfo.patient.hospital}</p>
                <p><strong>Department:</strong> {bookingInfo.patient.department}</p>
                <p><strong>Date & Time:</strong> {formData.date} {formData.time}</p>
                <p><strong>Location:</strong> {bookingInfo.slot.location}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
                <button 
                  onClick={downloadQRCode}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base flex-1"
                >
                  Download QR Code
                </button>
                <button 
                  onClick={() => navigate(`/queue`)}
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base flex-1"
                >
                  Track Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingAppointment;