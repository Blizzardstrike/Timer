import React from 'react';
import { TimerState } from '../types';

interface TimerControlsProps {
  timerState: TimerState;
  limit: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  onAddTime: (seconds: number) => void;
  onAcknowledge: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ timerState, limit, onStart, onPause, onStop, onReset, onAddTime, onAcknowledge }) => {
    const baseButtonClasses = "px-6 py-2 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transform active:scale-95";
    const orangeButton = "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500";
    const grayButton = "bg-gray-600 text-gray-200 hover:bg-gray-700 focus:ring-gray-500";
    const disabledClass = "opacity-50 cursor-not-allowed";

    if (timerState === TimerState.FINISHED) {
        const hexagonButtonClasses = "relative w-36 h-[155px] flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transform active:scale-95";
        return (
            <div className="flex flex-col justify-center items-center gap-4 mt-8 w-full">
                <p className="text-lg text-green-400 animate-pulse font-semibold">Timer Complete!</p>
                <button 
                    onClick={onAcknowledge} 
                    className={hexagonButtonClasses} 
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    aria-label="Dismiss timer alarm"
                >
                    Dismiss
                </button>
                {/* Add time buttons for the "snooze" functionality */}
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button onClick={() => onAddTime(30)} className={`${baseButtonClasses} !w-28 ${grayButton}`}>+30s</button>
                    <button onClick={() => onAddTime(60)} className={`${baseButtonClasses} !w-28 ${grayButton}`}>+1min</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 w-full">
            {timerState === TimerState.IDLE && 
                <button onClick={onStart} disabled={limit <= 0} className={`${baseButtonClasses} w-32 ${orangeButton} ${limit <= 0 ? disabledClass : ''}`}>Start</button>}
            
            {timerState === TimerState.RUNNING && 
                <button onClick={onPause} className={`${baseButtonClasses} w-32 ${orangeButton}`}>Pause</button>}

            {timerState === TimerState.PAUSED && 
                <button onClick={onStart} className={`${baseButtonClasses} w-32 ${orangeButton}`}>Resume</button>}
            
            <button onClick={onStop} disabled={timerState === TimerState.IDLE} className={`${baseButtonClasses} w-32 ${grayButton} ${timerState === TimerState.IDLE ? disabledClass : ''}`}>Stop</button>

            <button onClick={onReset} className={`${baseButtonClasses} w-32 ${grayButton}`}>Reset</button>

            {/* Quick Add Time Buttons */}
            <div className="w-full border-t border-gray-700 my-4"></div>
            
            <button onClick={() => onAddTime(30)} className={`${baseButtonClasses} !w-28 ${grayButton}`}>+30s</button>
            <button onClick={() => onAddTime(60)} className={`${baseButtonClasses} !w-28 ${grayButton}`}>+1min</button>
        </div>
    );
};

export default TimerControls;