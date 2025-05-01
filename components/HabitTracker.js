import { useState, useEffect } from 'react';
import supabase from '../Lib/SupaBase';

const HabitTracker = () => {
  const [habitCompleted, setHabitCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('timestamp')
        .eq('user_id', "farcaster-user-id") // Use the user's Farcaster ID
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching streak:", error);
      } else {
        // Calculate streak
        const lastCheckInDate = new Date(data[0]?.timestamp);
        const today = new Date();
        const isSameDay = lastCheckInDate.toDateString() === today.toDateString();
        setStreak(isSameDay ? 1 : streak);
      }
    };

    fetchStreak();
  }, []);

  const handleCheckIn = async (status) => {
    setHabitCompleted(status);

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: "farcaster-user-id",
          habit_name: "workout",
          status,
          timestamp: new Date(),
        }
      ]);

    if (error) {
      console.error("Error inserting habit data:", error);
    }
  };

  return (
    <div>
      <h1>Daily Habit Tracker</h1>
      <p>Current streak: {streak} day(s)</p>
      <p>Did you work out today?</p>
      <button onClick={() => handleCheckIn(true)} disabled={habitCompleted}>
        Yes
      </button>
      <button onClick={() => handleCheckIn(false)} disabled={habitCompleted}>
        No
      </button>
      {habitCompleted && <p>Great job! You're on a streak!</p>}
    </div>
  );
};

export default HabitTracker;



// import { useState } from 'react';
// import { useFarcaster } from '@farcaster/core';

// const HabitTracker = () => {
//   const [habitCompleted, setHabitCompleted] = useState(false);
//   const { cast } = useFarcaster();

//   const handleCheckIn = async (status) => {
//     setHabitCompleted(status);

//     // Log check-in event (we'll save this in Supabase next)
//     await cast({
//       type: "habit-check-in",
//       content: status ? "Completed habit" : "Missed habit",
//     });
//   };

//   return (
//     <div>
//       <h1>Daily Habit Tracker</h1>
//       <p>Did you work out today?</p>
//       <button onClick={() => handleCheckIn(true)} disabled={habitCompleted}>
//         Yes
//       </button>
//       <button onClick={() => handleCheckIn(false)} disabled={habitCompleted}>
//         No
//       </button>
//       {habitCompleted && <p>Great job! You're on a streak!</p>}
//     </div>
//   );
// };

// export default HabitTracker;
