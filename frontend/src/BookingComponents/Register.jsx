import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import register from '../assets/first_visit.png'

export default function FirstVisitForm() {
  const [passVisible, setPassVisible] = useState(true);
  const navigate = useNavigate();
  const [confirmPassVisible, setConfirmPassVisible] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    emailOrMobile: '',
    passcode: '',
    confirmPasscode: ''
  });

  const validateNIC = (nic) => {
    // Validate Sri Lankan NIC (old 10-digit or new 12-digit format)
    const oldNicPattern = /^[0-9]{9}[vVxX]$/;
    const newNicPattern = /^[0-9]{12}$/;
    return oldNicPattern.test(nic) || newNicPattern.test(nic);
  };

  const validateEmailOrMobile = (value) => {
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate Sri Lankan mobile number (07X, 07XX formats)
    const mobilePattern = /^0[1-9][0-9]{8}$/;
    return emailPattern.test(value) || mobilePattern.test(value);
  };

  const validatePassword = (passcode) => {
  // Only numbers, exactly 6 digits
  const passwordPattern = /^\d{6,}$/;
  return passwordPattern.test(passcode);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!validateNIC(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC number';
    }

    if (!formData.emailOrMobile.trim()) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    } else if (!validateEmailOrMobile(formData.emailOrMobile)) {
      newErrors.emailOrMobile = 'Please enter a valid email or mobile number';
    }

    if (!formData.passcode) {
      newErrors.passcode = 'Passcode is required';
    } else if (!validatePassword(formData.passcode)) {
      newErrors.passcode = 'Passcode must be at least 6 number';
    }

    if (!formData.confirmPasscode) {
      newErrors.confirmPasscode = 'Please confirm your passcode';
    } else if (formData.passcode !== formData.confirmPasscode) {
      newErrors.confirmPasscode = 'Passcodes do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    try {
      console.log('Form submitted:', formData);
      
      const response = await fetch('http://localhost:5001/UserOperation/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include if your API requires authentication
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      localStorage.setItem('userData', JSON.stringify({
        nic: formData.nic,
        emailormobile: formData.emailormobile,
        ...data.user // assuming the API returns additional user data
      }));
      
      // Handle successful registration (redirect, show message, etc.)
      // Example:
      navigate('/home');
      // setSuccessMessage('Registration successful! Please check your email to verify your account.');

    } catch (error) {
      console.error('Registration failed:', error);

                localStorage.removeItem('userData');

      // Handle errors (show to user)
      // Example:
      // setErrorMessage(error.message || 'Registration failed. Please try again.');
    }
  }
};

  return (
    <div className="flex items-center justify-center">
      <TealWaveBackground/>
      <BrushTealWaves/>

      {/* Main card container */}
      <div className="relative bg-[#F7FBFB] rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden">
        {/* Left side form */}
        <div className="p-9 flex flex-col text-start flex-1 max-w-md">
          <h2 className="text-3xl font-medium text-gray-900 mb-8">
            Book Your <br /><span className="text-[#0A8F70] font-bold">First Visit</span>
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-normal text-gray-700">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${errors.name ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]`}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
            </label>

            <label className="block text-sm font-normal text-gray-700">
              NIC Number
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${errors.nic ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]`}
              />
              {errors.nic && <span className="text-red-500 text-xs">{errors.nic}</span>}
            </label>

            <label className="block text-sm font-normal text-gray-700">
              Email / Mobile number
              <input
                type="text"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${errors.emailOrMobile ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]`}
              />
              {errors.emailOrMobile && <span className="text-red-500 text-xs">{errors.emailOrMobile}</span>}
            </label>

            <label className="block text-sm font-normal text-gray-700 relative">
              Pass code
              <input
                type={!passVisible ? "text" : "password"}
                name="passcode"
                value={formData.passcode}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${errors.passcode ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 pr-8 bg-[#F7FBFB]`}
              />
              <button
                type="button"
                onClick={() => setPassVisible(!passVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
              >
                {passVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.passcode && <span className="text-red-500 text-xs">{errors.passcode}</span>}
            </label>

            <label className="block text-sm font-normal text-gray-700 relative">
              Confirm Pass code
              <input
                type={!confirmPassVisible ? "text" : "password"}
                name="confirmPasscode"
                value={formData.confirmPasscode}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${errors.confirmPasscode ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 pr-8 bg-[#F7FBFB]`}
              />
              <button
                type="button"
                onClick={() => setConfirmPassVisible(!confirmPassVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
              >
                {confirmPassVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {errors.confirmPasscode && <span className="text-red-500 text-xs">{errors.confirmPasscode}</span>}
            </label>

            <button
              type="submit"
              className="mt-5 bg-[#F7FBFB] border border-teal-300 text-teal-800 font-medium rounded-xl py-3 hover:bg-teal-50 transition-colors"
            >
              Confirm
            </button>
          </form>

          <p className="text-sm font-medium text-gray-800 text-center mt-4">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/SignIn')}
                className="text-teal-600 font-semibold hover:underline hover:text-teal-900"
              >
                Sign in
              </button>
            </p>
        </div>

        <div className="flex items-center justify-center relative flex-1">
          <div className="relative w-80 h-96"></div>
          <img 
            src={register}
            alt="register_img"
            className="w-[450px] h-[550px] mr-[50px]"
          />
        </div>
      </div>
    </div>
  );
}