import React, { useState, useEffect } from "react";
import axios from "axios";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import PageNavigator from "../Components/PageNavigator"

export default function MyAppointment() {
  const routesOrder = [
    "/home",
    "/MyAppointment", 
  ];
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData?.nic) {
          setError("No user NIC found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/bookings/patientappointment`,
          { params: { nic: userData.nic } }
        );
        
        if (response.data?.success) {
          setAppointments(response.data.appointments || []);
        } else {
          setError(response.data?.message || "No appointments data received");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch appointments");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // Return original if formatting fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-teal-500 text-xl">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
      <div className="min-h-screen bg-white flex flex-col items-center p-6">
        <TealWaveBackground/>
        <BrushTealWaves/>
        {/* Heading */}
        <div className="w-full max-w-2xl">
          <h1 className="text-5xl font-bold text-teal-500">My</h1>
          <h2 className="text-4xl font-bold text-black mt-1">Appointment</h2>
          <p className="mt-1 text-gray-600">View your Appointments</p>
          <hr className="my-6" />
        </div>

        {/* Appointments */}
        <h3 className="text-center text-teal-500 text-lg font-semibold mb-6">
          Appointments
        </h3>
        
        {!appointments || appointments.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            You have no upcoming appointments
          </div>
        ) : (
          <div className="space-y-6 w-full max-w-2xl">
            {appointments.map((appt, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
              >
                {Object.entries(appt).map(([label, value]) => {
                  // Skip qrCodeUrl from the main display if it's null/undefined
                  if (label === 'qrCodeUrl' && (!value || value)) return null;
                  if (label === 'patientId') return null;
                  
                  // Format date fields
                  if (label === 'appointmentDate' || label === 'bookingDate') {
                    value = formatDate(value);
                  }
                  
                  return (
                    <div key={label} className="grid grid-cols-2 py-1 text-sm">
                      <span className="capitalize text-gray-500">{label}</span>
                      <span className="text-gray-800 font-medium">{value || 'N/A'}</span>
                    </div>
                  );
                })}
                
                {/* QR Code Display */}
                {appt.qrCodeUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-500 mb-2">Appointment QR Code</p>
                      <img 
                        src={`http://localhost:5001/${appt.qrCodeUrl}`} 
                        alt="Appointment QR Code" 
                        className="w-32 h-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}