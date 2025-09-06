from nrclex import NRCLex
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image
import cv2
from deepface import DeepFace
import os

app = Flask(__name__)
CORS(app)

# Initialize NRClex for text emotion detection
# Note: NRClex works with text, not images, so we'll use a hybrid approach

def handle_chat_response(emotion, page="chat"):
    """Generate appropriate chatbot response based on detected emotion and current page"""
    
    # Map DeepFace emotions to our system
    emotion_mapping = {
        'happy': 'happy',
        'sad': 'sad', 
        'angry': 'angry',
        'fear': 'fear',
        'disgust': 'disgust',
        'surprise': 'surprise',
        'neutral': 'neutral'
    }
    
    # Convert DeepFace emotion to our system
    mapped_emotion = emotion_mapping.get(emotion, emotion)
    
    if mapped_emotion == "happy":
        if page == "exercise":
            return "Great mood! Let's try a fun new exercise today 🎉"
        elif page == "checkin":
            return "You're doing amazing! Let's log your progress 🌟"
        else:
            return "Glad to see you happy! How can I help today?"
    
    elif mapped_emotion == "sad":
        if page == "exercise":
            return "I sense you're a bit down. How about a short relaxation exercise? 🧘"
        elif page == "checkin":
            return "It's okay to have tough days. Want to talk about it or check in together?"
        else:
            return "I'm here for you 💙 Want me to suggest some uplifting activities?"
    
    elif mapped_emotion == "angry":
        if page == "exercise":
            return "Feeling frustrated? Let's try some breathing exercises to help you feel better 🧘‍♀️"
        elif page == "checkin":
            return "I can see you're upset. Would you like to talk about what's bothering you?"
        else:
            return "I understand you're feeling angry. Let's work through this together 💪"
    
    elif mapped_emotion == "fear":
        if page == "exercise":
            return "Feeling anxious? Let's try some gentle grounding exercises 🌱"
        elif page == "checkin":
            return "It's okay to feel scared sometimes. You're safe here 💙"
        else:
            return "I'm here to support you. What's making you feel anxious?"
    
    elif mapped_emotion == "disgust":
        if page == "exercise":
            return "Not feeling great? Let's try a light, refreshing activity 🌿"
        elif page == "checkin":
            return "Sometimes we feel off. That's completely normal. Want to explore what's going on?"
        else:
            return "I can sense you're not feeling your best. How can I help you feel better?"
    
    elif mapped_emotion == "surprise":
        if page == "exercise":
            return "Something unexpected happened? Let's channel that energy into something positive! ⚡"
        elif page == "checkin":
            return "Surprised by something? Let's process this together 🤔"
        else:
            return "I can see something surprised you! Tell me more about it"
    
    else:  # neutral
        if page == "exercise":
            return "Ready for some exercises? Let's get started! 💪"
        elif page == "checkin":
            return "How are you feeling today? Let's check in together 📝"
        else:
            return "I'm here. How are you feeling right now?"


