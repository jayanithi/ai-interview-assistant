import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/AnalyticsComp";
import InterviewRoom from "./pages/InterviewRoom";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AuthPage from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Common from "./components/Common";

import ProtectedRoute from "./routes/ProtectedRoute";

import {
  ThemeProviderCustom
} from "./context/ThemeContext";

function App() {

  return (

    <ThemeProviderCustom>

      <BrowserRouter>

        <Routes>

          {/* PUBLIC ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<AuthPage />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* PROTECTED ROUTES */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewRoom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/common"
            element={
              <ProtectedRoute>
                <Common />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Home />}
          />

        </Routes>

      </BrowserRouter>

    </ThemeProviderCustom>

  );
}

export default App;