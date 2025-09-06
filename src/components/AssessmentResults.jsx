import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Brain, ArrowRight, Lightbulb } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your EQ Assessment Results
          </h1>
          <p className="text-gray-600">
            Here's your personalized emotional intelligence profile
          </p>
        </div>

        {/* Overall Score */}
        <div className="card mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall EQ Score</h2>
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getOverallScoreBgColor(result.overallEQ)} mb-4`}>
            <span className={`text-4xl font-bold ${getOverallScoreColor(result.overallEQ)}`}>
              {result.overallEQ}
            </span>
          </div>
          <p className="text-gray-600">
            {result.overallEQ >= 80 ? 'Excellent emotional intelligence!' :
             result.overallEQ >= 60 ? 'Good emotional intelligence with room for growth' :
             'Great opportunity to develop your emotional intelligence'}
          </p>
        </div>

        {/* Domain Scores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(result.domains).map(([domain, score]) => {
            const domainInfo = DOMAIN_INFO[domain];
            const percentage = Math.round((score / domainInfo.maxScore) * 100);
            const isStrongest = domain === result.strongestDomain;
            const isWeakest = domain === result.weakestDomain;

            return (
              <div key={domain} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{domainInfo.name}</h3>
                  {isStrongest && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {isWeakest && <TrendingDown className="w-5 h-5 text-red-600" />}
                </div>
                
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(percentage)} mb-3`}>
                  <span className={`text-xl font-bold ${getScoreColor(percentage)}`}>
                    {percentage}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{domainInfo.description}</p>
                
                {isStrongest && (
                  <div className="text-xs text-green-600 font-medium">
                    Your strongest area
                  </div>
                )}
                {isWeakest && (
                  <div className="text-xs text-red-600 font-medium">
                    Focus area for improvement
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Improvement Plan */}
        {result.aiPlan && (
          <div className="card mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Improvement Plan</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {result.aiPlan}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-lg px-8 py-3 flex items-center space-x-2 mx-auto"
          >
            <span>Start Your EQ Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;

