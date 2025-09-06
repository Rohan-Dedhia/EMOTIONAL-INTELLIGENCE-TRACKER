import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Smile, Frown, Meh, ArrowRight, ArrowLeft, Camera } from 'lucide-react';
import { saveCheckIn } from '../utils/storage';
import { generateJournalFeedback } from '../utils/gemini';
import EmotionDetector from './EmotionDetector';

const CheckIn = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);

  const emotionTags = useMemo(() => [
    'Happy', 'Calm', 'Excited', 'Grateful', 'Confident',
    'Anxious', 'Stressed', 'Angry', 'Sad', 'Frustrated',
    'Neutral', 'Tired', 'Overwhelmed', 'Peaceful', 'Motivated'
  ], []);

  const moodEmojis = useMemo(() => ({
    1: { emoji: '😢', label: 'Very Low', color: 'text-red-600' },
    2: { emoji: '😔', label: 'Low', color: 'text-red-500' },
    3: { emoji: '😐', label: 'Below Average', color: 'text-orange-500' },
    4: { emoji: '🙂', label: 'Average', color: 'text-yellow-500' },
    5: { emoji: '😊', label: 'Good', color: 'text-yellow-400' },
    6: { emoji: '😄', label: 'Above Average', color: 'text-green-500' },
    7: { emoji: '😁', label: 'Great', color: 'text-green-600' },
    8: { emoji: '🤩', label: 'Excellent', color: 'text-blue-500' },
    9: { emoji: '🥳', label: 'Amazing', color: 'text-purple-500' },
    10: { emoji: '🎉', label: 'Perfect', color: 'text-pink-500' }
  }), []);

  const handleEmotionDetected = useCallback((emotionData) => {
    setCurrentEmotion(emotionData);
    
    // Auto-adjust mood based on detected emotion
    const emotionToMood = {
      'happy': 8,
      'sad': 3,
      'angry': 2,
      'fear': 4,
      'disgust': 3,
      'surprise': 6,
      'neutral': 5
    };
    
    if (emotionToMood[emotionData.emotion]) {
      setMood(emotionToMood[emotionData.emotion]);
    }
    
    // Auto-suggest relevant emotion tags
    const emotionToTags = {
      'happy': ['Happy', 'Excited'],
      'sad': ['Sad', 'Tired'],
      'angry': ['Angry', 'Frustrated'],
      'fear': ['Anxious', 'Stressed'],
      'disgust': ['Overwhelmed'],
      'surprise': ['Excited'],
      'neutral': ['Neutral', 'Calm']
    };
    
    if (emotionToTags[emotionData.emotion]) {
      setSelectedTags(prev => [...new Set([...prev, ...emotionToTags[emotionData.emotion]])]);
    }
  }, []);

  const toggleTag = useCallback((tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const checkInData = {
        date: new Date().toISOString().split('T')[0],
        mood,
        tags: selectedTags,
        journal: journalEntry.trim(),
        timestamp: new Date().toISOString()
      };

      // Save check-in
      saveCheckIn(checkInData);

      // Get AI feedback if there's a journal entry
      if (journalEntry.trim()) {
        const feedback = await generateJournalFeedback(
          journalEntry.trim(),
          mood,
          selectedTags
        );
        setAiFeedback(feedback);
      }

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error saving check-in:', error);
      // Still navigate even if AI fails
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  }, [mood, selectedTags, journalEntry, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily Check-in
          </h1>
          <p className="text-gray-600">
            How are you feeling today?
          </p>
          
          <button
            onClick={() => setShowEmotionDetector(!showEmotionDetector)}
            className={`mt-4 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors mx-auto ${
              showEmotionDetector 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{showEmotionDetector ? 'Hide' : 'Show'} Emotion Detection</span>
          </button>
        </div>

        {/* Emotion Detector */}
        {showEmotionDetector && (
          <div className="mb-8">
            <EmotionDetector 
              onEmotionDetected={handleEmotionDetected}
              isActive={showEmotionDetector}
              currentPage="checkin"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Slider */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Rate your overall mood (1-10)
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">
                {moodEmojis[mood].emoji}
              </div>
              <div className={`text-lg font-semibold ${moodEmojis[mood].color}`}>
                {mood} - {moodEmojis[mood].label}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
              }}
            />
            
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Very Low</span>
              <span>Perfect</span>
            </div>
          </div>

          {/* Emotion Tags */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What emotions are you experiencing? (Select all that apply)
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {emotionTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Journal Entry */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Journal Entry (Optional)
            </h2>
            <p className="text-gray-600 mb-4">
              Share what's on your mind or what happened today
            </p>
            
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="How are you feeling? What's been on your mind today? Any challenges or wins you'd like to reflect on?"
            />
          </div>

          {/* AI Feedback Preview */}
          {aiFeedback && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                AI Coach Feedback
              </h3>
              <p className="text-blue-800">{aiFeedback}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Check-in</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;

