import React from 'react';
import wavebg from '../assets/wavebg.png';

const BrushTealWaves = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <img
        src={wavebg}
        alt="wave background"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BrushTealWaves;
