import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { useVoiceToText } from "react-speakup";

interface ApiConfig {
  id: string;
  joke: string;
}

function App() {
  const jokeApi = "https://icanhazdadjoke.com/search";
  const [jokes, setJokes] = useState<ApiConfig[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Import functions from `react-speakup`
  const { startListening, stopListening, transcript, reset } = useVoiceToText();

  // Moods
  const moods = ['happy', 'sad', 'scared', 'angry', 'calm', 'surprised', 'confident', 'nervous'];

  // Fetch Jokes based on the mood word
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

  // React to changes in `transcript`
  useEffect(() => {
    const moodWord = transcript.trim().toLowerCase();
    if (moods.includes(moodWord)) {
      console.log(`Fetching jokes for mood: ${moodWord}`);
      fetchJokes(moodWord); // Fetch jokes when a valid mood word is recognized
      reset(); // Reset the transcript after processing
    } else if (transcript && !moods.includes(moodWord)) {
      console.log("Unrecognized mood word:", moodWord);
    
    }
    setTimeout(() => {
      reset();
    }, 1800);
  }, [transcript, reset]); // Trigger effect whenever `transcript` changes

  const handleStartListening = () => {
    setIsListening(true);
    startListening(); // Start listening
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening(); // Stop listening
    
  };

  return (
    <div>
      <header className="fancy">
      <h1 className="sweet-title">
      <span data-text="Voice">Voice</span>
      <span data-text="Jokes">Jokes</span>
    </h1>
      </header>
    <div className="container">
      <button className="button" onClick={isListening ? handleStopListening : handleStartListening}>
      <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" height={24} fill="none" className="svg-icon"><g strokeWidth={2} strokeLinecap="round" stroke="#5bf38b"><rect y={3} x={9} width={6} rx={3} height={11} /><path d="m12 18v3" /><path d="m8 21h8" /><path d="m19 11c0 3.866-3.134 7-7 7-3.86599 0-7-3.134-7-7" /></g></svg>
      {isListening ? "Listening..." : "Press to Talk"}
    </button>
      <div>
       <p>{transcript ? `did not recognize ${transcript}` : `Speak a mood word (e.g., "happy", "surprised", "scared", "angry")`}</p> 
        </div>
      <div>
        {jokes.length > 0 ? (
          jokes.map((dadJoke: ApiConfig) => (
            <div className="jokes" key={dadJoke.id}>
              <h1>- {dadJoke.joke}</h1>
               {/* Render the recognized word */}
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
    </div>
  );
}

export default App;
