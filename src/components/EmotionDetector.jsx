import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Smile, Frown, Meh, AlertCircle, Loader2 } from 'lucide-react';

const EmotionDetector = ({ onEmotionDetected, isActive = false, currentPage = 'chat' }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsDetecting(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied or not available');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    setCurrentEmotion(null);
    setConfidence(0);
    setRecommendations(null);
  }, []);

  // Capture image and send to backend
  const captureAndDetect = useCallback(async () => {
    if (!videoRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(videoRef.current, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Send to Python backend
      const response = await fetch('http://localhost:5000/detect_emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          page: currentPage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to detect emotions');
      }

      const result = await response.json();
      
      if (result.emotion) {
        setCurrentEmotion(result.emotion);
        setConfidence(result.confidence);
        setRecommendations(result.recommendations);
        
        // Notify parent component
        if (onEmotionDetected) {
          onEmotionDetected({
            emotion: result.emotion,
            confidence: result.confidence,
            allEmotions: result.all_emotions,
            chatResponse: result.chat_response,
            recommendations: result.recommendations
          });
        }
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
      setError('Failed to detect emotions. Make sure the Python backend is running.');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, currentPage, onEmotionDetected]);

  // Auto-detect every 3 seconds when camera is active
  useEffect(() => {
    let interval;
    if (isDetecting && !isProcessing) {
      interval = setInterval(captureAndDetect, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, isProcessing, captureAndDetect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="w-6 h-6 text-green-500" />;
      case 'sad':
        return <Frown className="w-6 h-6 text-blue-500" />;
      case 'angry':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'fear':
        return <AlertCircle className="w-6 h-6 text-purple-500" />;
      case 'disgust':
        return <Meh className="w-6 h-6 text-yellow-500" />;
      case 'surprise':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <Meh className="w-6 h-6 text-gray-500" />;
    }
  };

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'happy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sad':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'angry':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'fear':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'disgust':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'surprise':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Emotion Detection</h3>
        <button
          onClick={isDetecting ? stopCamera : startCamera}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isDetecting 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          {isDetecting ? (
            <>
              <CameraOff className="w-4 h-4" />
              <span>Stop</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full max-w-md mx-auto rounded-lg ${!isDetecting ? 'hidden' : ''}`}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full max-w-md mx-auto rounded-lg pointer-events-none"
        />
      </div>

      {isProcessing && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
          <span className="text-sm text-gray-600">Analyzing emotions...</span>
        </div>
      )}

      {currentEmotion && (
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-3 mb-3">
            {getEmotionIcon(currentEmotion)}
            <div className={`px-3 py-1 rounded-full border ${getEmotionColor(currentEmotion)}`}>
              <span className="text-sm font-medium capitalize">
                {currentEmotion} ({Math.round(confidence * 100)}%)
              </span>
            </div>
          </div>
          
          {recommendations && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
              <div className="space-y-1">
                {recommendations[currentPage] && recommendations[currentPage].slice(0, 2).map((rec, index) => (
                  <p key={index} className="text-xs text-gray-600">• {rec}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isDetecting 
            ? 'Detecting emotions every 3 seconds...' 
            : 'Click "Start" to begin emotion detection'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Current page: {currentPage}
        </p>
      </div>
    </div>
  );
};

export default EmotionDetector;
