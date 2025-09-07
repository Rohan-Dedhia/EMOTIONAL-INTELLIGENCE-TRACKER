# EMOTIONAL-INTELLIGENCE-TRACKER
Develop a personalized emotional intelligence platform that assesses users' EQ levels, tracks daily emotional patterns, and provides tailored exercises and insights to help individuals improve their self-awareness, emotional regulation, and interpersonal skills.

# EQ Platform MVP - Emotional Intelligence Tracker

A frontend-only Emotional Intelligence (EQ) improvement platform with Gemini 1.5 Flash integration for personalized coaching and feedback.

## 🚀 Features

### ✅ Core Functionality
- **Onboarding**: User profile setup with name and goals
- **EQ Assessment**: 15-question assessment with 5 domains (Self-Awareness, Self-Regulation, Motivation, Empathy, Social Skills)
- **Daily Check-ins**: Mood tracking with emotion tags and journaling
- **Dashboard**: EQ scores, mood trends, exercise streaks, and AI tips
- **Exercise of the Day**: Personalized exercises based on weakest EQ domain
- **AI Coach Chat**: Interactive chat with Gemini 1.5 Flash for EQ guidance

### 🤖 AI Integration
- **Personalized Improvement Plans**: AI-generated recommendations based on assessment results
- **Journal Feedback**: Supportive responses to daily check-ins
- **Interactive Coaching**: Real-time chat assistance for EQ development

### 📊 Data & Analytics
- **Mood Trends**: 7-day mood tracking with Chart.js visualizations
- **EQ Domain Scores**: Detailed breakdown of emotional intelligence areas
- **Exercise Streaks**: Progress tracking for daily practice
- **Local Storage**: All data persisted locally (no backend required)

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom design system
- **Charts**: Chart.js + React-ChartJS-2
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **AI**: Gemini 1.5 Flash API
- **Storage**: localStorage (client-side persistence)
- **Deployment**: Vercel/Netlify ready

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 📱 App Flow

1. **Onboarding** → User enters name and goal
2. **Assessment** → 15 EQ questions with Likert scale
3. **Results** → EQ scores + AI-generated improvement plan
4. **Dashboard** → Overview with mood trends and quick actions
5. **Daily Check-in** → Mood slider + emotions + journaling + AI feedback
6. **Exercise** → Personalized exercises based on weakest domain
7. **Chat** → Interactive AI coach for ongoing support

## 🎯 EQ Assessment Domains

- **Self-Awareness**: Understanding your own emotions and their impact
- **Self-Regulation**: Managing and controlling emotional responses
- **Motivation**: Driving yourself toward goals with optimism
- **Empathy**: Understanding and responding to others' emotions
- **Social Skills**: Building relationships and managing social interactions

## 📊 Data Structure

### Assessment Results
```json
{
  "overallEQ": 70,
  "domains": {
    "self_awareness": 14,
    "self_regulation": 12,
    "motivation": 15,
    "empathy": 18,
    "social_skills": 11
  },
  "strongestDomain": "empathy",
  "weakestDomain": "social_skills",
  "aiPlan": "AI-generated improvement plan..."
}
```

### Check-ins
```json
[
  {
    "date": "2025-01-06",
    "mood": 8,
    "tags": ["Happy", "Calm"],
    "journal": "Had a great day at work!",
    "timestamp": "2025-01-06T10:30:00.000Z"
  }
]
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add `VITE_GEMINI_API_KEY` environment variable
3. Deploy automatically

### Netlify
1. Connect your GitHub repository to Netlify
2. Add `VITE_GEMINI_API_KEY` environment variable
3. Deploy automatically

## 🎨 Design System

- **Primary Colors**: Blue palette for trust and calm
- **Secondary Colors**: Purple accents for creativity
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent card-based layout with subtle shadows
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

## 🔧 Customization

### Adding New Exercises
Edit `src/data/exercises.js` to add exercises for specific EQ domains.

### Modifying Assessment Questions
Update `src/data/assessment.js` to customize the EQ assessment.

### Styling Changes
Modify `tailwind.config.js` and `src/index.css` for design updates.

## 📝 Notes

- **No Backend Required**: All data stored in localStorage
- **No User Accounts**: Single-user experience for MVP
- **AI Fallbacks**: Graceful handling when Gemini API is unavailable
- **Progressive Enhancement**: Core functionality works without AI features

## 🤝 Contributing

This is an MVP for pilot testing. Future enhancements could include:
- User authentication and cloud sync
- Advanced analytics and insights
- Social features and community
- Mobile app versions
- Integration with wearables

## 📄 License

MIT License - feel free to use this code for your own EQ platform projects!


