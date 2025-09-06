# Emotion Detection Integration

This document explains how to set up and use the emotion detection feature in your Emotional Intelligence platform.

## Features

- **Real-time emotion detection** using FER (Facial Expression Recognition)
- **Context-aware chatbot responses** based on detected emotions
- **Smart exercise recommendations** based on emotional state
- **Auto-filled check-ins** with mood and emotion tags
- **Page-specific recommendations** for different sections

## Setup Instructions

### 1. Install Python Dependencies

```bash
# Install required packages
pip install -r requirements.txt

# Or run the setup script
python setup_emotion_detection.py
```

### 2. Start the Python Backend

```bash
python emotion_detector.py
```

The backend will start on `http://localhost:5000`

### 3. Start the React Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## How It Works

### Emotion Detection Flow

1. **Camera Access**: User clicks "Show Emotion Detection" button
2. **Image Capture**: Camera captures video frames every 3 seconds
3. **API Call**: Images are sent to Python backend as base64
4. **Emotion Analysis**: FER library analyzes facial expressions
5. **Response Generation**: Backend generates appropriate responses based on emotion and page context
6. **UI Update**: Frontend displays detected emotion and recommendations

### Emotion-Based Features

#### Chat Page
- **Auto-responses**: Chatbot automatically responds to detected emotions
- **Context-aware**: Responses consider both emotion and conversation context
- **Emotional support**: Provides appropriate emotional support based on detected state

#### Exercise Page
- **Smart recommendations**: Suggests exercises based on emotional state
- **Intensity adjustment**: Recommends gentler exercises for negative emotions
- **Motivation**: Provides encouraging messages for positive emotions

#### Check-in Page
- **Auto-filled mood**: Automatically sets mood slider based on detected emotion
- **Emotion tags**: Pre-selects relevant emotion tags
- **Personalized feedback**: Provides tailored feedback based on emotional state

## API Endpoints

### POST /detect_emotion

Detects emotions from a base64-encoded image.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "page": "chat" // or "exercise" or "checkin"
}
```

**Response:**
```json
{
  "emotion": "happy",
  "confidence": 0.85,
  "all_emotions": {
    "happy": 0.85,
    "neutral": 0.10,
    "sad": 0.05
  },
  "chat_response": "Great mood! Let's try a fun new exercise today 🎉",
  "recommendations": {
    "exercise": ["Try a new workout", "Dance to your favorite music"],
    "checkin": ["Share your positive mood", "Set new goals"],
    "general": ["Share your happiness", "Try something new"]
  }
}
```

## Supported Emotions

- **Happy** 😊 - Positive, energetic responses
- **Sad** 😢 - Supportive, gentle responses  
- **Angry** 😠 - Calming, stress-relief responses
- **Fear** 😨 - Reassuring, grounding responses
- **Disgust** 🤢 - Gentle, refreshing responses
- **Surprise** 😲 - Curious, engaging responses
- **Neutral** 😐 - Balanced, encouraging responses

## Troubleshooting

### Common Issues

1. **Camera not accessible**
   - Check browser permissions
   - Ensure camera is not being used by another application
   - Try refreshing the page

2. **Python backend not responding**
   - Check if backend is running on port 5000
   - Verify all dependencies are installed
   - Check console for error messages

3. **No emotions detected**
   - Ensure good lighting
   - Position face clearly in camera view
   - Check if face is visible and not obscured

4. **Slow performance**
   - Emotion detection runs every 3 seconds to balance accuracy and performance
   - Reduce browser tab activity for better performance
   - Close unnecessary applications

### Error Messages

- **"Camera access denied"**: Grant camera permissions in browser
- **"Failed to detect emotions"**: Check if Python backend is running
- **"No face detected"**: Ensure face is visible in camera view

## Privacy & Security

- **Local processing**: Images are processed locally and not stored
- **No data persistence**: Emotion data is not saved permanently
- **User control**: Users can enable/disable emotion detection at any time
- **Secure transmission**: Images are sent securely to local backend only

## Customization

### Adding New Emotions

1. Update the emotion detection logic in `emotion_detector.py`
2. Add new emotion icons and colors in `EmotionDetector.jsx`
3. Update response generation logic for new emotions

### Modifying Responses

Edit the `handle_chat_response()` function in `emotion_detector.py` to customize responses for different emotions and pages.

### Adjusting Detection Frequency

Modify the interval in `EmotionDetector.jsx` (currently set to 3000ms) to change how often emotions are detected.

## Performance Tips

- **Optimal lighting**: Ensure good lighting for better emotion detection
- **Stable position**: Keep face stable in camera view
- **Close distance**: Position face reasonably close to camera
- **Clear view**: Avoid obstructions like hands or objects

## Future Enhancements

- **Emotion history tracking**
- **Advanced emotion combinations**
- **Voice emotion detection**
- **Emotion-based exercise scheduling**
- **Personalized emotion coaching**

