import React from "react";
import { User } from "lucide-react";

export default function TrackQueue() {
  // Queue data
  const userPosition = 12; // 0-based index (13th position)
  const totalSpots = 50;
  const currentServing = 5; // Currently serving position 5 (6th person)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-[#FBFBFB] shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-gray-800">sl</span>
            <span className="text-teal-600">o</span>
            <span className="text-gray-800">t</span>
          </div>
          <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <li className="cursor-pointer hover:text-teal-600 transition-colors">HOME</li>
            <li className="cursor-pointer hover:text-teal-600 transition-colors">Book Appointment</li>
            <li className="cursor-pointer hover:text-teal-600 transition-colors">My Appointments</li>
            <li className="cursor-pointer text-teal-600 font-semibold">Track Queue</li>
          </ul>
          <div className="flex items-center space-x-4">
            <button className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm hover:bg-teal-700 transition-colors">
              En
            </button>
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
              <User size={18} className="text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-teal-600">Track</h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1">Queue</h2>
            <p className="mt-2 text-gray-600">Your current position in the queue</p>
          </div>

          {/* Queue Status */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-gray-500 text-sm">Your position</p>
                <p className="text-3xl font-bold text-gray-800">
                  {userPosition + 1}<span className="text-gray-400 text-lg">/{totalSpots}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Currently serving</p>
                <p className="text-3xl font-bold text-teal-600">{currentServing + 1}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Estimated wait time</p>
                <p className="text-3xl font-bold text-gray-800">~15 min</p>
              </div>
            </div>
          </div>

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

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-100 border border-green-300 mr-2"></div>
                <span className="text-gray-600">Served</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
                <span className="text-gray-600">Currently serving</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
                <span className="text-gray-600">Your position</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                <span className="text-gray-600">Waiting</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}