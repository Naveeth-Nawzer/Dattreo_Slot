import React from "react";

export default function BookingAppointment() {
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
      <form className="w-full max-w-lg space-y-4">
        <h3 className="text-center text-teal-500 text-lg font-semibold mb-6">Booking Form</h3>

        <input type="text" placeholder="name" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="text" placeholder="NIC" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="text" placeholder="mobile number" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="text" placeholder="hospital" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <input type="text" placeholder="department" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />

        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <input type="time" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>

        <button type="submit" className="w-full bg-gray-100 hover:bg-teal-500 hover:text-white transition-colors py-3 rounded-lg font-semibold">
          Book Now
        </button>
      </form>
    </div>
  );
}
