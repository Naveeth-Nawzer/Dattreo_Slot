import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import register from '../assets/first_visit.png'

export default function FirstVisitForm() {
  const [passVisible, setPassVisible] = useState(true);
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nic: '',
    passcode: ''
  });

  const validatePasscode = (passcode) => {
    // At least 6 number
    const passwordPattern = /^\d{6,}$/;
    return passwordPattern.test(passcode);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Validate passcode
  if (!formData.nic) {
    setError('NIC is required');
    setIsSubmitting(false);
    return;
  }
    
  if (!formData.passcode || !validatePasscode(formData.passcode)) {
    setError('Passcode must be at least 6 numbers');
    setIsSubmitting(false);
    return;
  }
  
  // If validation passes
  setError('');

  try {
      const response = await fetch('http://localhost:5001/UserOperation/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nic: formData.nic.trim(),
          passcode: formData.passcode
      })
      });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);

    localStorage.setItem('userData', JSON.stringify({
        nic: formData.nic,
        emailormobile: formData.emailormobile,
        ...data.user // assuming the API returns additional user data
      }));
    
    // Handle successful registration (redirect, show success message, etc.)
    // Example:
    navigate('/home'); // If using react-router
    // Or show success state
    
  } catch (error) {
    console.error('Registration error:', error);
    setError(error.message || 'Something went wrong. Please try again.');

          localStorage.removeItem('userData');

  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (e) => {
    setPasscode(e.target.value);
    // Clear error when user starts typing
    if (error) setError('');

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex items-center justify-center">
      <TealWaveBackground/>
      <BrushTealWaves/>

      {/* Main card container */}
      <div className="relative bg-[#F7FBFB] rounded-3xl shadow-lg flex max-w-4xl w-full overflow-hidden mt-[70px]">
        {/* Left side form */}
        <div className="p-12 flex flex-col text-end flex-1 max-w-md">
          <h2 className="text-3xl font-medium text-gray-900 mb-8">
            Continue with <br /><span className="text-[#0A8F70] font-bold">pass code</span>
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-normal text-gray-700 relative text-start">
              NIC Number
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${error.includes('NIC') ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 bg-[#F7FBFB]`}
                disabled={isSubmitting}
              />
            </label>
            <label className="block text-sm font-normal text-gray-700 relative mt-[40px] text-start">
              Pass code
              <input
                type={passVisible ? "password" : "text"}
                name="passcode"
                value={formData.passcode}
                onChange={handleChange}
                className={`mt-1 w-full border-b ${error ? 'border-red-500' : 'border-gray-400'} focus:border-teal-600 outline-none px-0 py-1 pr-8 bg-[#F7FBFB]`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setPassVisible(!passVisible)}
                className="absolute right-0 top-[30px] text-teal-700 hover:text-teal-900"
                disabled={isSubmitting}
              >
                {passVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {error && <span className="text-red-500 text-xs">{error}</span>}
            </label>

            <button
              type="submit"
              className={`mt-[40px] bg-[#F7FBFB] border ${isSubmitting ? 'border-teal-100 text-teal-300' : 'border-teal-300 text-teal-900'} font-medium rounded-xl py-3 hover:bg-teal-50 transition-colors`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm'}
            </button>
          </form>

          <p className="text-sm font-medium text-gray-800 text-center pt-[20px]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="btn btn-link no-underline text-teal-600 font-semibold hover:underline hover:text-teal-900 p-0 mb-1"
              >
                Sign up
              </button>
            </p>
        </div>

        {/* Right side*/}
        <div className="flex items-center justify-center relative flex-1">
          <img 
            src={register}
            alt="register_img"
            className="w-[300px] h-[400px] mr-[30px]"
          />
        </div>
      </div>
    </div>
  );
}