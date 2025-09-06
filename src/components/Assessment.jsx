import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { EQ_QUESTIONS, calculateEQScores } from '../data/assessment';
import { saveAssessmentResult, clearAssessmentResult, getAssessmentResult } from '../utils/storage';
import { generateEQImprovementPlan } from '../utils/gemini';

const Assessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetake, setIsRetake] = useState(false);

  // Check if this is a retake (coming from results page)
  useEffect(() => {
    if (location.state?.retake) {
      // Clear previous assessment result to allow retaking
      clearAssessmentResult();
      setIsRetake(true);
    } else {
      // If there's already an assessment result and this is not a retake, redirect to dashboard
      const existingResult = getAssessmentResult();
      if (existingResult) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location.state, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < EQ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate EQ scores
      const result = calculateEQScores(answers);
      
      // Generate AI improvement plan
      const aiPlan = await generateEQImprovementPlan(result);
      
      // Save results
      const assessmentData = {
        ...result,
        aiPlan,
        completedAt: new Date().toISOString(),
        answers
      };
      
      saveAssessmentResult(assessmentData);
      
      // Navigate to results
      navigate('/assessment/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      // Still save results even if AI fails
      const result = calculateEQScores(answers);
      const assessmentData = {
        ...result,
        aiPlan: 'Focus on your weakest area and practice daily exercises to improve your emotional intelligence.',
        completedAt: new Date().toISOString(),
        answers
      };
      saveAssessmentResult(assessmentData);
      navigate('/assessment/results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = EQ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / EQ_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestion === EQ_QUESTIONS.length - 1;
  const canProceed = answers[currentQ.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            {isRetake ? 'Retake EQ Assessment' : 'EQ Assessment'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isRetake 
              ? 'You\'re retaking the assessment to track your progress. Answer honestly to see how your emotional intelligence has developed.'
              : 'Answer honestly to get accurate insights about your emotional intelligence. This assessment will help us personalize your learning journey.'
            }
          </p>
          {isRetake && (
            <div className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🔄 Retaking Assessment
            </div>
          )}
        </div>

        {/* Modern Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-4">
            <span>Question {currentQuestion + 1} of {EQ_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Modern Question Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
              {currentQ.question}
            </h2>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  answers[currentQ.id] === value 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={value}
                    checked={answers[currentQ.id] === value}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className={`text-lg font-medium ${
                    answers[currentQ.id] === value ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {value === 1 && 'Strongly Disagree'}
                    {value === 2 && 'Disagree'}
                    {value === 3 && 'Neutral'}
                    {value === 4 && 'Agree'}
                    {value === 5 && 'Strongly Agree'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Modern Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-xl font-medium transition-all duration-300 disabled:hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Get Results</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:hover:shadow-lg"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;

