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
import ThemeToggle from "../components/ThemeToggle";

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
        backgroundColor: "background.default",
        overflow: "hidden",
        position: "relative",
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <ThemeToggle />
      </Box>

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
          borderRadius: { xs: "22px", sm: "35px" },
          overflow: "hidden",
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          backgroundColor: "background.paper",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >

        {/* LEFT SECTION */}

        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4, md: 6 },
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg,#1E3A8A,#2563EB,#7C3AED)"
                : theme.palette.background.paper,
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >

          <Avatar
            sx={{
              width: { xs: 64, sm: 90 },
              height: { xs: 64, sm: 90 },
              mb: { xs: 2, sm: 4 },
              background:
                "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <AutoAwesome
              sx={{
                fontSize: { xs: 32, sm: 45 },
              }}
            />
          </Avatar>

          <Typography
            variant="h2"
            fontWeight="bold"
            mb={{ xs: 2, sm: 3 }}
            sx={{
              lineHeight: 1.1,
              fontSize: { xs: "2rem", sm: "2.75rem", md: "3.75rem" },
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
            spacing={{ xs: 1.5, sm: 2 }}
            mt={{ xs: 3, sm: 5 }}
          >

            <Paper
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                borderRadius: "18px",
                backgroundColor: "action.hover",
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
                backgroundColor: "action.hover",
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
              xs: 2.5,
              sm: 4,
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
            color="text.primary"
            mb={1}
            sx={{ fontSize: { xs: "1.8rem", sm: "2.25rem", md: "3rem" } }}
          >
            {
              isLogin
                ? "Welcome Back"
                : "Create Account"
            }
          </Typography>

          <Typography
            color="text.secondary"
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
                  slotProps={{
                    input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root":
                      {
                        borderRadius:
                          "18px",
                        backgroundColor: "background.default",
                        color: "text.primary",
                      },

                    "& fieldset": {
                      borderColor: "divider",
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
              slotProps={{
                input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "18px",
                    backgroundColor: "background.default",
                    color: "text.primary",
                  },

                "& fieldset": {
                  borderColor: "divider",
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
              slotProps={{
                input: {
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
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    borderRadius:
                      "18px",
                    backgroundColor: "background.default",
                    color: "text.primary",
                  },

                "& fieldset": {
                  borderColor: "divider",
                },
              }}
            />

            {/* REMEMBER */}

            {
              isLogin && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 0 }}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                >

                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember Me"
                    sx={{
                      color: "text.secondary",
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
                color: "text.secondary",
              }}
            >
              OR CONTINUE WITH
            </Divider>

            {/* SOCIAL */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.5,
                  borderRadius:
                    "16px",
                  color: "text.primary",
                  borderColor: "divider",
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
                  color: "text.primary",
                  borderColor: "divider",
                }}
              >
                GitHub
              </Button>

            </Stack>

            {/* SWITCH */}

            <Typography
              color="text.secondary"
              mt={2}
              sx={{ textAlign: "center" }}
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