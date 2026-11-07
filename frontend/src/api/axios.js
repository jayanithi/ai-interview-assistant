// ======================================================
// AXIOS GLOBAL CONFIGURATION
// src/api/axios.js
// ======================================================

import axios from "axios";

const API = axios.create({

  baseURL:
    "http://127.0.0.1:8000/api",

  headers: {
    "Content-Type":
      "application/json"
  }
});


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

API.interceptors.response.use(

  (response) => response,

  (error) => {

    // TOKEN EXPIRED
    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";
    }

    return Promise.reject(
      error
    );
  }
);

export default API;