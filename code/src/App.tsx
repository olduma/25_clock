import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import beep from './sounds/beep.wav';


function App() {
    const [time, setTime] = useState(1500); // 25 minutes in seconds
    const [breakTime, setBreakTime] = useState(5);
    const [sessionTime, setSessionTime] = useState(25);
    const [timerRunning, setTimerRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const pauseSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            // Rewind the audio to the beginning
            audioRef.current.currentTime = 0;
        }
    };

    const startPause = () => {
        timerRunning ? setTimerRunning(false) : setTimerRunning(true)
    }

    const timeConverter = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const formattedMinutes = (minutes < 10) ? "0" + minutes : minutes;
        const formattedSeconds = (sec < 10) ? "0" + sec : sec;
        return (formattedMinutes + ":" + formattedSeconds);
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (timerRunning && time > -1) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === -1) {
            if (isSession) {
                setTime(breakTime * 60)
                setIsSession(!isSession)
                playSound()
            } else {
                setTime(sessionTime * 60)
                setIsSession(!isSession)
                playSound()
            }
        }

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerRunning, time]);

    const reset = () => {
        setBreakTime(5);
        setSessionTime(25);
        setTimerRunning(false);
        setIsSession(true)
        setTime(1500);
        pauseSound()
    }

    const incrementBreak = () => {
        if (timerRunning) return;

        // Increment breakTime
        const newBreakTime = breakTime === 60 ? breakTime : breakTime + 1;
        setBreakTime(newBreakTime);

        // Update time based on the newBreakTime
        if (!isSession) {
            setTime(newBreakTime * 60);
        }
    };


    const incrementSession = () => {
        if (timerRunning) return;

        // Increment sessionTime
        const newSessionTime = sessionTime === 60 ? sessionTime : sessionTime + 1;
        setSessionTime(newSessionTime);

        // Update time based on the newSessionTime
        if (isSession) {
            setTime(newSessionTime * 60);
        }
    };


    const decrementBreak = () => {
        if (timerRunning) return;

        // Decrement breakTime
        const newBreakTime = breakTime === 1 ? breakTime : breakTime - 1;
        setBreakTime(newBreakTime);

        // Update time based on the newBreakTime
        if (!isSession) {
            setTime(newBreakTime * 60);
        }
    };

    const decrementSession = () => {
        if (timerRunning) return;

        // Decrement sessionTime
        const newSessionTime = sessionTime === 1 ? sessionTime : sessionTime - 1;
        setSessionTime(newSessionTime);

        // Update time based on the newSessionTime
        if (isSession) {
            setTime(newSessionTime * 60);
        }
    };


    return (
        <div className="App">
            <div className="clock">
                <h1>25 + 5 CLOCK</h1>
                <div className="options">
                    <div className="break">
                        <label id="break-label">Break Length</label>
                        <div className="break-setting">
                            <div id="break-decrement" className="pad"
                                 onClick={() => decrementBreak()}
                            >↓
                            </div>
                            <div id="break-length">{breakTime}</div>
                            <div id="break-increment" className="pad"
                                 onClick={() => incrementBreak()}
                            >↑
                            </div>
                        </div>
                    </div>
                    <div className="session">
                        <label id="session-label">Session Length</label>
                        <div className="session-setting">
                            <div id="session-decrement" className="pad"
                                 onClick={() => decrementSession()}
                            >↓
                            </div>
                            <div id="session-length">{sessionTime}</div>
                            <div id="session-increment" className="pad"
                                 onClick={() => incrementSession()}
                            >↑
                            </div>
                        </div>
                    </div>
                </div>
                <div className="timer">
                    <h3 id="timer-label">
                        {isSession ? "Session" : "Break"}
                    </h3>
                    <div id="time-left">{timeConverter(time)}</div>
                </div>
                <div className="buttons">
                    <div id="start_stop" className="pad_start_stop"
                         onClick={() => startPause()}
                    >start/pause
                    </div>
                    <div id="reset" className="pad_reset"
                         onClick={() => reset()}
                    >reset
                    </div>
                </div>
                <div className="footer"></div>
            </div>
            <audio
                controls id="beep"
                ref={audioRef}
                style={{display: 'none'}}
            >
                <source src={beep} type="audio/wav"/>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

export default App;
