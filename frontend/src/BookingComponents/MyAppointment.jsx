import React from "react";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import PageNavigator from "../Components/PageNavigator"

export default function MyAppointment() {
   const routesOrder = [
    "/home",
    "/MyAppointment", 
  ];
  const appointments = [
    {
      name: "Henry Cavil",
      nic: "200123400987",
      mobile: "0745635422",
      hospital: "colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.15 - 11.30"
    },
    {
      name: "Henry Cavil",
      nic: "200123400987",
      mobile: "0745635422",
      hospital: "colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.15 - 11.30"
    }
  ];

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
      <h3 className="text-center text-teal-500 text-lg font-semibold mb-6">Appointments</h3>
      <div className="space-y-6 w-full max-w-2xl">
        {appointments.map((appt, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-100"
          >
            {Object.entries(appt).map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 py-1 text-sm">
                <span className="capitalize text-gray-500">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
