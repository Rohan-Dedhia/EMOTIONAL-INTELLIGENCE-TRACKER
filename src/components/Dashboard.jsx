import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Lightbulb, 
  Plus,
  Brain,
  Heart,
  Activity
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  getUserProfile, 
  getAssessmentResult, 
  getRecentCheckIns, 
  getExerciseStreak,
  getLastAITip 
} from '../utils/storage';
import { DOMAIN_INFO } from '../data/assessment';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [exerciseStreak, setExerciseStreak] = useState(0);
  const [lastAITip, setLastAITip] = useState('');

  useEffect(() => {
    setUserProfile(getUserProfile());
    setAssessmentResult(getAssessmentResult());
    setCheckIns(getRecentCheckIns(7));
    setExerciseStreak(getExerciseStreak());
    setLastAITip(getLastAITip());
  }, []);

  // Memoize expensive calculations
  const moodData = useMemo(() => ({
    labels: checkIns.map(checkIn => {
      const date = new Date(checkIn.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse(),
    datasets: [
      {
        label: 'Mood',
        data: checkIns.map(checkIn => checkIn.mood).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }), [checkIns]);

  const moodOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
    animation: {
      duration: 0, // Disable animations for better performance
    },
  }), []);

  const navigateToCheckIn = useCallback(() => {
    navigate('/check-in');
  }, [navigate]);

  const navigateToExercise = useCallback(() => {
    navigate('/exercise');
  }, [navigate]);

  if (!userProfile || !assessmentResult) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getWeakestDomain = () => {
    const domains = Object.entries(assessmentResult.domains);
    const weakest = domains.reduce((min, [domain, score]) => 
      score < assessmentResult.domains[min] ? domain : min, domains[0][0]
    );
    return DOMAIN_INFO[weakest];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your emotional intelligence overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall EQ Score */}
          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(assessmentResult.overallEQ)} mb-1`}>
              {assessmentResult.overallEQ}
            </div>
            <div className="text-sm text-gray-600">Overall EQ Score</div>
          </div>

          {/* Exercise Streak */}
          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {exerciseStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>

          {/* Check-ins This Week */}
          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {checkIns.length}
            </div>
            <div className="text-sm text-gray-600">Check-ins This Week</div>
          </div>

          {/* Focus Area */}
          <div className="card text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-lg font-bold text-yellow-600 mb-1">
              {getWeakestDomain().name}
            </div>
            <div className="text-sm text-gray-600">Focus Area</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Trend Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Mood Trend (7 Days)
              </h2>
            </div>
            
            {checkIns.length > 0 ? (
              <div className="h-64 w-full">
                <Line data={moodData} options={moodOptions} />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No check-ins yet</p>
                  <p className="text-sm">Start tracking your mood!</p>
                </div>
              </div>
            )}
          </div>

          {/* EQ Domain Scores */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              EQ Domain Scores
            </h2>
            
            <div className="space-y-4">
              {Object.entries(assessmentResult.domains).map(([domain, score]) => {
                const domainInfo = DOMAIN_INFO[domain];
                const percentage = Math.round((score / domainInfo.maxScore) * 100);
                const isWeakest = domain === assessmentResult.weakestDomain;

                return (
                  <div key={domain} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {domainInfo.name}
                        </span>
                        {isWeakest && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Focus
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${getScoreBgColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className={`font-bold ${getScoreColor(percentage)}`}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Tip */}
        {lastAITip && (
          <div className="card bg-blue-50 border-blue-200 mb-8">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  AI Tip for You
                </h3>
                <p className="text-blue-800">{lastAITip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={navigateToCheckIn}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Daily Check-in</h3>
                <p className="text-sm text-gray-600">Track your mood and emotions</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToExercise}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Exercise of the Day</h3>
                <p className="text-sm text-gray-600">Practice your EQ skills</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

