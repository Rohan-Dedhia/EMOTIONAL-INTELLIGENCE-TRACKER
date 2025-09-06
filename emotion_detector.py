from fer import FER
import cv2
import base64
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Initialize detector
detector = FER(mtcnn=True)

def handle_chat_response(emotion, page="chat"):
    """Generate appropriate chatbot response based on detected emotion and current page"""
    
    if emotion == "happy":
        if page == "exercise":
            return "Great mood! Let's try a fun new exercise today 🎉"
        elif page == "checkin":
            return "You're doing amazing! Let's log your progress 🌟"
        else:
            return "Glad to see you happy! How can I help today?"
    
    elif emotion == "sad":
        if page == "exercise":
            return "I sense you're a bit down. How about a short relaxation exercise? 🧘"
        elif page == "checkin":
            return "It's okay to have tough days. Want to talk about it or check in together?"
        else:
            return "I'm here for you 💙 Want me to suggest some uplifting activities?"
    
    elif emotion == "angry":
        if page == "exercise":
            return "Feeling frustrated? Let's try some breathing exercises to help you feel better 🧘‍♀️"
        elif page == "checkin":
            return "I can see you're upset. Would you like to talk about what's bothering you?"
        else:
            return "I understand you're feeling angry. Let's work through this together 💪"
    
    elif emotion == "fear":
        if page == "exercise":
            return "Feeling anxious? Let's try some gentle grounding exercises 🌱"
        elif page == "checkin":
            return "It's okay to feel scared sometimes. You're safe here 💙"
        else:
            return "I'm here to support you. What's making you feel anxious?"
    
    elif emotion == "disgust":
        if page == "exercise":
            return "Not feeling great? Let's try a light, refreshing activity 🌿"
        elif page == "checkin":
            return "Sometimes we feel off. That's completely normal. Want to explore what's going on?"
        else:
            return "I can sense you're not feeling your best. How can I help you feel better?"
    
    elif emotion == "surprise":
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

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    try:
        data = request.json
        image_data = data.get('image')
        page = data.get('page', 'chat')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert PIL image to OpenCV format
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Detect emotions
        emotions = detector.detect_emotions(frame)
        
        if emotions:
            dominant_emotion = emotions[0]["emotions"]
            emotion = max(dominant_emotion, key=dominant_emotion.get)
            confidence = dominant_emotion[emotion]
            
            # Generate appropriate response
            chat_response = handle_chat_response(emotion, page)
            
            return jsonify({
                'emotion': emotion,
                'confidence': confidence,
                'all_emotions': dominant_emotion,
                'chat_response': chat_response,
                'recommendations': get_emotion_recommendations(emotion, page)
            })
        else:
            return jsonify({
                'emotion': 'neutral',
                'confidence': 0.0,
                'all_emotions': {},
                'chat_response': handle_chat_response('neutral', page),
                'recommendations': get_emotion_recommendations('neutral', page)
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
    
    if emotion == "sad":
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
    
    elif emotion == "angry":
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
    
    elif emotion == "happy":
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
