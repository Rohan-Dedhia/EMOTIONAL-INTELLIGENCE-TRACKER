// localStorage utilities for data persistence

export const STORAGE_KEYS = {
  USER_PROFILE: 'eq_user_profile',
  ASSESSMENT_RESULT: 'eq_assessment_result',
  CHECK_INS: 'eq_check_ins',
  EXERCISE_STREAK: 'eq_exercise_streak',
  LAST_AI_TIP: 'eq_last_ai_tip',
  CHAT_HISTORY: 'eq_chat_history'
};

// User Profile
export const saveUserProfile = (profile) => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = () => {
  const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return profile ? JSON.parse(profile) : null;
};

// Assessment Results
export const saveAssessmentResult = (result) => {
  localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULT, JSON.stringify(result));
};

export const getAssessmentResult = () => {
  const result = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESULT);
  return result ? JSON.parse(result) : null;
};

export const clearAssessmentResult = () => {
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RESULT);
};

// Check-ins
export const saveCheckIn = (checkIn) => {
  const existingCheckIns = getCheckIns();
  const updatedCheckIns = [...existingCheckIns, checkIn];
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updatedCheckIns));
};

export const getCheckIns = () => {
  const checkIns = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
  return checkIns ? JSON.parse(checkIns) : [];
};

export const getRecentCheckIns = (days = 7) => {
  const checkIns = getCheckIns();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return checkIns.filter(checkIn => 
    new Date(checkIn.date) >= cutoffDate
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Exercise Streak
export const updateExerciseStreak = () => {
  const today = new Date().toDateString();
  const lastExercise = localStorage.getItem('eq_last_exercise_date');
  
  if (lastExercise !== today) {
    const currentStreak = getExerciseStreak();
    const newStreak = lastExercise === new Date(Date.now() - 86400000).toDateString() 
      ? currentStreak + 1 
      : 1;
    
    localStorage.setItem(STORAGE_KEYS.EXERCISE_STREAK, newStreak.toString());
    localStorage.setItem('eq_last_exercise_date', today);
    return newStreak;
  }
  
  return getExerciseStreak();
};

export const getExerciseStreak = () => {
  const streak = localStorage.getItem(STORAGE_KEYS.EXERCISE_STREAK);
  return streak ? parseInt(streak) : 0;
};

// AI Tips
export const saveLastAITip = (tip) => {
  localStorage.setItem(STORAGE_KEYS.LAST_AI_TIP, tip);
};

export const getLastAITip = () => {
  return localStorage.getItem(STORAGE_KEYS.LAST_AI_TIP) || '';
};

// Chat History
export const saveChatMessage = (message) => {
  const existingHistory = getChatHistory();
  const updatedHistory = [...existingHistory, message];
  // Keep only last 50 messages to prevent storage bloat
  const trimmedHistory = updatedHistory.slice(-50);
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(trimmedHistory));
};

export const getChatHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return history ? JSON.parse(history) : [];
};

export const clearChatHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
};

// Clear all data (for testing/reset)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('eq_last_exercise_date');
};

