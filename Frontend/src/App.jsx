import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Chatbot from "./pages/Chatbot"; // if using dedicated chatbot page
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Safety from "./pages/Safety";
import TermsOfUse from "./pages/TermsOfUse";
import Startingpoint from "./pages/Startingpoint";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import LawyerLogin from "./pages/LawyerLogin";
import LawyerSignUp from "./pages/LawyerSignUp";
import LawyerVerification from "./pages/LawyerVerification"; 
import TimerPage from "./pages/TimerPage"; 

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LawyerHome from "./pages/LawyerHome";

import UserLogout from "./pages/UserLogout";
import LawyerLogout from "./pages/LawyerLogout";
import UserProtectWrapper from "./pages/UserProtectWrapper";
import LawyerProtectWrapper from "./pages/LawyerProtectWrapper";

// Import dashboard components for chat functionality
import DashboardLayout from "./layouts/dashboardLayout";
import DashboardPage from "./components/DashboardPage";
import ChatPage from "./components/ChatPage";

const App = () => {
  const location = useLocation();

  // Define paths where you want to hide Navbar and Footer.
  // Using startsWith to cover nested routes.
  const hideLayoutPaths = [
    "/dashboard",
    "/chatbot",
    "/userlogin",
    "/usersignup",
    "/lawyerlogin",
    "/lawyersignup",
  ];
  const hideLayout =
    hideLayoutPaths.some((path) => location.pathname.startsWith(path)) ||
    location.pathname === "/";

  return (
    <div>
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Startingpoint />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/usersignup" element={<UserSignUp />} />
        <Route path="/lawyerlogin" element={<LawyerLogin />} />
        <Route path="/lawyersignup" element={<LawyerSignUp />} />

        <Route
          path="/lawyerhome"
          element={
            <LawyerProtectWrapper>
              <LawyerHome />
            </LawyerProtectWrapper>
          }
        />

        <Route
          path="/lawyerverification"
          element={
            <LawyerProtectWrapper>
              <LawyerVerification />
            </LawyerProtectWrapper>
          }
        />

        <Route
          path="/timerpage"
          element={
            <LawyerProtectWrapper>
              <TimerPage />
            </LawyerProtectWrapper>
          }
        />

        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />

        <Route
          path="/lawyer/logout"
          element={
            <LawyerProtectWrapper>
              <LawyerLogout />
            </LawyerProtectWrapper>
          }
        />

        <Route path="/aboutus" element={<AboutUs />} />

        {/* Dashboard routes for chatbot functionality */}
        <Route
          path="/dashboard"
          element={
            <UserProtectWrapper>
              <DashboardLayout />
            </UserProtectWrapper>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="chats/:id" element={<ChatPage />} />
        </Route>

        {/* Dedicated Chatbot page (if desired) */}
        <Route path="/chatbot" element={<Chatbot />} />

        <Route path="/index" element={<Index />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
