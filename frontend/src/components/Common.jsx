// src/components/Common/Common.jsx

import React, {
  useEffect,
  useState
} from "react";

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Stack,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

import axios from "axios";
import ThemeToggle from "./ThemeToggle";


// ============================================
// API BASE URL
// ============================================

const API =
  "http://127.0.0.1:8000/api";


// ============================================
// LOADING SCREEN
// ============================================

export const LoadingScreen = ({
  text = "Loading AI Engine...",
}) => {

  return (

    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 3,
        backgroundColor: "background.default",
      }}
    >

      <CircularProgress size={70} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "text.primary",
        }}
      >
        {text}
      </Typography>

    </Box>
  );
};


// ============================================
// CUSTOM CARD
// ============================================

export const CustomCard = ({
  children,
  padding = 4,
}) => {

  return (

    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: padding },
        borderRadius: "24px",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(12px)",
        transition: "0.3s",
        color: "text.primary",

        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: "#3b82f6",
        },
      }}
    >
      {children}
    </Paper>
  );
};


// ============================================
// SECTION TITLE
// ============================================

export const SectionTitle = ({
  title,
  subtitle,
}) => {

  return (

    <Box sx={{ mb: 5 }}>

      <Typography
        variant="h3"
        fontWeight="bold"
        color="text.primary"
        sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }, overflowWrap: "anywhere" }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mt: 1,
        }}
      >
        {subtitle}
      </Typography>

    </Box>
  );
};


// ============================================
// PRIMARY BUTTON
// ============================================

export const PrimaryButton = ({
  text,
  icon,
  onClick,
  fullWidth = false,
  loading = false,
}) => {

  return (

    <Button
      variant="contained"
      startIcon={!loading && icon}
      onClick={onClick}
      disabled={loading}
      fullWidth={fullWidth}
      sx={{
        py: 1.5,
        px: 4,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "16px",
        boxShadow: "none",
        background:
          "linear-gradient(90deg,#3b82f6,#8b5cf6)",

        "&:hover": {
          boxShadow:
            "0px 0px 20px rgba(59,130,246,0.4)",
        },
      }}
    >

      {
        loading
          ? "Loading..."
          : text
      }

    </Button>
  );
};


// ============================================
// STATUS CHIP
// ============================================

export const StatusChip = ({
  status = "success",
}) => {

  const getChipData = () => {

    switch (status) {

      case "success":
        return {
          label: "Success",
          color: "success",
          icon: <CheckCircleIcon />,
        };

      case "error":
        return {
          label: "Error",
          color: "error",
          icon: <ErrorIcon />,
        };

      default:
        return {
          label: "Info",
          color: "primary",
          icon: <InfoIcon />,
        };
    }
  };

  const chip = getChipData();

  return (

    <Chip
      icon={chip.icon}
      label={chip.label}
      color={chip.color}
      sx={{
        borderRadius: "10px",
        fontWeight: "bold",
      }}
    />
  );
};


// ============================================
// USER PROFILE CARD
// ============================================

export const UserProfileCard = () => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response = await axios.get(

        `${API}/accounts/profile/`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);

      setLoading(false);

    } catch (error) {

      console.log(error);

      setLoading(false);
    }
  };

  if (loading) {

    return (
      <CustomCard>
        <Typography>
          Loading Profile...
        </Typography>
      </CustomCard>
    );
  }

  return (

    <CustomCard>

      <Stack
        direction="row"
        spacing={3}
        sx={{ minWidth: 0, alignItems: "center" }}
      >

        <Avatar
          src={user?.avatar}
          sx={{
            width: 70,
            height: 70,
            bgcolor: "#2563EB",
          }}
        >
          {
            user?.name?.charAt(0)
          }
        </Avatar>

        <Box sx={{ minWidth: 0 }}>

          <Typography
            variant="h6"
            fontWeight="bold"
              sx={{ overflowWrap: "anywhere", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {user?.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ overflowWrap: "anywhere", fontSize: { xs: "0.8rem", sm: "1rem" } }}
          >
            {user?.email}
          </Typography>

        </Box>

      </Stack>

    </CustomCard>
  );
};


// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = ({
  title = "No Data Found",
  subtitle = "Try adding new data.",
}) => {

  return (

    <CustomCard>

      <Box
        sx={{
          textAlign: "center",
          py: 5,
        }}
      >

        <Typography
          variant="h5"
          fontWeight="bold"
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 2,
          }}
        >
          {subtitle}
        </Typography>

      </Box>

    </CustomCard>
  );
};


// ============================================
// STATS CARD
// ============================================

export const StatsCard = ({
  title,
  endpoint,
  icon,
}) => {

  const [value, setValue] =
    useState(0);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response = await axios.get(

        `${API}/${endpoint}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setValue(
        response.data.value
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <CustomCard>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <Box>

          <Typography
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            {value}
          </Typography>

        </Box>

        <Box
          sx={{
            backgroundColor: "action.hover",
            p: 2,
            borderRadius: "16px",
          }}
        >
          {icon}
        </Box>

      </Stack>

    </CustomCard>
  );
};


// ============================================
// DIVIDER TITLE
// ============================================

export const DividerTitle = ({
  text,
}) => {

  return (

    <Box sx={{ my: 5 }}>

      <Divider>

        <Typography
          sx={{
            color: "text.secondary",
            px: 2,
          }}
        >
          {text}
        </Typography>

      </Divider>

    </Box>
  );
};


// ============================================
// DEFAULT COMMON COMPONENT
// ============================================

const Common = () => {

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        p: { xs: 2, sm: 3, md: 5 },
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <SectionTitle
        title="Common Components"
        subtitle="Reusable UI Components"
      />

      <Stack spacing={4}>

        <UserProfileCard />

        <StatsCard
          title="Total Interviews"
          endpoint="dashboard/stats/"
          icon={<InfoIcon />}
        />

        <StatusChip status="success" />

        <PrimaryButton
          text="Start Interview"
        />

        <EmptyState />

      </Stack>

    </Box>
  );
};

export default Common;