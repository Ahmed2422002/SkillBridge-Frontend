import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import RoleSelect from './pages/Roleselect';
import MentorSignup from "./pages/MentorSignup";
import MentorLogin from "./pages/MentorLogin";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Mentors from "./pages/Mentors";
import OnboardingWelcome from "./pages/OnboardingWelcome";
import OnboardingStep2 from "./pages/OnboardingStep2";
import OnboardingStep3 from "./pages/OnboardingStep3";
import OnboardingFinalizing from "./pages/OnboardingFinalizing";
import { OnboardingProvider } from "./context/OnboardingContext";
import OnboardingRoadmap from "./pages/OnboardingRoadmap";
import CourseVideos from "./pages/CourseVideos";
import MyProgress from "./pages/MyProgress";
import Notifications from "./pages/Notifications"; 
import Profile from "./pages/Profile";   
import MentorDashboard from "./pages/MentorDashboard"; 
import QuizBuilder from "./pages/QuizBuilder";
import MentorVideos from "./pages/MentorVideos";
import Notifications2 from "./pages/Notifications2";
import MentorProfile from "./pages/MentorProfile";




  

function App() {
  return (
    
    <BrowserRouter>
    <OnboardingProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/signup" element={<RoleSelect intent="signup" />} />
        <Route path="/login" element={<RoleSelect intent="login" />} />

        <Route path="/signup/student" element={<AuthPage mode="signup" />} />
        <Route path="/login/student" element={<AuthPage mode="login" />} />

        <Route path="/signup/mentor" element={<MentorSignup />} />
        <Route path="/login/mentor" element={<MentorLogin />} />

        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/onboarding" element={<OnboardingWelcome />} />
       <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
       <Route path="/onboarding/step-3" element={<OnboardingStep3 />} />
       <Route path="/onboarding/finalizing" element={<OnboardingFinalizing />} />
       <Route path="/onboarding/roadmap" element={<OnboardingRoadmap />} />
       <Route path="/learning/:pathKey" element={<CourseVideos />} />
       <Route path="/my-progress" element={<MyProgress />} />
      <Route path="/notifications" element={<Notifications />} />   
      <Route path="/profile" element={<Profile />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/mentor-dashboard/create-quiz" element={<QuizBuilder />} />
     <Route path="/mentor-dashboard/upload-video" element={<MentorVideos />} />
          <Route
        path="/mentor-dashboard/notifications"
        element={<Notifications2 />}
      />
      <Route
  path="/mentor-dashboard/profile"
  element={<MentorProfile />}
/>
      </Routes>
    </OnboardingProvider>
    </BrowserRouter>
  
   
  );
}

export default App;