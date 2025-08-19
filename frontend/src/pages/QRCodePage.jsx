import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../Components/Nav';
import axios from 'axios';
import TealWaveBackground from "../Components/TealWaveBackground";
import BrushTealWaves from '../Components/BrushTealWaves'
import PageNavigator from "../Components/PageNavigator"

const QRCodePage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const routesOrder = [
    "/home", 
    "/qr",
    "/home",
   ];

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData?.nic) {
          throw new Error("User not authenticated");
        }

        // Fetch slot with QR code for this user
        const response = await axios.get(
          'http://localhost:5001/api/slots/slots/qrcode',
          { params: { nic: userData.nic } }
        );

        if (response.data.success && response.data.qrCodeUrl) {
          setQrCodeUrl(response.data.qrCodeUrl);
        } else {
          throw new Error("No QR code found for this user");
        }
      } catch (err) {
        setError(err.message || "Failed to load QR code");
        console.error("Error fetching QR code:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-100 text-teal-800 rounded-md hover:bg-teal-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageNavigator routesOrder={routesOrder}/>
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar showLanguageSelector={true} />
      
      <TealWaveBackground/>
      <BrushTealWaves/>
      <main className="flex flex-col items-center justify-center p-8 mt-12">
        <div className="bg-white rounded-3xl p-16 shadow-xl text-center max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-800">
            Your <span className="text-teal-600">QR</span>
          </h1>

          <div className="my-10">
            {qrCodeUrl ? (
              <img
                src={`http://localhost:5001/${qrCodeUrl}`}
                alt="Your Appointment QR Code"
                className="mx-auto w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 mx-auto bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No QR code available</p>
              </div>
            )}
          </div>

          <button 
            onClick={handlePrint}
            className="mt-8 py-4 px-8 rounded-2xl border-2 border-gray-300 text-lg font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            Print your QR
          </button>
        </div>
      </main>
    </div>
    </div>
  );
};

export default QRCodePage;