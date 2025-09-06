// EQ Assessment questions and scoring logic

export const EQ_QUESTIONS = [
  // Self-Awareness (3 questions)
  {
    id: 1,
    category: 'self_awareness',
    question: 'I can easily identify my emotions as they arise',
    reverse: false
  },
  {
    id: 2,
    category: 'self_awareness',
    question: 'I understand how my emotions affect my behavior',
    reverse: false
  },
  {
    id: 3,
    category: 'self_awareness',
    question: 'I am aware of my emotional triggers',
    reverse: false
  },

  // Self-Regulation (3 questions)
  {
    id: 4,
    category: 'self_regulation',
    question: 'I can calm myself down when I feel upset',
    reverse: false
  },
  {
    id: 5,
    category: 'self_regulation',
    question: 'I think before I act when I am emotional',
    reverse: false
  },
  {
    id: 6,
    category: 'self_regulation',
    question: 'I can adapt to changing circumstances without getting overwhelmed',
    reverse: false
  },

  // Motivation (3 questions)
  {
    id: 7,
    category: 'motivation',
    question: 'I am driven to achieve my personal goals',
    reverse: false
  },
  {
    id: 8,
    category: 'motivation',
    question: 'I maintain a positive attitude even during difficult times',
    reverse: false
  },
  {
    id: 9,
    category: 'motivation',
    question: 'I am optimistic about the future',
    reverse: false
  },

  // Empathy (3 questions)
  {
    id: 10,
    category: 'empathy',
    question: 'I can sense how others are feeling',
    reverse: false
  },
  {
    id: 11,
    category: 'empathy',
    question: 'I consider other people\'s perspectives before making decisions',
    reverse: false
  },
  {
    id: 12,
    category: 'empathy',
    question: 'I am good at reading body language and facial expressions',
    reverse: false
  },

  // Social Skills (3 questions)
  {
    id: 13,
    category: 'social_skills',
    question: 'I can resolve conflicts effectively',
    reverse: false
  },
  {
    id: 14,
    category: 'social_skills',
    question: 'I am good at building and maintaining relationships',
    reverse: false
  },
  {
    id: 15,
    category: 'social_skills',
    question: 'I can communicate my feelings clearly to others',
    reverse: false
  }
];

export const DOMAIN_INFO = {
  self_awareness: {
    name: 'Self-Awareness',
    description: 'Understanding your own emotions and their impact',
    maxScore: 15
  },
  self_regulation: {
    name: 'Self-Regulation',
    description: 'Managing and controlling your emotional responses',
    maxScore: 15
  },
  motivation: {
    name: 'Motivation',
    description: 'Driving yourself toward goals with optimism',
    maxScore: 15
  },
  empathy: {
    name: 'Empathy',
    description: 'Understanding and responding to others\' emotions',
    maxScore: 15
  },
  social_skills: {
    name: 'Social Skills',
    description: 'Building relationships and managing social interactions',
    maxScore: 15
  }
};

export const calculateEQScores = (answers) => {
  const domainScores = {
    self_awareness: 0,
    self_regulation: 0,
    motivation: 0,
    empathy: 0,
    social_skills: 0
  };

  // Calculate domain scores
  EQ_QUESTIONS.forEach(question => {
    const answer = answers[question.id] || 0;
    const score = question.reverse ? (6 - answer) : answer;
    domainScores[question.category] += score;
  });

  // Calculate overall EQ score (0-100)
  const totalScore = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
  const overallEQ = Math.round((totalScore / 75) * 100);

  // Find strongest and weakest domains
  const domainEntries = Object.entries(domainScores);
  const strongestDomain = domainEntries.reduce((max, [domain, score]) => 
    score > domainScores[max] ? domain : max, domainEntries[0][0]
  );
  const weakestDomain = domainEntries.reduce((min, [domain, score]) => 
    score < domainScores[min] ? domain : min, domainEntries[0][0]
  );

  return {
    overallEQ,
    domains: domainScores,
    strongestDomain,
    weakestDomain
  };
};

