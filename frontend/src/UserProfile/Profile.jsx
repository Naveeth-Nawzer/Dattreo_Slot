import React, { useState } from "react";
import qrImage from "../assets/QR.jpeg";
import profileimg from "../assets/Profile.jpeg";
import Records from "../assets/Records.jpeg";

const MedicalRecordsStack = () => {
  return (
    <div className="relative w-[300px] h-[300px] mt-12">
      {[...Array(8)].map((_, i) => (
        <img
          key={i}
          src={Records}
          alt="Medical Record"
          className="absolute rounded-lg shadow-md"
          style={{
            left: i * 15,
            top: i * -10,
            zIndex: 10 - i,
            width: 280,
            height: 280,
            transform: `rotate(${i * 4 - 14}deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      ))}
      <div className="absolute -bottom-10 left-0 w-full text-center text-3xl font-medium text-gray-700">
        Medical Records
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "Henry Cavil",
    nic: "200123400987",
    mobile: "0745635422",
    gmail: "cavil12Hgmail.com",
    editing: false,
  });

  const handleEdit = () => setProfile({ ...profile, editing: true });
  const handleSave = () => setProfile({ ...profile, editing: false });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full mx-auto font-sans bg-[#f9fcfc] px-8 py-12 flex flex-col lg:flex-row justify-center gap-12 box-border overflow-y-auto">
      {/* Left Section */}
      <div className="flex-1 max-w-2xl flex flex-col items-center lg:items-start px-4">
        <div className="text-center lg:text-left mb-12">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="text-[#4CDBB9] block">My</span>
            <span className="block">Profile</span>
          </h1>
          <small className="text-xl md:text-2xl text-gray-600">View your profile</small>
        </div>

        {/* QR Code */}
        <div className="mb-12 lg:mb-24 w-full flex justify-center lg:justify-start">
          <img
            src={qrImage}
            alt="QR Code"
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
        </div>

        {/* Medical Records Stack */}
        <div className="w-full flex justify-center lg:justify-start">
          <MedicalRecordsStack />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 max-w-2xl bg-[#f6fafa] rounded-3xl p-8 md:p-16 shadow-lg flex flex-col items-center">
        <div className="w-full flex justify-center mb-12">
          <img
            src={profileimg}
            alt="Profile"
            className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-[#0A8F70]"
          />
        </div>

        {/* Editable profile fields */}
        <div className="w-full space-y-6">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "NIC", name: "nic", type: "text" },
            { label: "Mobile number", name: "mobile", type: "text" },
            { label: "Gmail", name: "gmail", type: "email" },
          ].map(({ label, name, type }) => (
            <div
              key={name}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#0A8F70] py-4 text-[#4a8c7e]"
            >
              <label className="bg-gradient-to-r from-[#032920] to-[#0A8F70] bg-clip-text text-transparent font-semibold text-lg md:text-xl mb-2 sm:mb-0">
                {label}
              </label>

              {profile.editing ? (
                <input
                  type={type}
                  name={name}
                  value={profile[name]}
                  onChange={handleChange}
                  className="bg-transparent outline-none border-none text-right w-full sm:w-3/5 font-semibold text-[#0A8F70] text-lg md:text-xl"
                />
              ) : (
                <span className="text-lg md:text-xl text-gray-700">{profile[name]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Edit & Save buttons */}
        <div className="mt-12 w-full flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={handleEdit}
            disabled={profile.editing}
            className={`bg-[#0A8F70] text-white rounded-lg px-8 py-4 font-semibold cursor-pointer hover:bg-[#3b6f67] text-lg md:text-xl transition-colors ${
              profile.editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Edit
          </button>

          <button
            onClick={handleSave}
            disabled={!profile.editing}
            className={`bg-[#0A8F70] text-white rounded-lg px-8 py-4 font-semibold cursor-pointer hover:bg-[#3b6f67] text-lg md:text-xl transition-colors ${
              !profile.editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;