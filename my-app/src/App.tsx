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
  const moods = ['happy', 'sad', 'sleepy', 'angry'];

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
      <button onClick={isListening ? handleStopListening : handleStartListening}>
        {isListening ? "Listening..." : "Press to Talk"}
      </button>
      <div>
       <p>{transcript ? `did not recognize ${transcript}` : `Speak a mood word (e.g., "happy", "sad", "sleepy", "angry")`}</p> 
        </div>
      <div>
        {jokes.length > 0 ? (
          jokes.map((dadJoke: ApiConfig) => (
            <div className="" key={dadJoke.id}>
              <h1>{dadJoke.joke}</h1>
               {/* Render the recognized word */}
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default App;
