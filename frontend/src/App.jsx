// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// // Layouts
// import Navbar from './components/layout/Navbar';

// // Auth pages
// import Login from './components/auth/Login';
// import Register from './components/auth/Register';
// import ForgotPassword from './components/auth/ForgotPassword';
// import ResetPassword from './components/auth/ResetPassword';

// // Protected pages
// import Dashboard from './components/dashboard/Dashboard';
// import Profile from './components/profile/Profile';

// // Landing page sections
// import Header from './components/LandingPage/Header';
// import HeroSection from './components/LandingPage/HeroSection';
// import AboutUs from './components/LandingPage/AboutUs';
// import OurWork from './components/LandingPage/OurWork';
// import GetInvolved from './components/LandingPage/GetInvolved';
// import Testimonials from './components/LandingPage/Testimonials';
// import ContactForm from './components/LandingPage/ContactForm';
// import Footer from './components/LandingPage/Footer';

// // Event Page
// import EventPage from "./components/EventPage/event"; 

// // Common
// import LoadingSpinner from './components/common/LoadingSpinner';


// // 🔐 Protected Route
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <LoadingSpinner />;
//   return user ? children : <Navigate to="/login" replace />;
// };

// // 🌐 Public Route
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();
//   if (loading) return <LoadingSpinner />;
//   return user ? <Navigate to="/landing" replace /> : children;
// };

// // 📌 Layout for protected pages (with Navbar)
// const AuthLayout = ({ children }) => (
//   <div className="min-h-screen bg-gray-50">
//     <Navbar />
//     <main className="container mx-auto px-4 py-8">{children}</main>
//   </div>
// );

// // 📌 Layout for Landing Page (without Navbar)
// const LandingLayout = ({ children }) => (
//   <div className="bg-white font-sans">
//     {children}
//   </div>
// );

// // Landing Page Component
// function LandingPage() {
//   return (
//     <LandingLayout>
//       <Header />
//       <main>
//         <HeroSection />
//         <AboutUs />
//         <OurWork />
//         <GetInvolved />
//         <Testimonials />
//         <ContactForm />
//       </main>
//       <Footer />
//     </LandingLayout>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<Navigate to="/login" replace />} />
//           <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//           <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />

//           {/* Landing Page */}
//           <Route path="/landing" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />

//           {/* ✅ Events Page (Protected) */}
//           <Route
//             path="/events"
//             element={
//               <ProtectedRoute>
//                 <AuthLayout>
//                   <EventPage />
//                 </AuthLayout>
//               </ProtectedRoute>
//             }
//           />

//           {/* Protected Routes with Navbar */}
//           <Route path="/dashboard" element={<ProtectedRoute><AuthLayout><Dashboard /></AuthLayout></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><AuthLayout><Profile /></AuthLayout></ProtectedRoute>} />

//           {/* Catch all */}
//           <Route path="*" element={<Navigate to="/landing" replace />} />
//         </Routes>

//         {/* Toast Notifications */}
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: { background: '#363636', color: '#fff' },
//             success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
//             error: { duration: 5000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
//           }}
//         />
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layouts
import Navbar from "./components/layout/Navbar";

// Auth pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// Protected pages
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";

// Landing page sections
import Header from "./components/LandingPage/Header";
import HeroSection from "./components/LandingPage/HeroSection";
import AboutUs from "./components/LandingPage/AboutUs";
import OurWork from "./components/LandingPage/OurWork";
import GetInvolved from "./components/LandingPage/GetInvolved";
import Testimonials from "./components/LandingPage/Testimonials";
import ContactForm from "./components/LandingPage/ContactForm";
import Footer from "./components/LandingPage/Footer";

// Event Page
import EventPage from "./components/EventPage/event";

// Common
import LoadingSpinner from "./components/common/LoadingSpinner";

import Admindashboard from "./components/dashboard/Admindashboard"; // Add this import
import CreateEventForm from "./components/dashboard/CreateEventForm"; // Add this import
import EventShowcase from "./components/dashboard/EventShowcase";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

// 🌐 Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <Navigate to="/landing" replace /> : children;
};

// 📌 Layout for protected pages (with Navbar)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <main className="container mx-auto px-4 py-8">{children}</main>
  </div>
);

// 📌 Layout for Landing Page (without Navbar)
const LandingLayout = ({ children }) => (
  <div className="bg-white font-sans">{children}</div>
);

// Landing Page Component
function LandingPage() {
  return (
    <LandingLayout>
      <Header />
      <main>
        <HeroSection />
        <AboutUs />
        <OurWork />
        <GetInvolved />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </LandingLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Admindashboard />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <CreateEventForm />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/events-showcase"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <EventShowcase />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          {/* Landing Page */}
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />

          {/* ✅ Events Page (Protected) */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <EventPage />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes with Navbar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Dashboard />
                </AuthLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Profile />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: "#363636", color: "#fff" },
            success: {
              duration: 3000,
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              duration: 5000,
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;


