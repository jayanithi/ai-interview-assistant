import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Stack,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";

import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  AutoAwesome,
  Google,
  GitHub,
} from "@mui/icons-material";

import axios from "axios";

import { useNavigate } from "react-router-dom";

const AuthPage = () => {

  const navigate = useNavigate();

  // =========================
  // MODE
  // =========================

  const [isLogin, setIsLogin] =
    useState(true);

  // =========================
  // STATES
  // =========================

  const [showPassword, setShowPassword] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);
const [username, setUsername] = useState("");
  // =========================
  // LOGIN
  // =========================

  // =========================
// LOGIN
// =========================

const handleLogin = async () => {

  if (!email.trim() || !password.trim()) {

    alert("Enter Email and Password");
    return;

  }

  try {

    setLoading(true);

   const response = await axios.post(
  "http://127.0.0.1:8000/api/accounts/login/",
  {
    username: email,
    password: password,
  }
);

    console.log("LOGIN SUCCESS");
    console.log(response.data);

    localStorage.setItem(
      "access",
      response.data.access
    );

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;

    alert("Login Successful");

    navigate("/dashboard");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Invalid Credentials"
    );

  } finally {

    setLoading(false);

  }
};


// =========================
// REGISTER
// =========================

const handleRegister = async () => {

  if (!name || !email || !password) {

    alert("Fill all fields");

    return;
  }

  try {

    setLoading(true);

    const response = await axios.post(
      "http://127.0.0.1:8000/api/accounts/register/",
      {
        username: name,
        email: email,
        password: password,
      }
    );

    console.log(response.data);

    alert("Registration Successful");

    // AUTO SWITCH LOGIN


    // CLEAR FIELDS
    setName("");
    setEmail("");
    setPassword("");
     setIsLogin(true);   
  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Registration Failed"
    );

  } finally {

    setLoading(false);
  }
};
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#111827)",
        overflow: "hidden",
        position: "relative",
        p: 2,
      }}
    >

      {/* GLOW EFFECT */}

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "rgba(59,130,246,0.25)",
          filter: "blur(120px)",
          top: -100,
          left: -100,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "rgba(168,85,247,0.25)",
          filter: "blur(120px)",
          bottom: -100,
          right: -100,
        }}
      />

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "1100px",
          borderRadius: "35px",
          overflow: "hidden",
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          background:
            "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >

        {/* LEFT SECTION */}

        <Box
          sx={{
            flex: 1,
            p: 6,
            background:
              "linear-gradient(180deg,#1E3A8A,#2563EB,#7C3AED)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >

          <Avatar
            sx={{
              width: 90,
              height: 90,
              mb: 4,
              background:
                "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AutoAwesome
              sx={{
                fontSize: 45,
              }}
            />
          </Avatar>

          <Typography
            variant="h2"
            fontWeight="bold"
            mb={3}
            sx={{
              lineHeight: 1.1,
            }}
          >
            AI Interview
            <br />
            Assistant
          </Typography>

          <Typography
            sx={{
              opacity: 0.85,
              lineHeight: 2,
              fontSize: "1.05rem",
              maxWidth: 450,
            }}
          >
            Practice real-world interviews,
            get AI-powered feedback,
            improve confidence, and crack
            your dream job with next-gen
            interview analytics.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            mt={5}
          >

            <Paper
              sx={{
                px: 3,
                py: 2,
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,0.12)",
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                10K+
              </Typography>

              <Typography variant="body2">
                Users
              </Typography>
            </Paper>

            <Paper
              sx={{
                px: 3,
                py: 2,
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,0.12)",
                color: "white",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                98%
              </Typography>

              <Typography variant="body2">
                Accuracy
              </Typography>
            </Paper>

          </Stack>
        </Box>

        {/* RIGHT SECTION */}

        <Box
          sx={{
            flex: 1,
            p: {
              xs: 4,
              md: 6,
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          <Typography
            variant="h3"
            fontWeight="bold"
            color="white"
            mb={1}
          >
            {
              isLogin
                ? "Welcome Back"
                : "Create Account"
            }
          </Typography>

          <Typography
            color="#94A3B8"
            mb={4}
          >
            {
              isLogin
                ? "Login to continue your AI interview journey."
                : "Create your account and start practicing interviews."
            }
          </Typography>

          <Stack spacing={3}>

            {/* NAME */}

            {
              !isLogin && (
                <TextField
                  fullWidth
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root":
                      {
                        borderRadius:
                          "18px",
                        background:
                          "rgba(255,255,255,0.04)",
                        color: "white",
                      },

                    "& fieldset": {
                      borderColor:
                        "rgba(255,255,255,0.08)",
                    },
                  }}
                />
              )
            }

            {/* EMAIL */}

            <TextField
              fullWidth
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "18px",
                    background:
                      "rgba(255,255,255,0.04)",
                    color: "white",
                  },

                "& fieldset": {
                  borderColor:
                    "rgba(255,255,255,0.08)",
                },
              }}
            />

            {/* PASSWORD */}

            <TextField
              fullWidth
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {
                        showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "18px",
                    background:
                      "rgba(255,255,255,0.04)",
                    color: "white",
                  },

                "& fieldset": {
                  borderColor:
                    "rgba(255,255,255,0.08)",
                },
              }}
            />

            {/* REMEMBER */}

            {
              isLogin && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember Me"
                    sx={{
                      color:
                        "#CBD5E1",
                    }}
                  />

                  <Typography
                    sx={{
                      cursor:
                        "pointer",
                      color:
                        "#60A5FA",
                    }}
                    onClick={() =>
                      navigate(
                        "/forgot-password"
                      )
                    }
                  >
                    Forgot Password?
                  </Typography>

                </Stack>
              )
            }

            {/* BUTTON */}

            <Button
              variant="contained"
              size="large"
              disabled={loading}
              onClick={
                isLogin
                  ? handleLogin
                  : handleRegister
              }
              sx={{
                py: 1.8,
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg,#2563EB,#7C3AED)",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow:
                  "0 15px 40px rgba(37,99,235,0.35)",
              }}
            >

              {
                loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color:
                        "white",
                    }}
                  />
                ) : (
                  isLogin
                    ? "Login"
                    : "Create Account"
                )
              }

            </Button>

            {/* DIVIDER */}

            <Divider
              sx={{
                color: "#64748B",
              }}
            >
              OR CONTINUE WITH
            </Divider>

            {/* SOCIAL */}

            <Stack
              direction="row"
              spacing={2}
            >

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.5,
                  borderRadius:
                    "16px",
                  color: "white",
                  borderColor:
                    "rgba(255,255,255,0.1)",
                }}
              >
                Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                sx={{
                  py: 1.5,
                  borderRadius:
                    "16px",
                  color: "white",
                  borderColor:
                    "rgba(255,255,255,0.1)",
                }}
              >
                GitHub
              </Button>

            </Stack>

            {/* SWITCH */}

            <Typography
              textAlign="center"
              color="#94A3B8"
              mt={2}
            >

              {
                isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"
              }

              <Box
                component="span"
                sx={{
                  color: "#60A5FA",
                  cursor: "pointer",
                  ml: 1,
                  fontWeight: "bold",
                }}
                onClick={() =>
                  setIsLogin(
                    !isLogin
                  )
                }
              >
                {
                  isLogin
                    ? "Register"
                    : "Login"
                }
              </Box>

            </Typography>

          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;