import React from "react";
import { Home, ClipboardList, MessageSquare, Settings, LogOut } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";

export default function PredefinedNotifications() {
  const notifications = [
    "Your consultation is complete. Thank you for visiting.",
    "Your turn is coming soon. Please be ready.",
    "You have been moved up in the queue.",
    "Doctor is on a short break. Your turn will resume shortly.",
    "Your turn is now closed. Please rebook if needed.",
  ];

  const categories = [
    "Queue Status Updates",
    "Delay Notifications",
    "Appointment Reminders",
    "Token & Service Completion",
    "General Courtesy Messages",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <TealWaveBackground />

      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-b from-teal-50 to-white flex flex-col justify-between py-6 shadow-md rounded-r-2xl z-10">
        <div className="flex flex-col items-center gap-6">
          <button className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
            <Home className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl transition">
            <ClipboardList className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl transition">
            <MessageSquare className="w-6 h-6 text-teal-700" />
          </button>
          <button className="p-3 hover:bg-teal-100 rounded-xl transition">
            <Settings className="w-6 h-6 text-teal-700" />
          </button>
        </div>
        <button className="p-3 hover:bg-teal-100 rounded-xl transition">
          <LogOut className="w-6 h-6 text-teal-700" />
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 z-10">
        <h1 className="text-2xl font-bold mb-8">
          Admin <span className="font-extrabold">Predefined Notifications</span>
        </h1>

        <div className="flex flex-col gap-4">
          {notifications.map((msg, idx) => (
            <div
              key={idx}
              className="bg-transparent px-6 py-4 rounded-full shadow-sm text-gray-800 hover:bg-teal-50 hover:shadow-md transition"
            >
              {msg}
            </div>
          ))}
        </div>
      </main>

      {/* Right panel */}
      <aside className="w-72 bg-white flex flex-col justify-center items-center py-8 gap-6 rounded-l-2xl shadow-lg z-10">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="border border-teal-400 text-gray-800 px-6 py-3 rounded-xl hover:bg-teal-50 cursor-pointer w-56 text-center transition"
          >
            {cat}
          </div>
        ))}
      </aside>
    </div>
  );
}
