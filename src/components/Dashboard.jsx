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
  Activity,
  RotateCcw,
  ArrowRight,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Sparkles
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header with Gradient */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Welcome back, {userProfile.name}! ✨
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personalized emotional intelligence journey continues. Let's focus on your growth areas.
          </p>
        </div>

        {/* Modern Stats Cards with Glass Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Overall EQ Score */}
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${getScoreColor(assessmentResult.overallEQ)}`}>
                    {assessmentResult.overallEQ}
                  </div>
                  <div className="text-sm text-gray-600">EQ Score</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Overall Emotional Intelligence</div>
            </div>
          </div>

          {/* Exercise Streak */}
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {exerciseStreak}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Consistent Practice</div>
            </div>
          </div>

          {/* Check-ins This Week */}
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {checkIns.length}
                  </div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">Mood Check-ins</div>
            </div>
          </div>

          {/* Focus Area - Enhanced */}
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">
                    Focus Area
                  </div>
                  <div className="text-xs text-gray-600">Needs Attention</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">{getWeakestDomain().name}</div>
              <div className="text-xs text-gray-600">{getWeakestDomain().description}</div>
            </div>
          </div>
        </div>

        {/* Weakness Focus Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border border-red-200 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Focus on Your Growth Area</h2>
                  <p className="text-gray-600">Let's work on improving your weakest EQ domain</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/assessment', { state: { retake: true } })}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake EQ Test</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                  Your Focus Area: {getWeakestDomain().name}
                </h3>
                <p className="text-gray-700 mb-6">{getWeakestDomain().description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-white/50">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-900">Current Score</span>
                    </div>
                    <div className="text-2xl font-bold text-red-500">
                      {Math.round((assessmentResult.domains[assessmentResult.weakestDomain] / DOMAIN_INFO[assessmentResult.weakestDomain].maxScore) * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-white/50">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-900">Target Score</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500">80%+</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-6 h-6 text-purple-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/exercise')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5" />
                      <span className="font-medium">Practice Exercises</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5" />
                      <span className="font-medium">Get AI Coaching</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Mood Trend Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
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
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              EQ Domain Breakdown
            </h2>
            
            <div className="space-y-4">
              {Object.entries(assessmentResult.domains).map(([domain, score]) => {
                const domainInfo = DOMAIN_INFO[domain];
                const percentage = Math.round((score / domainInfo.maxScore) * 100);
                const isWeakest = domain === assessmentResult.weakestDomain;

                return (
                  <div key={domain} className={`p-4 rounded-xl transition-all duration-300 ${
                    isWeakest 
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow-md' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">
                          {domainInfo.name}
                        </span>
                        {isWeakest && (
                          <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                            Focus Area
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          isWeakest 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                            : getScoreBgColor(percentage).replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-500')
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Tip */}
        {lastAITip && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 shadow-lg mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  AI Tip for You
                </h3>
                <p className="text-blue-800 leading-relaxed">{lastAITip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modern Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={navigateToCheckIn}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Check-in</h3>
                <p className="text-sm text-gray-600">Track your mood and emotions</p>
              </div>
            </div>
          </button>

          <button
            onClick={navigateToExercise}
            className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Exercise of the Day</h3>
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

