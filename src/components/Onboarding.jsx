import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Target } from 'lucide-react';
import { saveUserProfile } from '../utils/storage';

const Onboarding = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const profile = {
        name: name.trim(),
        goal: goal.trim() || 'Improve my emotional intelligence',
        createdAt: new Date().toISOString()
      };
      saveUserProfile(profile);
      navigate('/assessment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-24">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to EQ Platform
          </h1>
          <p className="text-gray-600">
            Track your emotions and improve your emotional intelligence
          </p>
        </div>

        <div className="card mb-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">EQ Assessment</h3>
                <p className="text-sm text-gray-600">Discover your emotional intelligence strengths</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Daily Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your mood and emotional patterns</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold text-gray-900">AI Coaching</h3>
                <p className="text-sm text-gray-600">Get personalized insights and exercises</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              What's your name? *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              What's your main goal? (optional)
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="input-field"
              placeholder="e.g., Better stress management, improved relationships"
            />
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Your EQ Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;

