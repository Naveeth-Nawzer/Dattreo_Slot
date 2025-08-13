import React from "react";
import { Home, ClipboardList, MessageSquare, Settings, LogOut, Clock } from "lucide-react";

export default function AdminDashboard() {
  const appointments = [
    {
      id: "01",
      name: "Henry Cavil",
      hospital: "Colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.15 - 11.30",
      status: "Left",
    },
    {
      id: "02",
      name: "Margot Robbie",
      hospital: "Colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.30 - 11.45",
    },
    {
      id: "03",
      name: "Margot Robbie",
      hospital: "Colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.45 - 12.00",
    },
    {
      id: "04",
      name: "Margot Robbie",
      hospital: "Colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.45 - 12.00",
    },
    {
      id: "05",
      name: "Margot Robbie",
      hospital: "Colombo GH",
      department: "ENT",
      date: "09-08-2025",
      time: "11.45 - 12.00",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-b from-teal-50 to-white flex flex-col justify-between py-6 shadow-md rounded-r-2xl">
        <div className="flex flex-col items-center gap-6">
          <button className="p-3 hover:bg-teal-100 rounded-xl">
            <Home className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl">
            <ClipboardList className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl">
            <MessageSquare className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl">
            <Settings className="w-6 h-6 text-teal-700" />
          </button>
        </div>
        <button className="p-3 hover:bg-teal-100 rounded-xl">
          <LogOut className="w-6 h-6 text-teal-700" />
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Admin <span className="font-extrabold">Dashboard</span>
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {appointments.slice(0, 2).map((appt) => (
            <div
              key={appt.id}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 relative"
            >
              <span className="absolute top-4 right-4 text-gray-400 font-bold">
                {appt.id}
              </span>
              <div>
                <p className="font-semibold text-teal-700">{appt.name}</p>
                <p className="text-gray-600">{appt.hospital}</p>
                <p className="text-gray-600">{appt.department}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
                  {appt.date}
                </div>
                <Clock className="text-teal-500" />
                <div className="bg-teal-100 px-4 py-2 rounded-xl font-semibold">
                  {appt.time}
                </div>
              </div>
              {appt.status && (
                <div className="absolute top-4 right-12 bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                  {appt.status}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lower cards */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {appointments.slice(2).map((appt) => (
            <div
              key={appt.id}
              className="bg-white shadow-md rounded-2xl p-4 relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-xl font-bold">
                {appt.id}
              </span>
              <p className="font-semibold text-teal-700 mt-4">{appt.name}</p>
              <p className="text-gray-600">{appt.hospital}</p>
              <p className="text-gray-600">{appt.department}</p>
              <div className="mt-3 bg-teal-100 px-4 py-2 rounded-xl font-semibold">
                {appt.date} {appt.time}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right panel */}
      <aside className="w-28 bg-white flex flex-col justify-around items-center py-6">
        <div className="w-16 h-10 bg-teal-400 rounded-xl"></div>
        <div className="w-16 h-10 bg-teal-400 rounded-xl"></div>
        <div className="w-16 h-10 bg-teal-400 rounded-xl"></div>
        <div className="w-16 h-10 bg-teal-400 rounded-xl"></div>
        <div className="w-16 h-10 bg-teal-400 rounded-xl"></div>
      </aside>
    </div>
  );
}
