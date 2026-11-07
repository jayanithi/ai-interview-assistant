import React, { useState } from "react";

import axios from "axios";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import {
  Phone,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

 const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // SEND OTP API
  const handleSendOtp = async () => {
    if (!email) {
      alert("Enter Email Address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/send-otp/",
        {
          email: email,
        }
      );

      console.log(response.data);

      alert("OTP Sent Successfully");

      // OTP page ku navigate
      navigate("/verify-otp", {
        state: {
          email: email,
        },
      });

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message || "Failed");
      } else {
        alert("Server Error");
      }

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
          "linear-gradient(to bottom right,#020617,#0f172a,#111827)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 450,
          p: 5,
          borderRadius: "30px",
          background:
            "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="white"
          mb={1}
        >
          Forgot Password
        </Typography>

        <Typography
          color="#94A3B8"
          mb={4}
        >
          Enter your email address to receive
          OTP verification.
        </Typography>

        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <Phone
                  sx={{
                    mr: 1,
                    color: "#94A3B8",
                  }}
                />
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
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

          <Button
            variant="contained"
            size="large"
            onClick={handleSendOtp}
            disabled={loading}
            sx={{
              py: 1.8,
              borderRadius: "18px",
              textTransform: "none",
              fontWeight: "bold",
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "white" }}
              />
            ) : (
              "Send OTP"
            )}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;