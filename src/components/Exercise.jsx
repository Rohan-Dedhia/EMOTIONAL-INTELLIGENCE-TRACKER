import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  Target,
  Brain,
  Camera,
  Music,
  MessageCircle
} from 'lucide-react';
import { getAssessmentResult, getChatHistory } from '../utils/storage';
import { getExerciseForDomain, getRandomExercise, getExerciseRecommendations } from '../data/exercises';
import { updateExerciseStreak } from '../utils/storage';
import EmotionDetector from './EmotionDetector';
import MusicPlayer from './MusicPlayer';

const Exercise = () => {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [exerciseRecommendations, setExerciseRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const assessmentResult = getAssessmentResult();
    const chatHistory = getChatHistory();
    
    if (assessmentResult) {
      // Get exercise recommendations based on EQ results and chat context
      const recommendations = getExerciseRecommendations(assessmentResult, chatHistory);
      setExerciseRecommendations(recommendations);
      
      // Set the first recommended exercise as current
      if (recommendations.length > 0) {
        setCurrentExercise(recommendations[0]);
      } else {
        // Fallback to weakest domain exercise
        const exercise = getExerciseForDomain(assessmentResult.weakestDomain);
        setCurrentExercise(exercise);
      }
    } else {
      // Fallback to random exercise
      setCurrentExercise(getRandomExercise());
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const handleEmotionDetected = useCallback((emotionData) => {
    setCurrentEmotion(emotionData);
    
    // Suggest different exercises based on emotion
    if (emotionData.emotion === 'sad' && currentExercise?.intensity === 'high') {
      // Suggest a gentler exercise if user is sad and current exercise is intense
      const gentleExercises = getExerciseForDomain('self-awareness', 'low');
      if (gentleExercises) {
        setCurrentExercise(gentleExercises);
      }
    }
  }, [currentExercise]);

  const startExercise = () => {
    // Parse duration (e.g., "2 minutes" -> 120 seconds)
    const durationMatch = currentExercise.duration.match(/(\d+)/);
    const minutes = durationMatch ? parseInt(durationMatch[1]) : 2;
    setTimeRemaining(minutes * 60);
    setIsActive(true);
  };

  const completeExercise = () => {
    // Update exercise streak
    updateExerciseStreak();
    setIsCompleted(true);
  };

  const resetExercise = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setIsActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exercise of the Day
          </h1>
          <p className="text-gray-600">
            Practice your emotional intelligence skills
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <button
              onClick={() => setShowEmotionDetector(!showEmotionDetector)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showEmotionDetector 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{showEmotionDetector ? 'Hide' : 'Show'} Emotion Detection</span>
            </button>
            
            <button
              onClick={() => setShowMusicPlayer(!showMusicPlayer)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showMusicPlayer 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{showMusicPlayer ? 'Hide' : 'Show'} Music</span>
            </button>
            
            {exerciseRecommendations.length > 1 && (
              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showRecommendations 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{showRecommendations ? 'Hide' : 'Show'} Recommendations</span>
              </button>
            )}
          </div>
        </div>

        {/* Emotion Detector */}
        {showEmotionDetector && (
          <div className="mb-8">
            <EmotionDetector 
              onEmotionDetected={handleEmotionDetected}
              isActive={showEmotionDetector}
              currentPage="exercise"
            />
          </div>
        )}

        {/* Music Player */}
        {showMusicPlayer && (
          <div className="mb-8">
            <MusicPlayer isActive={showMusicPlayer} />
          </div>
        )}

        {/* Exercise Recommendations */}
        {showRecommendations && exerciseRecommendations.length > 1 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>Personalized Exercise Recommendations</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your EQ assessment and chat history, here are exercises tailored for you:
              </p>
              <div className="space-y-3">
                {exerciseRecommendations.map((exercise, index) => (
                  <div 
                    key={exercise.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentExercise?.id === exercise.id 
                        ? 'bg-primary-50 border-primary-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentExercise(exercise)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{exercise.title}</h4>
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{exercise.duration}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{exercise.reason || 'Recommended for you'}</span>
                        </div>
                      </div>
                      {currentExercise?.id === exercise.id && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exercise Card */}
        <div className="card mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentExercise.title}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
              <Clock className="w-4 h-4" />
              <span>{currentExercise.duration}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {currentExercise.description}
            </p>
          </div>

          {/* Timer */}
          {isActive && (
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((currentExercise.duration.match(/(\d+)/)?.[1] || 2) * 60 - timeRemaining) / ((currentExercise.duration.match(/(\d+)/)?.[1] || 2) * 60) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Instructions:</h3>
            {currentExercise.steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                  index <= currentStep ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-primary-600 text-white' :
                  index === currentStep ? 'bg-primary-200 text-primary-800' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <p className={`flex-1 ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!isActive && !isCompleted && (
              <button
                onClick={startExercise}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Start Exercise</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {isActive && (
              <button
                onClick={() => setIsActive(false)}
                className="btn-secondary"
              >
                Pause
              </button>
            )}

            {!isActive && timeRemaining > 0 && (
              <button
                onClick={() => setIsActive(true)}
                className="btn-primary"
              >
                Resume
              </button>
            )}

            {isCompleted && (
              <div className="text-center">
                <div className="text-green-600 mb-4">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-semibold">Exercise Completed!</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={completeExercise}
                    className="btn-primary"
                  >
                    Mark as Complete
                  </button>
                  <button
                    onClick={resetExercise}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exercise;

