import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserProfile, getAssessmentResult } from './utils/storage';

// Components
import Onboarding from './components/Onboarding';
import Assessment from './components/Assessment';
import AssessmentResults from './components/AssessmentResults';
import CheckIn from './components/CheckIn';
import Dashboard from './components/Dashboard';
import Exercise from './components/Exercise';
import Chat from './components/Chat';
import Navigation from './components/Navigation';

function App() {
  // Memoize these expensive operations
  const { userProfile, assessmentResult } = useMemo(() => ({
    userProfile: getUserProfile(),
    assessmentResult: getAssessmentResult()
  }), []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Routes>
          {/* Onboarding - only if no user profile */}
          <Route 
            path="/onboarding" 
            element={userProfile ? <Navigate to="/assessment" replace /> : <Onboarding />} 
          />
          
          {/* Assessment - only if no assessment result */}
          <Route 
            path="/assessment" 
            element={
              !userProfile ? <Navigate to="/onboarding" replace /> :
              assessmentResult ? <Navigate to="/dashboard" replace /> :
              <Assessment />
            } 
          />
          
          {/* Assessment Results */}
          <Route 
            path="/assessment/results" 
            element={
              !assessmentResult ? <Navigate to="/assessment" replace /> :
              <AssessmentResults />
            } 
          />
          
          {/* Main app routes - require both profile and assessment */}
          <Route 
            path="/dashboard" 
            element={
              !userProfile || !assessmentResult ? <Navigate to="/onboarding" replace /> :
              <Dashboard />
            } 
          />
          
          <Route 
            path="/check-in" 
            element={
              !userProfile || !assessmentResult ? <Navigate to="/onboarding" replace /> :
              <CheckIn />
            } 
          />
          
          <Route 
            path="/exercise" 
            element={
              !userProfile || !assessmentResult ? <Navigate to="/onboarding" replace /> :
              <Exercise />
            } 
          />
          
          <Route 
            path="/chat" 
            element={
              !userProfile || !assessmentResult ? <Navigate to="/onboarding" replace /> :
              <Chat />
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              userProfile ? 
                (assessmentResult ? <Navigate to="/dashboard" replace /> : <Navigate to="/assessment" replace />) :
                <Navigate to="/onboarding" replace />
            } 
          />
        </Routes>
        
        {/* Navigation - only show after assessment is complete */}
        {userProfile && assessmentResult && (
          <Navigation />
        )}
      </div>
    </Router>
  );
}

export default App;

