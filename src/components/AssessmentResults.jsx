import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Brain, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import { getAssessmentResult } from '../utils/storage';
import { DOMAIN_INFO } from '../data/assessment';

const AssessmentResults = () => {
  const navigate = useNavigate();
  const result = getAssessmentResult();

  if (!result) {
    navigate('/assessment');
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

  const getOverallScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOverallScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Your EQ Assessment Results
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here's your personalized emotional intelligence profile. Let's focus on your growth areas.
          </p>
        </div>

        {/* Modern Overall Score */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Overall EQ Score</h2>
          <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${getOverallScoreBgColor(result.overallEQ)} mb-6 shadow-lg`}>
            <span className={`text-5xl font-bold ${getOverallScoreColor(result.overallEQ)}`}>
              {result.overallEQ}
            </span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {result.overallEQ >= 80 ? 'Excellent emotional intelligence! You have strong skills across all domains.' :
             result.overallEQ >= 60 ? 'Good emotional intelligence with room for growth. Focus on your weaker areas.' :
             'Great opportunity to develop your emotional intelligence. Let\'s work on building these skills together.'}
          </p>
        </div>

        {/* Modern Domain Scores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {Object.entries(result.domains).map(([domain, score]) => {
            const domainInfo = DOMAIN_INFO[domain];
            const percentage = Math.round((score / domainInfo.maxScore) * 100);
            const isStrongest = domain === result.strongestDomain;
            const isWeakest = domain === result.weakestDomain;

            return (
              <div key={domain} className={`relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                isWeakest 
                  ? 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50' 
                  : isStrongest 
                    ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-white/20'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg">{domainInfo.name}</h3>
                  {isStrongest && <TrendingUp className="w-6 h-6 text-green-600" />}
                  {isWeakest && <TrendingDown className="w-6 h-6 text-red-600" />}
                </div>
                
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${getScoreBgColor(percentage)} mb-4 shadow-lg`}>
                  <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                    {percentage}%
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{domainInfo.description}</p>
                
                {isStrongest && (
                  <div className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full inline-block">
                    Your strongest area
                  </div>
                )}
                {isWeakest && (
                  <div className="text-sm text-red-600 font-medium bg-red-100 px-3 py-1 rounded-full inline-block">
                    Focus area for improvement
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modern AI Improvement Plan */}
        {result.aiPlan && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 shadow-lg mb-12">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">AI-Powered Improvement Plan</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {result.aiPlan}
            </p>
          </div>
        )}

        {/* Modern Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/assessment', { state: { retake: true } })}
              className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-lg">Retake EQ Test</span>
            </button>
            <button
              onClick={() => navigate('/exercise')}
              className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="text-lg">Get Exercise Recommendations</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
          >
            <span className="text-lg">Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;