def detect_emotion_from_image(image_data):
    """Enhanced emotion detection from image using DeepFace"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert PIL image to OpenCV format
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Save temporary image for DeepFace processing
        temp_path = 'temp_emotion_image.jpg'
        cv2.imwrite(temp_path, frame)
        
        try:
            # Use DeepFace for emotion analysis
            result = DeepFace.analyze(
                img_path=temp_path,
                actions=['emotion'],
                enforce_detection=True,
                detector_backend='opencv'
            )
            
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            # Extract emotion data
            if isinstance(result, list):
                result = result[0]  # Take first face if multiple detected
            
            emotions = result.get('emotion', {})
            
            if emotions:
                # Get dominant emotion
                dominant_emotion = max(emotions, key=emotions.get)
                confidence = emotions[dominant_emotion] / 100.0  # Convert percentage to decimal
                
                # Normalize all emotions to 0-1 range
                normalized_emotions = {k: v/100.0 for k, v in emotions.items()}
                
                return {
                    'emotion': dominant_emotion,
                    'confidence': confidence,
                    'all_emotions': normalized_emotions,
                    'face_detected': True
                }
            else:
                return {
                    'emotion': 'neutral',
                    'confidence': 0.5,
                    'all_emotions': {'neutral': 1.0},
                    'face_detected': False
                }
                
        except Exception as deepface_error:
            print(f"DeepFace error: {deepface_error}")
            # Fallback to basic face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) > 0:
                return {
                    'emotion': 'neutral',
                    'confidence': 0.3,
                    'all_emotions': {'neutral': 1.0},
                    'face_detected': True
                }
            else:
                return {
                    'emotion': 'neutral',
                    'confidence': 0.2,
                    'all_emotions': {'neutral': 1.0},
                    'face_detected': False
                }
        
    except Exception as e:
        print(f"Error in image emotion detection: {e}")
        return {
            'emotion': 'neutral',
            'confidence': 0.0,
            'all_emotions': {},
            'face_detected': False
        }


@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    try:
        data = request.json
        image_data = data.get('image')
        page = data.get('page', 'chat')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Use enhanced image analysis for emotion detection
        emotion_result = detect_emotion_from_image(image_data)
        
        emotion = emotion_result['emotion']
        confidence = emotion_result['confidence']
        all_emotions = emotion_result.get('all_emotions', {})
        
        # Debug logging
        print(f"Detected emotion: {emotion}, confidence: {confidence}")
        print(f"Face detected: {emotion_result.get('face_detected', False)}")
        print(f"All emotions: {all_emotions}")
        
        # Generate appropriate response
        chat_response = handle_chat_response(emotion, page)
        
        return jsonify({
            'emotion': emotion,
            'confidence': confidence,
            'all_emotions': all_emotions,
            'chat_response': chat_response,
            'recommendations': get_emotion_recommendations(emotion, page),
            'face_detected': emotion_result.get('face_detected', False)
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_emotion_recommendations(emotion, page):
    """Get specific recommendations based on emotion and page"""
    recommendations = {
        'exercise': [],
        'checkin': [],
        'general': []
    }
    
    # Map DeepFace emotions to our system
    emotion_mapping = {
        'happy': 'happy',
        'sad': 'sad', 
        'angry': 'angry',
        'fear': 'fear',
        'disgust': 'disgust',
        'surprise': 'surprise',
        'neutral': 'neutral'
    }
    
    mapped_emotion = emotion_mapping.get(emotion, emotion)
    
    if mapped_emotion == "sad":
        recommendations['exercise'] = [
            "Gentle yoga or stretching",
            "Light walking in nature",
            "Breathing exercises"
        ]
        recommendations['checkin'] = [
            "Journal about your feelings",
            "Practice gratitude",
            "Connect with a friend"
        ]
        recommendations['general'] = [
            "Listen to uplifting music",
            "Watch a funny video",
            "Do something creative"
        ]
    
    elif mapped_emotion == "angry":
        recommendations['exercise'] = [
            "High-intensity cardio",
            "Boxing or martial arts",
            "Running or cycling"
        ]
        recommendations['checkin'] = [
            "Write down what's bothering you",
            "Practice deep breathing",
            "Take a break and cool down"
        ]
        recommendations['general'] = [
            "Count to 10 slowly",
            "Squeeze a stress ball",
            "Go for a walk"
        ]
    
    elif mapped_emotion == "happy":
        recommendations['exercise'] = [
            "Try a new workout",
            "Dance to your favorite music",
            "Outdoor activities"
        ]
        recommendations['checkin'] = [
            "Share your positive mood",
            "Set new goals",
            "Help someone else"
        ]
        recommendations['general'] = [
            "Share your happiness",
            "Try something new",
            "Celebrate your wins"
        ]
    
    elif mapped_emotion == "fear":
        recommendations['exercise'] = [
            "Gentle breathing exercises",
            "Meditation or mindfulness",
            "Light stretching"
        ]
        recommendations['checkin'] = [
            "Write about your worries",
            "Practice grounding techniques",
            "Talk to someone you trust"
        ]
        recommendations['general'] = [
            "Take deep breaths",
            "Focus on the present moment",
            "Create a safe space"
        ]
    
    else:  # neutral or other emotions
        recommendations['exercise'] = [
            "Regular workout routine",
            "Try a new exercise",
            "Group fitness class"
        ]
        recommendations['checkin'] = [
            "Daily mood tracking",
            "Reflect on your day",
            "Set small goals"
        ]
        recommendations['general'] = [
            "Stay consistent",
            "Explore new interests",
            "Maintain healthy habits"
        ]
    
    return recommendations


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Emotion detection service is running'})

if __name__ == '__main__':
    print("Starting emotion detection server...")
    print("Server will be available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)

