import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { useVoiceToText } from "react-speakup";
import MoodList from "./MoodList";

interface ApiConfig {
  id: string;
  joke: string;
}

function App() {
  const jokeApi = "https://icanhazdadjoke.com/search";
  const [jokes, setJokes] = useState<ApiConfig[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isMicrophoneDenied, setIsMicrophoneDenied] = useState(false); 
  const [isInactive, setIsInactive] = useState(false); 

  // Import functions from react-speakup
  const { startListening, stopListening, transcript, reset } = useVoiceToText();

  // Moods to activate dad joke fetch
  const moods = ['happy', 'sad', 'scared', 'angry', 'calm', 'surprised', 'confident', 'nervous'];

  // Fetch Jokes based on the mood words
  const fetchJokes = async (mood: string) => {
    try {
      const { data } = await axios.get(`${jokeApi}?term=${mood}`, {
        headers: { Accept: "application/json" },
      });
      setJokes(data.results); // Update jokes state
      console.log(`Jokes fetched for mood: ${mood}`, data.results);
    } catch (error) {
      console.error("Error fetching jokes:", error);
    }
  };

  // Stop listening after 10 seconds of inactivity
  useEffect(() => {
    const inactivityTimeout = setTimeout(() => {
      if (isListening) {
        console.log("No speech detected for 10 seconds, stopping...");
        setIsInactive(true); // No voice activity, set to true
        stopListening(); // Stop listening after 10 seconds of inactivity
        setIsListening(false); // Update listening state
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(inactivityTimeout); // Clean up timeout on effect cleanup
  }, [transcript, isListening, stopListening]); // Trigger effect whenever `transcript` or `isListening` changes


  // Check for microphone access permissions
  const checkMicrophonePermission = async () => {
    try {
      // Check if the microphone is accessible by trying to get user media
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicrophoneDenied(false); // Microphone access granted
    } catch (error) {
      setIsMicrophoneDenied(true); // Microphone access denied
      console.error("Microphone access denied:", error);
    }
  };

  // React to changes in `transcript`
  useEffect(() => {
    const moodWord = transcript.trim().toLowerCase();
    if (moods.includes(moodWord)) {
      console.log(`Fetching jokes for mood: ${moodWord}`);
      fetchJokes(moodWord); // Fetch jokes when a valid mood word is recognized
      try {
        const response = axios.post("http://localhost:3000/api/mood", {
          input: moodWord
        });
        console.log(response);
      } catch (error) {
        console.log("api post error", error)
      }
      reset(); // Reset the transcript after processing
      handleStopListening(); // stop listening
    } else if (transcript && !moods.includes(moodWord)) {
      console.log("Unrecognized mood word:", moodWord);
    }

    setTimeout(() => {
      reset(); // Reset the transcript after a short delay to prevent repeated calls
    }, 1800);
  }, [transcript, reset]); // Trigger effect whenever `transcript` changes

  // Start Listening for Speech
  const handleStartListening = () => {
    if (isMicrophoneDenied) {
      console.error("Cannot start listening, microphone access is denied.");
      return; // Don't start listening if the microphone is denied
    }
    setIsListening(true);
    startListening(); // Start listening
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening(); // Stop listening
    setIsInactive(false);
  };

  // Check for microphone permission when the component is mounted
  useEffect(() => {
    checkMicrophonePermission();
  }, []); // Only run once when the component is mounted

  return (
    <div className="main">
      <div>
      <header className="fancy">
        <h1 className="sweet-title">
          <span data-text="Voice">Voice</span>
          <span data-text="Jokes">Jokes</span>
        </h1>
      </header>
      <div className="container">
        <button
          className="button"
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isMicrophoneDenied} // Disable the button if microphone access is denied
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" height={24} fill="none" className="svg-icon">
            <g strokeWidth={2} strokeLinecap="round" stroke="#5bf38b">
              <rect y={3} x={9} width={6} rx={3} height={11} />
              <path d="m12 18v3" />
              <path d="m8 21h8" />
              <path d="m19 11c0 3.866-3.134 7-7 7-3.86599 0-7-3.134-7-7" />
            </g>
          </svg>
          {isListening ? "Listening..." : "Press to Talk"}
        </button>
        <div>
        { isInactive && <p>No voice activity detected. Please speak to continue.</p>}

          <p>
            {isMicrophoneDenied
              ? "Microphone access denied. Please enable microphone."
              : transcript
              ? `Did not recognize "${transcript}"`
              : `Speak a mood word (e.g., "happy", "surprised", "scared", "angry")`}
          </p>
        </div>
        <div className="secondcontainer">
        <div className="jokeflex">
          {jokes.length > 0 ? (
            jokes.map((dadJoke: ApiConfig) => (
              <div className="jokes" key={dadJoke.id}>
                <h1>- {dadJoke.joke}</h1>
              </div>
            ))
          ) : (
            <p className="emojidad">👨🏼‍🦳</p>
          )}
         
        </div>
        </div>
      </div>
      </div>
      <MoodList />
    </div>
  );
}

export default App;
