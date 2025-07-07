import React from 'react';

interface TimeInputProps {
  hours: string;
  minutes: string;
  seconds: string;
  onHoursChange: (h: string) => void;
  onMinutesChange: (m: string) => void;
  onSecondsChange: (s: string) => void;
  disabled: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({
    hours, minutes, seconds, 
    onHoursChange, onMinutesChange, onSecondsChange, 
    disabled
}) => {
    const createChangeHandler = (handler: (val: string) => void, max: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value === '') {
            handler('0');
            return;
        }
        let numValue = parseInt(value, 10);
        if (numValue > max) numValue = max;
        handler(String(numValue));
    };
    
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();
    
    const commonInputClasses = "w-20 sm:w-24 text-center bg-gray-700 text-white text-2xl rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 transition-all";

    return (
      <div className="flex items-center justify-center space-x-2">
          <input 
              type="text" 
              value={String(hours).padStart(2, '0')} 
              onChange={createChangeHandler(onHoursChange, 99)} 
              onFocus={handleFocus}
              disabled={disabled} 
              className={commonInputClasses}
              aria-label="Hours"
          />
          <span className="text-white text-2xl font-bold select-none">:</span>
          <input 
              type="text" 
              value={String(minutes).padStart(2, '0')} 
              onChange={createChangeHandler(onMinutesChange, 59)} 
              onFocus={handleFocus}
              disabled={disabled} 
              className={commonInputClasses}
              aria-label="Minutes"
          />
          <span className="text-white text-2xl font-bold select-none">:</span>
          <input 
              type="text" 
              value={String(seconds).padStart(2, '0')} 
              onChange={createChangeHandler(onSecondsChange, 59)} 
              onFocus={handleFocus}
              disabled={disabled} 
              className={commonInputClasses}
              aria-label="Seconds"
          />
      </div>
    );
};

export default TimeInput;