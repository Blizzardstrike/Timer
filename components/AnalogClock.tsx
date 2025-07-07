import React from 'react';

interface AnalogClockProps {
  time: number;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ time }) => {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600) % 12;

  const secondHandRotation = seconds * 6;
  const minuteHandRotation = minutes * 6 + seconds * 0.1;
  const hourHandRotation = hours * 30 + minutes * 0.5;

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72">
      <div className="w-full h-full bg-gray-800 rounded-full border-4 border-orange-500 shadow-lg flex items-center justify-center">
        {/* Markings */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`hour-${i}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`absolute top-2 left-1/2 -ml-0.5 w-1 h-4 rounded-full ${i % 3 === 0 ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
          </div>
        ))}
        {[...Array(60)].map((_, i) => (
          <div
            key={`minute-${i}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 6}deg)` }}
          >
            <div className={`absolute top-1 left-1/2 -ml-px w-px h-2 ${i % 5 !== 0 ? 'bg-gray-600' : ''}`}></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div className="absolute bottom-1/2 left-1/2 w-1.5 h-16 origin-bottom bg-gray-300 rounded-t-full"
          style={{ transform: `translateX(-50%) rotate(${hourHandRotation}deg)` }}
        />
        {/* Minute Hand */}
        <div className="absolute bottom-1/2 left-1/2 w-1 h-24 origin-bottom bg-gray-300 rounded-t-full"
          style={{ transform: `translateX(-50%) rotate(${minuteHandRotation}deg)` }}
        />
        {/* Second Hand */}
        <div className="absolute bottom-1/2 left-1/2 w-0.5 h-28 origin-bottom bg-orange-500 rounded-t-full"
          style={{ transform: `translateX(-50%) rotate(${secondHandRotation}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-gray-800" />
      </div>
    </div>
  );
};

export default AnalogClock;
