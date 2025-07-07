import React from 'react';

const Sunflower: React.FC = () => {
  const petalClasses = 'absolute w-12 h-24 bg-yellow-500 rounded-[50%]';
  const innerPetalClasses = 'absolute w-10 h-20 bg-orange-500 rounded-[50%]';
  const numPetals = 16;

  return (
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center animate-pulse duration-[3000ms]">
      {/* Outer Petals */}
      {[...Array(numPetals)].map((_, i) => (
        <div
          key={`outer-petal-${i}`}
          className="absolute w-full h-full flex justify-center"
          style={{ transform: `rotate(${i * (360 / numPetals)}deg)` }}
        >
          <div className={`${petalClasses} top-0`}></div>
        </div>
      ))}
      {/* Inner Petals */}
      {[...Array(numPetals)].map((_, i) => (
        <div
          key={`inner-petal-${i}`}
          className="absolute w-full h-full flex justify-center"
          style={{ transform: `rotate(${(i * (360 / numPetals)) + (360 / numPetals / 2)}deg) scale(0.8)` }}
        >
          <div className={`${innerPetalClasses} top-4`}></div>
        </div>
      ))}
      {/* Center */}
      <div className="absolute w-32 h-32 bg-yellow-900/80 rounded-full border-4 border-yellow-900 shadow-inner flex items-center justify-center">
         {/* Center pattern using radial gradients for a seed-like effect */}
         <div className="w-full h-full rounded-full" style={{
            backgroundImage: 'radial-gradient(rgb(72, 44, 20) 1px, transparent 2px), radial-gradient(rgb(101, 67, 33) 1px, transparent 2px)',
            backgroundSize: '10px 10px, 10px 10px',
            backgroundPosition: '0 0, 5px 5px'
         }}></div>
      </div>
    </div>
  );
};

export default Sunflower;
