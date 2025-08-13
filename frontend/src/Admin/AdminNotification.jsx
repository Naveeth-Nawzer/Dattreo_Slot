import React, { useState } from "react";

const categories = [
  { key: "queue", label: "Queue Status Updates" },
  { key: "delay", label: "Delay Notifications" },
  { key: "appointment", label: "Appointment Reminders" },
  { key: "token", label: "Token & Service Completion" },
  { key: "courtesy", label: "General Courtesy Messages" },
];

const messagesByCategory = {
  queue: [
    "Your turn is coming soon. Please be ready.",
    "You have been moved up in the queue.",
  ],
  delay: ["Doctor is on a short break. Your turn will resume shortly."],
  appointment: [
    "Your consultation is complete. Thank you for visiting.",
    "Your turn is now closed. Please rebook if needed.",
  ],
  token: [
    "Token issued for your visit. Please keep it handy.",
    "Your service is complete. Thank you!",
  ],
  courtesy: [
    "Thank you for visiting – we appreciate your time.",
    "We hope you had a comfortable experience. Take care!",
  ],
};

function LeftRail() {
  return (
    <aside className="w-20 bg-white rounded-l-3xl p-4 shadow-lg flex flex-col items-center gap-6">
      {/* top spacer for rounded look */}
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
        {/* home */}
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9.75L12 3l9 6.75v10.5a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 20.25V9.75z" />
        </svg>
      </div>

      <button className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
        <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="3" />
        </svg>
      </button>

      <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition">
        <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>

      <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center hover:bg-gray-50 transition">
        <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      <div className="mt-auto w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
        <svg className="w-5 h-5 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
        </svg>
      </div>
    </aside>
  );
}

function NotificationPill({ text }) {
  return (
    <div className="relative">
      {/* subtle left highlight shape */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 w-28 h-8 rounded-full bg-gradient-to-r from-white/90 to-sky-50 opacity-80 blur-[6px]" />
      <div className="relative bg-gradient-to-r from-white to-sky-50 rounded-3xl py-4 px-6 shadow-lg text-gray-800 text-sm">
        {text}
      </div>
    </div>
  );
}

function RightPanel({ selected, onSelect }) {
  return (
    <aside className="w-64 bg-white rounded-r-3xl shadow-lg p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          {/* small placeholder logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold">S</div>
            <div className="text-sm font-semibold">slot</div>
          </div>
          <div className="text-xs px-3 py-1 rounded-full border border-teal-100 text-teal-700">No queue</div>
        </div>

        <div className="space-y-3">
          {categories.map((c) => {
            const active = c.key === selected;
            return (
              <button
                key={c.key}
                onClick={() => onSelect(c.key)}
                className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between ${
                  active
                    ? "border-2 border-teal-200 bg-white text-teal-700 shadow"
                    : "border border-teal-100 bg-white/80 text-gray-700 hover:bg-teal-50"
                }`}
                aria-pressed={active}
              >
                <span className="text-sm">{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-12 bg-teal-600 rounded-b-2xl mt-6" />
    </aside>
  );
}

export default function AdminNotifications() {
  const [selected, setSelected] = useState("queue");

  // use the selected category messages, fallback to a generic list
  const list = messagesByCategory[selected] ?? [
    "Your consultation is complete. Thank you for visiting.",
    "Your turn is coming soon. Please be ready.",
    "You have been moved up in the queue.",
    "Doctor is on a short break. Your turn will resume shortly.",
    "Your turn is now closed. Please rebook if needed.",
  ];

  return (
    <div className="min-h-screen bg-[#eef6f4] p-8 flex items-center justify-center">
      {/* container */}
      <div className="relative w-full max-w-7xl bg-gray-50 rounded-3xl shadow-2xl overflow-hidden h-[86vh]">
        {/* decorative svg curves behind content */}
        <svg className="absolute -top-20 -left-20 w-96 h-96 opacity-10" viewBox="0 0 300 300" fill="none">
          <path d="M0 150 C60 0, 240 0, 300 150 C240 300, 60 300, 0 150Z" fill="#34D399" />
        </svg>
        <svg className="absolute -bottom-24 -right-24 w-80 h-80 opacity-8" viewBox="0 0 200 200" fill="none">
          <path d="M0 100 C40 0, 160 0, 200 100 C160 200, 40 200, 0 100Z" fill="#60A5FA" />
        </svg>

        <div className="flex h-full">
          <LeftRail />

          <main className="flex-1 p-10 overflow-auto">
            <header>
              <p className="text-sm text-gray-600">Admin</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Per defined Notifications</h1>
            </header>

            <div className="mt-8 max-w-3xl space-y-6">
              {list.map((msg, i) => (
                <NotificationPill key={i} text={msg} />
              ))}
            </div>
          </main>

          <RightPanel selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}