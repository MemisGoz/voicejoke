import { useEffect, useState } from 'react';
import axios from 'axios';

interface MoodConfig {
    id: any;
    mood: string;
}

export default function MoodList() {
    const moodApi = "https://gojokeapi.vercel.app/api/moods";
    const [mood, setMood] = useState<MoodConfig[]>([]);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchMood = async () => {
        try {
            const response = await axios.get(`${moodApi}`, {
                headers: { Accept: "application/json" },
            });
            // Only update the state if the data is different from the last fetched data
            if (JSON.stringify(response.data) !== JSON.stringify(mood)) {
                setMood(response.data);
                console.log(response.data);
            }
            setLastFetched(new Date()); // Update the last fetched time
            console.log(lastFetched)
        } catch (error) {
            console.error("Error fetching mood:", error);
        }
    };

    // Polling every 10 seconds, but only update if data has changed
    useEffect(() => {
        fetchMood();
        const intervalId = setInterval(() => {
            fetchMood();
        }, 10000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [mood]); // Re-run the effect if the mood changes

    return (
        <div>
            <h1>Recent User Moods</h1>
            {mood.length > 0 ? (
                mood.slice().reverse().slice(0, 5).map((data) => (
                    <div key={data.id}>
                        Mood: {data.mood}
                    </div>
                ))
            ) : (
                <p>No moods available or an error occurred.</p>
            )}
        </div>
    );
}
