import React, { useState, useEffect } from "react";
import qrImage from "../assets/QR.jpeg";
import profileimg from "../assets/Profile.jpeg";
import Records from "../assets/Records.jpeg";
import { useNavigate } from 'react-router-dom';
import PageNavigator from "../Components/PageNavigator"
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from "../Components/BrushTealWaves";


// const MedicalRecordsStack = () => {
//   return (
//     <div className="relative w-[300px] h-[300px] mt-12">
//       {/* {[...Array(8)].map((_, i) => (
//         <img
//           key={i}
//           src={Records}
//           alt="Medical Record"
//           className="absolute rounded-lg shadow-md"
//           style={{
//             left: i * 15,
//             top: i * -10,
//             zIndex: 10 - i,
//             width: 280,
//             height: 280,
//             transform: `rotate(${i * 4 - 14}deg)`,
//             transition: "transform 0.3s ease",
//           }}
//         />
//       ))} */}
//       {/* <div className="absolute -bottom-10 left-0 w-full text-center text-3xl font-medium text-gray-700">
//         Medical Records
//       </div> */}
//     </div>
//   );
// };

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    nic: "",
    emailOrMobile: "",
    editing: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const routesOrder = [
    "/home",
    "/profile",
    "/home",
   ];

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData?.nic) {
      throw new Error("No user data found");
    }

    const response = await fetch(`http://localhost:5001/UserOperation/profile/${userData.nic}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile");
    }

    const data = await response.json();
    
    setProfile({
      name: data.user.name || "",
      nic: data.user.nic || "",
      emailOrMobile: data.user.emailOrMobile || "",
      editing: false
    });

  } catch (err) {
    console.error("Profile fetch error:", err);
    setError(err.message);
  }
};

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => setProfile({ ...profile, editing: true });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("userData"); // clear session
    navigate("/signin"); // redirect to login
  };

  const handleSave = async () => {
    try {
      // Update in backend
      const response = await fetch('http://localhost:5001/UserOperation/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nic: profile.nic,
          name: profile.name,
          emailOrMobile: profile.emailOrMobile,
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      // Update in localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('userData')),
        name: profile.name,
        emailOrMobile: profile.emailOrMobile,
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setProfile({ ...profile, editing: false });

      if (res.data.success) {
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } else {
      alert(res.data.message || "Update failed. Please try again.");
    }
      
    } catch (error) {
      console.error('Update error:', error);
      // Handle error (show message to user)
    }
  };

  

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/signin')}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <PageNavigator routesOrder={routesOrder}/>
      <TealWaveBackground/>
      <BrushTealWaves/>
    <div className="w-full mx-auto font-sans  px-6 py-12 flex flex-col md:flex-row justify-center gap-12 box-border overflow-y-auto">
      {/* Left Section */}
      <div className="flex-1 max-w-md flex flex-col items-center md:items-start px-4  rounded-3xl">
        <div className="text-center lg:text-left mb-16">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            <span className="text-[#4CDBB9] block">My</span>
            <span className="block">Profile</span>
          </h1>
          <small className="text-lg md:text-lg text-gray-400">View your profile</small>
        </div>

        {/* QR Code */}
        <div className="mb-12 lg:mb-24 w-full flex justify-center md:justify-center">
          <img
            src={qrImage}
            alt="QR Code"
            className="w-40 h-40 md:w-30 md:h-30 object-contain"
          />
        </div>

        {/* Medical Records Stack */}
        {/* <div className="w-full flex justify-center lg:justify-start">
          <MedicalRecordsStack />
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex-1 max-w-xl bg-[#f6fafa] rounded-3xl p-2 md:p-4 shadow-lg flex flex-col items-center">
        <div className="w-full flex justify-center mb-12">
          <img
            src={profileimg}
            alt="Profile"
            className="w-40 h-40 md:w-40 md:h-40 object-cover rounded-full border-4 border-[#0A8F70]"
          />
        </div>

        {/* Editable profile fields */}
        <div className="w-full space-y-6">
          {[
            { label: "Name", name: "name", type: "text", editable: true },
            { label: "NIC", name: "nic", type: "text", editable: false },
            { label: "Mobile number or Email", name: "emailOrMobile", type: "text", editable: true },
          ].map(({ label, name, type, editable }) => (
            <div
              key={name}
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#0A8F70] py-2 text-[#4a8c7e]"
            >
              <label className="bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent font-medium text-md md:text-lg mb-2 sm:mb-0">
                {label}
              </label>

              {profile.editing && editable ? (
                <input
                  type={type}
                  name={name}
                  value={profile[name]}
                  onChange={handleChange}
                  className="bg-transparent outline-none border-none text-right w-full sm:w-3/5 font-semibold text-[#0A8F70] text-md md:text-lg"
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
            className={`bg-[#0A8F70] text-white rounded-lg px-6 py-4 font-semibold cursor-pointer hover:bg-[#3b6f67] text-lg md:text-md transition-colors ${
              profile.editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Edit
          </button>

          <button
            onClick={handleSave}
            disabled={!profile.editing}
            className={`bg-[#0A8F70] text-white rounded-lg px-6 py-4 font-semibold cursor-pointer hover:bg-[#3b6f67] text-lg md:text-md transition-colors ${
              !profile.editing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save
          </button>

          <button
              onClick={handleLogout}
              className="bg-red-600 text-white rounded-lg px-6 py-4 font-semibold cursor-pointer hover:bg-red-700 text-lg md:text-lg transition-colors"
            >
              Logout
            </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;