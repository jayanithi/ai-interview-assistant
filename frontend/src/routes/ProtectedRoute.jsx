// ======================================================
// src/routes/ProtectedRoute.jsx
// FULLY MERGED + PROFESSIONAL JWT AUTH ROUTE
// FRONTEND ↔ DJANGO BACKEND INTEGRATION
// ======================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import axios from "axios";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";


// ======================================================
// API URL
// ======================================================

const API_URL = "http://127.0.0.1:8000/api";


// ======================================================
// PROTECTED ROUTE
// ======================================================

const ProtectedRoute = ({
  children,
}) => {

  // ====================================================
  // STATES
  // ====================================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);


  // ====================================================
  // VERIFY USER TOKEN
  // ====================================================

  useEffect(() => {

    const verifyUser = async () => {

      try {

        // ==============================================
        // GET ACCESS TOKEN
        // ==============================================

        const token =
          localStorage.getItem("access");


        // ==============================================
        // TOKEN NOT FOUND
        // ==============================================

        if (!token) {

          console.warn(
            "AUTH: Access token not found"
          );

          setAuthenticated(false);
          setLoading(false);

          return;
        }


        // ==============================================
        // VERIFY TOKEN USING PROFILE API
        // ==============================================

        console.log(
          "AUTH: Verifying access token..."
        );

        console.log(
          "AUTH: Profile API =",
          `${API_URL}/accounts/profile/`
        );


        const response = await axios.get(

          `${API_URL}/accounts/profile/`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }

        );


        // ==============================================
        // DEBUG RESPONSE
        // ==============================================

        console.log(
          "AUTH RESPONSE STATUS:",
          response.status
        );

        console.log(
          "AUTH RESPONSE DATA:",
          response.data
        );


        // ==============================================
        // AUTHENTICATION SUCCESS
        // ==============================================

        if (
          response.status === 200 &&
          response.data?.success === true
        ) {

          console.log(
            "AUTH SUCCESS:",
            response.data
          );


          setAuthenticated(true);


          // ============================================
          // SAVE UPDATED USER
          // ============================================

          const userData = {
            name:
              response.data.name || "",

            email:
              response.data.email || "",

            avatar:
              response.data.avatar || "",

            role:
              response.data.role || "",
          };


          localStorage.setItem(
            "user",
            JSON.stringify(userData)
          );


        } else {

          console.warn(
            "AUTH FAILED: Invalid profile response",
            response.data
          );

          setAuthenticated(false);
        }

      } catch (error) {

        // ==============================================
        // AXIOS ERROR DEBUG
        // ==============================================

        console.error(
          "AUTH FAILED:",
          error
        );


        // ==============================================
        // SERVER RESPONSE DEBUG
        // ==============================================

        if (error.response) {

          console.error(
            "AUTH ERROR STATUS:",
            error.response.status
          );

          console.error(
            "AUTH ERROR DATA:",
            error.response.data
          );

          console.error(
            "AUTH ERROR HEADERS:",
            error.response.headers
          );

        } else if (error.request) {

          console.error(
            "AUTH ERROR: Backend did not respond",
            error.request
          );

        } else {

          console.error(
            "AUTH ERROR MESSAGE:",
            error.message
          );

        }


        // ==============================================
        // REMOVE INVALID TOKENS
        // ==============================================

        localStorage.removeItem(
          "access"
        );

        localStorage.removeItem(
          "refresh"
        );

        localStorage.removeItem(
          "user"
        );


        setAuthenticated(false);

      } finally {

        // ==============================================
        // STOP LOADING
        // ==============================================

        setLoading(false);

      }

    };


    // ================================================
    // RUN AUTH VERIFICATION
    // ================================================

    verifyUser();

  }, []);


  // ====================================================
  // LOADING SCREEN
  // ====================================================

  if (loading) {

    return (

      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          flexDirection: "column",

          gap: {
            xs: 2,
            sm: 3,
          },

          px: {
            xs: 3,
            sm: 4,
          },

          textAlign: "center",

          backgroundColor: "background.default",
          color: "text.primary",
        }}
      >

        <CircularProgress
          size={
            window.innerWidth < 600
              ? 55
              : 70
          }
          thickness={4}
        />


        <Typography
          sx={{
            fontSize: {
              xs: "1.2rem",
              sm: "1.5rem",
              md: "1.8rem",
            },

            fontWeight: 700,
          }}
        >
          Verifying Authentication...
        </Typography>


        <Typography
          sx={{
            color: "text.secondary",

            maxWidth: "500px",

            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
            },
          }}
        >
          Please wait while we verify your session.
        </Typography>

      </Box>

    );
  }


  // ====================================================
  // NOT AUTHENTICATED
  // ====================================================

  if (!authenticated) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );
  }


  // ====================================================
  // AUTHENTICATION SUCCESS
  // ====================================================

  return children;
};


// ======================================================
// EXPORT
// ======================================================

export default ProtectedRoute;