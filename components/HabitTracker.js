'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../Lib/supabase';

const HabitTracker = () => {
  const [habitCompleted, setHabitCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('habits')
        .select('timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching streak:', error);
      } else {
        let currentStreak = 0;
        let previousDate = new Date();

        for (let entry of data) {
          const entryDate = new Date(entry.timestamp);
          const diffTime = previousDate - entryDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);

          if (diffDays < 1.5) {
            currentStreak += 1;
            previousDate = entryDate;
          } else {
            break;
          }
        }

        setStreak(currentStreak);
      }
    };

    fetchStreak();
  }, [userId]);

  const handleCheckIn = async (status) => {
    if (!userId) return;

    setHabitCompleted(true);

    const { error } = await supabase.from('habits').insert([
      {
        user_id: userId,
        habit_name: 'workout',
        status,
        timestamp: new Date(),
      },
    ]);

    if (error) {
      console.error('Error inserting habit data:', error);
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
