import React from "react";

const appointments = [
  {
    id: "01",
    name: "Henry cavil",
    hospital: "Colombo GH",
    department: "ENT",
    date: "09-08-2025",
    time: "11.15 - 11.30",
    left: true,
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

const LeftIcon = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17v-6m0 0V7m0 4h6m-6 0H7m10 10H7a2 2 0 01-2-2V7a2 2 0 012-2h3"
    />
  </svg>
);

const Sidebar = () => (
  <div className="flex flex-col items-center space-y-8 bg-white rounded-l-3xl p-6 shadow-lg w-20">
    <button className="bg-gray-300 rounded-xl p-3 hover:bg-gray-400 transition">
      <svg
        className="w-6 h-6 text-gray-700"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M3 9.75L12 3l9 6.75v10.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 20.25V9.75z" />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h4l3 8 4-16 3 8h4"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
    <button className="text-teal-600 hover:text-teal-800">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7"
        />
      </svg>
    </button>
  </div>
);

const AppointmentCard = ({
  id,
  name,
  hospital,
  department,
  date,
  time,
  left,
  large,
}) => {
  return (
    // prevent shrinking and make sure the card aligns to the top of the row
    <div
      className={`relative bg-white rounded-3xl p-6 shadow-lg ${large ? "w-[420px] h-[220px]" : "w-[200px] h-[160px]"} flex flex-col justify-between flex-shrink-0 self-start`}
    >
      <div className="absolute top-4 right-6 text-teal-600 font-bold text-2xl select-none">
        {id}
      </div>

      {large ? (
        <>
          <div className="flex space-x-6">
            <div className="flex-1 bg-teal-100 rounded-2xl p-4 text-sm text-gray-700">
              <p className="text-xs text-teal-600">Name</p>
              <p className="font-semibold text-teal-800">{name}</p>

              <div className="mt-3">
                <p className="text-xs text-teal-600">Hospital</p>
                <p className="font-semibold text-teal-800">{hospital}</p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-teal-600">Department</p>
                <p className="font-semibold text-teal-800">{department}</p>
              </div>
            </div>

            <div className="w-24 flex flex-col items-center justify-start space-y-4">
              {left ? (
                <div className="bg-red-500 rounded-xl p-3 flex items-center justify-center text-white text-sm font-semibold w-20">
                  <LeftIcon />
                  <span className="ml-2">Left</span>
                </div>
              ) : (
                <div className="w-20 h-8" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="bg-teal-500 rounded-2xl p-4 w-36 text-white font-semibold text-lg text-center">
              <div className="text-xs">Date</div>
              <div className="text-2xl mt-1">{date}</div>
            </div>
            <div className="bg-teal-500 rounded-2xl p-4 w-36 text-white font-semibold text-lg text-center">
              <div className="text-xs">Time</div>
              <div className="text-2xl mt-1">{time}</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-teal-100 rounded-2xl p-4 text-sm text-gray-700">
            <p className="font-semibold text-teal-800">{name}</p>
            <p className="text-teal-700">{hospital}</p>
            <p className="text-teal-700">{department}</p>
          </div>
          <div className="bg-teal-500 rounded-2xl p-4 mt-3 text-white font-semibold text-sm text-center">
            <div>{date}</div>
            <div className="mt-1">{time}</div>
          </div>
        </>
      )}
    </div>
  );
};

const RightSidebar = () => (
  <div className="flex flex-col justify-between bg-white rounded-r-3xl w-40 h-full shadow-lg">
    <div className="p-6">
      <div className="flex items-center justify-between pb-2 mb-6 border-b border-teal-200">
        <span className="font-semibold text-sm uppercase tracking-wider text-teal-800">Slot</span>
        <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">No Queue</span>
      </div>
      <div className="space-y-4">
        <div className="bg-teal-100 rounded-xl h-10 w-24"></div>
        <div className="bg-teal-100 rounded-xl h-10 w-32"></div>
        <div className="bg-teal-100 rounded-xl h-10 w-20"></div>
        <div className="bg-teal-100 rounded-xl h-10 w-28"></div>
        <div className="bg-teal-100 rounded-xl h-10 w-16"></div>
      </div>
    </div>
    <div className="bg-teal-500 h-20 rounded-br-3xl"></div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="relative">
      {/* Background shapes */}
      <div className="absolute -top-28 -left-28 w-80 h-80 rounded-full bg-teal-200 opacity-40 filter blur-2xl" />
      <div className="absolute -right-40 -bottom-28 w-72 h-72 rounded-full bg-teal-200 opacity-40 filter blur-2xl" />

      <div className="bg-gray-100 rounded-3xl flex shadow-xl max-w-7xl w-full overflow-hidden h-[90vh]">
        <Sidebar />

        <main className="flex-1 p-10 space-y-8 overflow-y-auto">
          <header>
            <p className="text-sm text-gray-600">Admin</p>
            <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          </header>

          {/* NOTE: items-start ensures children align to the top (fixes vertical misalignment) */}
          <div className="flex items-start space-x-8">
            <AppointmentCard {...appointments[0]} large />
            <AppointmentCard {...appointments[1]} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {appointments.slice(2).map((appt) => (
              <div key={appt.id} className="flex flex-col items-center space-y-2">
                <div className="bg-teal-500 rounded-xl w-10 h-10 flex items-center justify-center font-bold text-white text-lg select-none">
                  {appt.id}
                </div>
                <AppointmentCard {...appt} />
              </div>
            ))}
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}