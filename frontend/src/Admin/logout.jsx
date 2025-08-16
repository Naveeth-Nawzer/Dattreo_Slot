import React from "react";
import { Home, Camera, MessageCircle, Settings, LogOut } from "lucide-react";

export default function LogoutConfirmation() {
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
        <div className="bg-gray-300 rounded-xl p-2">
          <LogOut className="text-green-500 w-6 h-6" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8">
        <h1 className="text-2xl font-semibold">
          Admin <span className="font-bold">Settings</span>
        </h1>

        <div className="mt-12 w-full max-w-lg bg-gradient-to-b from-white to-blue-50 p-8 rounded-3xl shadow-lg flex flex-col items-center">
          <p className="text-lg font-semibold mb-8">Do you want Logout?</p>

          <button className="w-40 bg-green-900 hover:bg-green-800 text-white font-semibold py-2 rounded-xl shadow-md mb-4">
            YES
          </button>
          <button className="w-40 bg-green-300 hover:bg-green-400 text-white font-semibold py-2 rounded-xl">
            NO
          </button>
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
