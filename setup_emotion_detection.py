#!/usr/bin/env python3
"""
Setup script for Emotion Detection Integration
This script helps set up the Python backend for emotion detection
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required Python packages"""
    print("Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def check_camera_access():
    """Check if camera is accessible"""
    print("Checking camera access...")
    try:
        import cv2
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("✅ Camera is accessible!")
            cap.release()
            return True
        else:
            print("❌ Camera is not accessible. Please check your camera permissions.")
            return False
    except ImportError:
        print("❌ OpenCV not installed. Please run the installation first.")
        return False

def test_emotion_detection():
    """Test the emotion detection functionality"""
    print("Testing emotion detection...")
    try:
        from fer import FER
        import cv2
        
        # Initialize detector
        detector = FER(mtcnn=True)
        print("✅ Emotion detection model loaded successfully!")
        
        # Test with camera
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                emotions = detector.detect_emotions(frame)
                if emotions:
                    print("✅ Emotion detection is working!")
                else:
                    print("⚠️  No face detected in test frame")
            cap.release()
        return True
    except Exception as e:
        print(f"❌ Error testing emotion detection: {e}")
        return False

def main():
    print("🚀 Setting up Emotion Detection for EQ Platform")
    print("=" * 50)
    
    # Step 1: Install dependencies
    if not install_requirements():
        print("❌ Setup failed at dependency installation")
        return False
    
    # Step 2: Check camera access
    if not check_camera_access():
        print("❌ Setup failed at camera check")
        return False
    
    # Step 3: Test emotion detection
    if not test_emotion_detection():
        print("❌ Setup failed at emotion detection test")
        return False
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the Python backend: python emotion_detector.py")
    print("2. Start the React frontend: npm run dev")
    print("3. Open your browser and test the emotion detection feature")
    print("\nThe emotion detection will be available in:")
    print("- Chat page (with emotion-aware responses)")
    print("- Exercise page (with emotion-based exercise suggestions)")
    print("- Check-in page (with auto-filled mood and tags)")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
