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
import ThemeToggle from "../components/ThemeToggle";

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
        width: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3 },
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: 12, sm: 16 },
          right: { xs: 12, sm: 16 },
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <ThemeToggle />
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: { xs: 3, sm: 5 },
          borderRadius: { xs: "22px", sm: "30px" },
          backgroundColor: "background.paper",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          mb={1}
        >
          Forgot Password
        </Typography>

        <Typography
          color="text.secondary"
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
            slotProps={{
              input: {
              startAdornment: (
                <Phone
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                  }}
                />
              ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: "background.default",
                color: "text.primary",
              },

              "& fieldset": {
                borderColor: "divider",
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