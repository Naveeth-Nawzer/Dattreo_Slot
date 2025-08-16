import React from "react";
import { Home, ClipboardList, MessageSquare, Settings, LogOut, User } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";

export default function AdminQueue() {
  // Queue data
  const totalSpots = 20; // total positions in the queue
  const currentServing = 5; // currently serving position (0-indexed)
  const userPosition = 8; // logged-in user's position (0-indexed)

  return (
    <div className="flex min-h-screen bg-transparent relative">
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
          Admin <span className="font-extrabold">Track Queue</span>
        </h1>

        {/* Queue Visualization */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Queue Positions</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {Array.from({ length: totalSpots }).map((_, index) => {
              let spotClass = "bg-gray-200";
              let iconClass = "text-gray-500";

              if (index === userPosition) {
                spotClass = "bg-yellow-100 border-2 border-yellow-400";
                iconClass = "text-yellow-600";
              } else if (index < currentServing) {
                spotClass = "bg-green-100";
                iconClass = "text-green-600";
              } else if (index === currentServing) {
                spotClass = "bg-teal-100 border-2 border-teal-400";
                iconClass = "text-teal-600";
              }

              return (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${spotClass}`}
                  title={`Position ${index + 1}`}
                >
                  <User size={18} className={iconClass} />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
