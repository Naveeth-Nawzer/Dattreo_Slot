import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api';
import axios from 'axios'; 

export default function AttendanceScanner() {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(new BrowserMultiFormatReader());
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState({
    userPosition: null,
    currentServing: null,
    totalSpots: 0,
    slots: []
  });

  const fetchQueueStatus = async () => {
    try {
      const res = await api.get('/slots/status');
      setQueueStatus(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load queue status");
    }
  };

  const handleScan = async (scanData) => {
    if (!scanData) {
      console.error('No scan data received');
      return { success: false, error: 'No scan data received' };
    }
  
    try {
      console.log('Raw scanned data:', scanData);
  
      // Handle both object and string input
      let parsedData;
      if (typeof scanData === 'string') {
        try {
          parsedData = JSON.parse(scanData);
        } catch (e) {
          throw new Error('Invalid QR code format - not valid JSON');
        }
      } else if (typeof scanData === 'object' && scanData !== null) {
        parsedData = scanData;
      } else {
        throw new Error('Invalid QR code format');
      }
  
      // Case-insensitive field checking
      const slotId = parsedData.slotId || parsedData.slotid;
      const patientId = parsedData.patientId || parsedData.patientid;
  
      if (!slotId || !patientId) {
        throw new Error('QR code is missing slotId or patientId');
      }
  
      // Prepare payload
      const payload = {
        qrData: JSON.stringify({
          slotId: slotId,
          patientId: patientId
        })
      };
  
      console.log('Sending request with payload:', payload);
  
      const response = await axios.post(
        'http://localhost:5001/api/slots/scan-attendance',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );
  
      console.log('Server response:', response.data);
      
      return {
        success: true,
        data: response.data,
        message: 'Attendance recorded successfully'
      };
  
    } catch (error) {
      console.error('Scan error:', {
        message: error.message,
        error: error,
        response: error.response?.data
      });
      
      return {
        success: false,
        error: error.message,
        details: error.response?.data || null
      };
    }
  };

  useEffect(() => {
    const startScanner = async () => {
      try {
        const devices = await codeReaderRef.current.listVideoInputDevices();
        const selectedDeviceId = devices[0]?.deviceId;
        
        if (videoRef.current) {
          videoRef.current.setAttribute('autoplay', '');
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('muted', '');
        }

        await codeReaderRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) handleScan(JSON.parse(result.getText()));
            if (err && !(err instanceof NotFoundException)) {
              console.error("Scan error:", err);
              setError("Scanning error: " + err.message);
            }
          }
        );
      } catch (err) {
        setError("Camera error: " + err.message);
      }
    };

    fetchQueueStatus();
    startScanner();

    return () => {
      codeReaderRef.current.reset();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Scanner Section */}
      <div className="relative max-w-2xl mx-auto mb-8 rounded-lg overflow-hidden shadow-md">
        <video ref={videoRef} className="w-full h-auto" />
        
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Status Messages */}
      <div className="max-w-2xl mx-auto space-y-4 mb-8">
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        {scanResult && (
          <div className="flex items-center gap-2 p-4 bg-green-100 text-green-700 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Attendance recorded for Slot {scanResult.slotId}</span>
          </div>
        )}
      </div>

      {/* Queue Status */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Current Queue Status</h3>
        </div>

        {/* Metrics */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Your Position</p>
            <p className="text-3xl font-bold text-gray-800">
              {queueStatus.userPosition !== null ? queueStatus.userPosition + 1 : 'N/A'}
              {queueStatus.userPosition !== null && (
                <span className="text-gray-400 text-lg">/{queueStatus.totalSpots}</span>
              )}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Currently Serving</p>
            <p className="text-3xl font-bold text-teal-600">
              {queueStatus.currentServing !== null ? queueStatus.currentServing + 1 : 'None'}
            </p>
          </div>
        </div>

        {/* Queue Visualization */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 mb-8">
        {queueStatus.slots.map((slot) => {
        let slotClasses = "w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-sm ";
        let statusClasses = "text-xs mt-1 ";
  
        if (scanResult?.patientId && slot.user_id === scanResult.patientId) {
        slotClasses += "bg-purple-100 border-2 border-purple-400 ";
        statusClasses += "text-purple-600";
        } else if (slot.status === 'present') {
        slotClasses += "bg-green-100 border-2 border-green-400 ";
        statusClasses += "text-green-600";
        } else if (slot.status === 'serving') {
        slotClasses += "bg-teal-100 border-2 border-teal-400 ";
        statusClasses += "text-teal-600";
        } else if (slot.status === 'booked') {
          slotClasses += "bg-red-100 ";
          statusClasses += "text-red-600";
        }else if (slot.status === 'left') {
            slotClasses += "bg-red-100 ";
            statusClasses += "text-red-600";
        } else {
       slotClasses += "bg-gray-200 ";
       statusClasses += "text-gray-600";
        }

  return (
    <div key={slot.id} className={slotClasses}>
      <div className="font-medium">{slot.slot_number + 1}</div>
      <div className={statusClasses}>
        {scanResult?.patientId && slot.user_id === scanResult.patientId
          ? "You"
          : slot.status === 'present'
            ? "Present"
            : slot.status === 'serving'
              ? "Serving"
              : slot.status === 'booked'
                ? "Booked"
                : "Available"}
      </div>
    </div>
  );
})}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-teal-100 border-2 border-teal-400 mr-2"></div>
            <span className="text-gray-600">Currently Serving</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-100 border-2 border-yellow-400 mr-2"></div>
            <span className="text-gray-600">Your Position</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300 mr-2"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
            <span className="text-gray-600">Available</span>
          </div>

          <div className="flex items-center">
  <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-400 mr-2"></div>
  <span className="text-gray-600">Present</span>
</div>
        </div>
      </div>
    </div>
  );
}