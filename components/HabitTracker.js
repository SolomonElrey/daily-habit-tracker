'use client'

import React, { useState, useEffect } from 'react';
import { useFarcaster } from '@farcaster/core';
import supabase from '../Lib/supabase';

const HabitTracker = () => {
  const [habitCompleted, setHabitCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const { cast } = useFarcaster();

  useEffect(() => {
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('timestamp')
        .eq('user_id', 'farcaster-user-id')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching streak:', error);
      } else {
        const lastCheckInDate = new Date(data[0]?.timestamp);
        const today = new Date();
        const isSameDay = lastCheckInDate.toDateString() === today.toDateString();
        setStreak(isSameDay ? 1 : 0);
      }
    };

    fetchStreak();
  }, []);

  const handleCheckIn = async (status) => {
    setHabitCompleted(true);

    const { error } = await supabase.from('habits').insert([
      {
        user_id: 'farcaster-user-id',
        habit_name: 'workout',
        status,
        timestamp: new Date(),
      }
    ]);

    if (error) {
      console.error('Error inserting habit data:', error);
      return;
    }

    if (status) {
      try {
        await cast({
          text: `✅ I just worked out today! Keeping my streak alive! #HabitTracker #Fitness`,
        });
      } catch (castError) {
        console.warn('Farcaster cast failed:', castError.message);
      }
    }
  };

  return React.createElement(
    'div',
    null,
    React.createElement('h1', null, 'Daily Habit Tracker'),
    React.createElement('p', null, `Current streak: ${streak} day(s)`),
    React.createElement('p', null, 'Did you work out today?'),
    React.createElement(
      'button',
      {
        onClick: () => handleCheckIn(true),
        disabled: habitCompleted
      },
      'Yes'
    ),
    React.createElement(
      'button',
      {
        onClick: () => handleCheckIn(false),
        disabled: habitCompleted
      },
      'No'
    ),
    habitCompleted && React.createElement('p', null, "Great job! You're on a streak!")
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
