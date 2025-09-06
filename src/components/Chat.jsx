import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  Bot, 
  User,
  Loader2,
  Camera
} from 'lucide-react';
import { generateChatResponse } from '../utils/gemini';
import { getAssessmentResult, getUserProfile, saveChatMessage } from '../utils/storage';
import EmotionDetector from './EmotionDetector';

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmotionDetector, setShowEmotionDetector] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Memoize these expensive operations
  const { assessmentResult, userProfile } = useMemo(() => ({
    assessmentResult: getAssessmentResult(),
    userProfile: getUserProfile()
  }), []);

  useEffect(() => {
    // Add welcome message only once
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          content: `Hi ${userProfile?.name || 'there'}! I'm your EQ coach. I'm here to help you with emotional intelligence, stress management, relationships, and personal growth. What would you like to work on today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [userProfile, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleEmotionDetected = useCallback((emotionData) => {
    setCurrentEmotion(emotionData);
    
    // Auto-send emotion-based message if user hasn't typed anything
    if (inputMessage.trim() === '' && emotionData.chatResponse) {
      const emotionMessage = {
        id: Date.now(),
        type: 'bot',
        content: emotionData.chatResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, emotionMessage]);
    }
  }, [inputMessage]);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

      setMessages(prev => [...prev, userMessage]);
      saveChatMessage(userMessage); // Save user message to storage
      const currentMessage = inputMessage.trim();
      setInputMessage('');
      setIsLoading(true);

    try {
      // Create context from assessment results and current emotion
      let context = assessmentResult ? 
        `User's EQ assessment shows overall score of ${assessmentResult.overallEQ} with strongest area in ${assessmentResult.strongestDomain} and weakest in ${assessmentResult.weakestDomain}.` : 
        '';

      // Add emotion context if available
      if (currentEmotion) {
        context += ` Current detected emotion: ${currentEmotion.emotion} (confidence: ${Math.round(currentEmotion.confidence * 100)}%).`;
      }

      const botResponse = await generateChatResponse(currentMessage, context);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      saveChatMessage(botMessage); // Save bot message to storage
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      saveChatMessage(errorMessage); // Save error message to storage
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, assessmentResult, currentEmotion]);

  const suggestedQuestions = [
    "How can I manage stress better?",
    "What are some ways to improve my relationships?",
    "How do I handle difficult emotions?",
    "Can you help me with conflict resolution?",
    "What exercises can improve my empathy?"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">EQ Coach</h1>
                <p className="text-sm text-gray-600">Your personal emotional intelligence assistant</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowEmotionDetector(!showEmotionDetector)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showEmotionDetector 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{showEmotionDetector ? 'Hide' : 'Show'} Emotion Detection</span>
          </button>
        </div>
      </div>

      {/* Emotion Detector */}
      {showEmotionDetector && (
        <div className="px-4 py-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <EmotionDetector 
              onEmotionDetected={handleEmotionDetected}
              isActive={showEmotionDetector}
              currentPage="chat"
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about emotional intelligence..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 px-4 py-3"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

