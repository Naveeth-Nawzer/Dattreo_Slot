import React, { useState } from "react";
import { Home, Camera, MessageCircle, Settings, LogOut } from "lucide-react";

export default function AdminSettings() {
  const [adminName, setAdminName] = useState("");
  const [adminID, setAdminID] = useState("");
  const [adminNIC, setAdminNIC] = useState("");

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-b from-white to-blue-50 rounded-3xl flex flex-col justify-between items-center py-6 shadow-md">
        <div className="flex flex-col space-y-8 items-center">
          <Home className="text-green-500 w-6 h-6" />
          <Camera className="text-green-500 w-6 h-6" />
          <MessageCircle className="text-green-500 w-6 h-6" />
          <div className="bg-gray-300 rounded-xl p-2">
            <Settings className="text-gray-700 w-6 h-6" />
          </div>
        </div>
        <LogOut className="text-green-500 w-6 h-6" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-semibold">
          Admin <span className="font-bold">Settings</span>
        </h1>

        <div className="mt-8 w-full max-w-lg bg-gradient-to-b from-white to-blue-50 p-8 rounded-3xl shadow-lg">
          {/* Input Fields */}
          <div className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Admin Name</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Admin ID</label>
              <input
                type="text"
                value={adminID}
                onChange={(e) => setAdminID(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Admin NIC</label>
              <input
                type="text"
                value={adminNIC}
                onChange={(e) => setAdminNIC(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 mt-8">
            <button className="flex-1 bg-green-300 hover:bg-green-400 text-white font-semibold py-2 rounded-xl">
              Edit
            </button>
            <button className="flex-1 bg-green-900 hover:bg-green-800 text-white font-semibold py-2 rounded-xl shadow-md">
              Save
            </button>
          </div>
        </div>
      </main>

      {/* Logo Area */}
      <aside className="w-40 flex items-center justify-center bg-white rounded-3xl shadow-md">
        <img
          src="/logo.png"
          alt="Slot Med Queue Logo"
          className="max-w-[100px] object-contain"
        />
      </aside>
    </div>
  );
}
