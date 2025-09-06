// Exercise library for different EQ domains

export const EXERCISES = {
  self_awareness: [
    {
      id: 'emotion_check',
      title: 'Emotion Check-in',
      duration: '2 minutes',
      description: 'Take a moment to identify and name your current emotions.',
      steps: [
        'Find a quiet space and sit comfortably',
        'Close your eyes and take 3 deep breaths',
        'Ask yourself: "What am I feeling right now?"',
        'Name the emotion(s) without judgment',
        'Notice where you feel it in your body'
      ]
    },
    {
      id: 'body_scan',
      title: 'Body Scan Meditation',
      duration: '5 minutes',
      description: 'Connect with physical sensations to understand emotional states.',
      steps: [
        'Lie down or sit comfortably',
        'Start from your toes and work up to your head',
        'Notice any tension, warmth, or other sensations',
        'Connect physical feelings to emotional states',
        'Breathe into any areas of tension'
      ]
    }
  ],

  self_regulation: [
    {
      id: 'breathing_exercise',
      title: '4-7-8 Breathing',
      duration: '2 minutes',
      description: 'A calming breathing technique to manage stress and anxiety.',
      steps: [
        'Inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts',
        'Repeat this cycle 4 times',
        'Focus only on your breathing'
      ]
    },
    {
      id: 'progressive_relaxation',
      title: 'Progressive Muscle Relaxation',
      duration: '5 minutes',
      description: 'Release physical tension to calm emotional responses.',
      steps: [
        'Start with your facial muscles - tense for 5 seconds, then release',
        'Move to your shoulders - tense and release',
        'Continue with arms, chest, stomach, legs',
        'Notice the difference between tension and relaxation',
        'End with 3 deep breaths'
      ]
    }
  ],

  motivation: [
    {
      id: 'gratitude_journal',
      title: 'Gratitude Practice',
      duration: '3 minutes',
      description: 'Boost positive emotions and motivation through gratitude.',
      steps: [
        'Write down 3 things you are grateful for today',
        'Be specific about why you appreciate each thing',
        'Notice how gratitude makes you feel',
        'Set one small positive intention for the day',
        'Reflect on your progress and growth'
      ]
    },
    {
      id: 'vision_board',
      title: 'Visualization Exercise',
      duration: '4 minutes',
      description: 'Connect with your goals and aspirations.',
      steps: [
        'Close your eyes and imagine your ideal future',
        'Picture yourself achieving your goals',
        'Notice the emotions you feel in this vision',
        'Identify one small step you can take today',
        'Open your eyes feeling motivated and focused'
      ]
    }
  ],

  empathy: [
    {
      id: 'perspective_taking',
      title: 'Perspective Taking',
      duration: '3 minutes',
      description: 'Practice understanding others\' viewpoints.',
      steps: [
        'Think of someone you interacted with today',
        'Consider their situation and challenges',
        'Imagine how they might be feeling',
        'Reflect on what they might need or want',
        'Think of one way you could be more understanding'
      ]
    },
    {
      id: 'active_listening',
      title: 'Active Listening Practice',
      duration: '5 minutes',
      description: 'Improve your ability to truly hear and understand others.',
      steps: [
        'Find someone to talk with or recall a recent conversation',
        'Focus entirely on what they are saying',
        'Notice their tone, body language, and emotions',
        'Ask clarifying questions to understand better',
        'Reflect back what you heard to confirm understanding'
      ]
    }
  ],

  social_skills: [
    {
      id: 'assertive_communication',
      title: 'Assertive Communication',
      duration: '3 minutes',
      description: 'Practice expressing your needs clearly and respectfully.',
      steps: [
        'Think of a situation where you need to communicate clearly',
        'Use "I" statements to express your feelings',
        'Be specific about what you need or want',
        'Listen to the other person\'s response',
        'Work together to find a solution'
      ]
    },
    {
      id: 'conflict_resolution',
      title: 'Conflict Resolution Practice',
      duration: '4 minutes',
      description: 'Develop skills for handling disagreements constructively.',
      steps: [
        'Identify the real issue behind a conflict',
        'Separate the person from the problem',
        'Focus on interests, not positions',
        'Brainstorm solutions together',
        'Agree on a plan and follow through'
      ]
    }
  ]
};

export const getExerciseForDomain = (domain) => {
  const domainExercises = EXERCISES[domain] || EXERCISES.self_awareness;
  // Return a random exercise from the domain
  return domainExercises[Math.floor(Math.random() * domainExercises.length)];
};

export const getRandomExercise = () => {
  const allExercises = Object.values(EXERCISES).flat();
  return allExercises[Math.floor(Math.random() * allExercises.length)];
};

