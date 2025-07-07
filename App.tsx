import React, { useState, useEffect, useCallback } from 'react';
import { TimerState } from './types';
import AnalogClock from './components/AnalogClock';
import TimeInput from './components/TimeInput';
import TimerControls from './components/TimerControls';
import Sunflower from './components/Sunflower';

// --- Audio and Speech Synthesis Helpers ---

/**
 * Plays a simple, pleasant jingle using the Web Audio API.
 */
const playJingle = () => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.type = 'sine';
    const now = audioContext.currentTime;

    // A simple three-note ascending arpeggio
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((note, index) => {
        const startTime = now + index * 0.2;
        oscillator.frequency.setValueAtTime(note, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + 0.18);
    });

    oscillator.start(now);
    oscillator.stop(now + 1);
};

/**
 * Speaks the given text using the Web Speech API.
 * @param text The text to be spoken.
 */
const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) return; // Don't interrupt if already speaking
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }
};


const App: React.FC = () => {
    const [timeRemaining, setTimeRemaining] = useState(0); // remaining time in seconds
    const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
    const [elapsedAfterFinish, setElapsedAfterFinish] = useState(0);

    const [inputHours, setInputHours] = useState('0');
    const [inputMinutes, setInputMinutes] = useState('0');
    const [inputSeconds, setInputSeconds] = useState('0');
    
    const limit = parseInt(inputHours, 10) * 3600 + parseInt(inputMinutes, 10) * 60 + parseInt(inputSeconds, 10);

    const formatTime = (totalSeconds: number): string => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // Main timer countdown effect
    useEffect(() => {
        let intervalId: number | undefined;
        if (timerState === TimerState.RUNNING) {
            intervalId = window.setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        setTimerState(TimerState.FINISHED);
                        return 0; 
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [timerState]);

    // Effect for looping alarm sounds and counting elapsed time when finished
    useEffect(() => {
        let soundIntervalId: number | undefined;
        let elapsedIntervalId: number | undefined;

        if (timerState === TimerState.FINISHED) {
            const playSounds = () => {
                playJingle();
                speak("timer's up!");
            };
            playSounds();
            // User requested quicker, continuous sound. The sounds take ~2s. 2.5s interval is near-continuous.
            soundIntervalId = window.setInterval(playSounds, 2500); 

            elapsedIntervalId = window.setInterval(() => {
                setElapsedAfterFinish(prev => prev + 1);
            }, 1000);

        }
        
        return () => {
            clearInterval(soundIntervalId);
            clearInterval(elapsedIntervalId);
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [timerState]);


    const handleStartResume = useCallback(() => {
        if (timerState === TimerState.IDLE) {
            if (limit > 0) {
                setTimeRemaining(limit);
                setTimerState(TimerState.RUNNING);
            }
        } else if (timerState === TimerState.PAUSED) {
            setTimerState(TimerState.RUNNING);
        }
    }, [limit, timerState]);

    const handlePause = useCallback(() => {
        setTimerState(TimerState.PAUSED);
    }, []);

    const handleStop = useCallback(() => {
        setTimerState(TimerState.IDLE);
        setTimeRemaining(0);
        setElapsedAfterFinish(0);
    }, []);

    const handleReset = useCallback(() => {
        setTimerState(TimerState.IDLE);
        setTimeRemaining(0);
        setElapsedAfterFinish(0);
        setInputHours('0');
        setInputMinutes('0');
        setInputSeconds('0');
    }, []);
    
    const handleAcknowledge = useCallback(() => {
        setTimerState(TimerState.IDLE);
        setElapsedAfterFinish(0);
    }, []);

    const handleAddTime = useCallback((secondsToAdd: number) => {
        if (timerState === TimerState.FINISHED) {
            // Stop alarm, reset elapsed counter, set new countdown, and start running
            setElapsedAfterFinish(0);
            setTimeRemaining(secondsToAdd);
            setTimerState(TimerState.RUNNING);
        } else if (timerState === TimerState.RUNNING || timerState === TimerState.PAUSED) {
            // Add time to a running/paused timer
            setTimeRemaining(prev => Math.max(0, prev + secondsToAdd));
        } else { // IDLE state
            // Add time to the input fields when idle
            const currentLimit = parseInt(inputHours, 10) * 3600 + parseInt(inputMinutes, 10) * 60 + parseInt(inputSeconds, 10);
            const newLimit = Math.max(0, currentLimit + secondsToAdd);

            const h = Math.floor(newLimit / 3600);
            const m = Math.floor((newLimit % 3600) / 60);
            const s = newLimit % 60;

            setInputHours(String(h > 99 ? 99 : h));
            setInputMinutes(String(m));
            setInputSeconds(String(s));
        }
    }, [timerState, inputHours, inputMinutes, inputSeconds]);

    // Determine what time and string to display
    let timeToShow: number;
    let displayString: string;

    if (timerState === TimerState.FINISHED) {
        timeToShow = elapsedAfterFinish;
        displayString = `+${formatTime(timeToShow)}`;
    } else {
        timeToShow = timerState === TimerState.IDLE ? limit : timeRemaining;
        displayString = formatTime(timeToShow);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans antialiased">
            <div className="w-full max-w-md mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl sm:text-5xl font-bold text-orange-500 font-mono">Analog Timer</h1>
                    <p className="text-gray-400 mt-2">Set a limit and watch the time go by.</p>
                </header>
                
                <main className="flex flex-col items-center">
                    {timerState === TimerState.FINISHED ? (
                        <Sunflower />
                    ) : (
                        <AnalogClock time={timeToShow} />
                    )}
                    
                    <div className="my-6 text-6xl sm:text-7xl font-mono tracking-wider text-orange-400">
                        {displayString}
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-xl w-full">
                        <h2 className="text-xl font-semibold text-center text-gray-300 mb-4">Set Timer Limit</h2>
                        <TimeInput 
                            hours={inputHours}
                            minutes={inputMinutes}
                            seconds={inputSeconds}
                            onHoursChange={setInputHours}
                            onMinutesChange={setInputMinutes}
                            onSecondsChange={setInputSeconds}
                            disabled={timerState !== TimerState.IDLE}
                        />
                    </div>
                    
                    <TimerControls
                        timerState={timerState}
                        limit={limit}
                        onStart={handleStartResume}
                        onPause={handlePause}
                        onStop={handleStop}
                        onReset={handleReset}
                        onAddTime={handleAddTime}
                        onAcknowledge={handleAcknowledge}
                    />
                </main>
            </div>
        </div>
    );
};

export default App;