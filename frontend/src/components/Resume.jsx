
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  UploadFile,
  Description,
  CheckCircle,
  AutoAwesome,
  Psychology,
  CloudUpload,
} from "@mui/icons-material";

function ResumeUpload() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [atsScore, setAtsScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");

  // ==========================================
  // FETCH RESUME ANALYTICS
  // ==========================================

  useEffect(() => {
    const fetchResumeAnalytics = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/interview/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
      } catch (error) {
        console.log("Resume Analytics Error:", error);
      }
    };

    fetchResumeAnalytics();
  }, []);

  // ==========================================
  // HANDLE RESUME UPLOAD
  // ==========================================

  const handleUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      // PDF VALIDATION
      if (file.type !== "application/pdf") {
        setErrorMessage("Only PDF files allowed");
        e.target.value = "";
        return;
      }

      // FILE SIZE VALIDATION
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Maximum file size is 10MB");
        e.target.value = "";
        return;
      }

      setFileName(file.name);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("access");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/resume/upload/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAtsScore(response.data.ats_score || 0);
      setSkills(response.data.skills || []);
      setMissingSkills(response.data.missing_skills || []);
      setAiAnalysis(response.data.ai_analysis || "");

      console.log(response.data);

      setResumeText(response.data.resume_text || "");
      setOpen(true);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
          "Resume Upload Failed"
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // ==========================================
  // COMMON PAPER STYLE
  // ==========================================

  const resultPaperStyle = {
    p: { xs: 2, sm: 2.5, md: 3 },
    mb: 3,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "20px",
    backgroundColor: "background.default",
    border: "1px solid",
    borderColor: "divider",
    color: "text.primary",
    overflow: "hidden",
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",

          borderRadius: { xs: "18px", sm: "24px", md: "32px" },

          p: { xs: 2, sm: 3, md: 4 },

          backgroundColor: "background.paper",

          border: "1px solid",
          borderColor: "divider",

          backdropFilter: "blur(20px)",

          boxShadow: "0px 20px 60px rgba(0,0,0,0.45)",

          transition: "0.3s ease",

          "&:hover": {
            boxShadow: {
              xs: "0px 20px 60px rgba(0,0,0,0.45)",
              md: "0px 30px 80px rgba(59,130,246,0.18)",
            },
          },
        }}
      >
        {/* GLOW */}

        <Box
          sx={{
            position: "absolute",
            width: { xs: 150, sm: 200, md: 250 },
            height: { xs: 150, sm: 200, md: 250 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(59,130,246,0.25),transparent)",
            top: -100,
            right: -100,
            pointerEvents: "none",
          }}
        />

        {/* HEADER */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 2.5 }}
          mb={3}
          sx={{
            position: "relative",
            minWidth: 0,
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 52, sm: 60, md: 65 },
              height: { xs: 52, sm: 60, md: 65 },
              flexShrink: 0,
              background:
                "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              boxShadow:
                "0px 10px 30px rgba(59,130,246,0.4)",
            }}
          >
            <Description
              sx={{ fontSize: { xs: 28, sm: 32, md: 35 } }}
            />
          </Avatar>

          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                letterSpacing: { xs: 0, sm: 1 },
                fontSize: {
                  xs: "1.55rem",
                  sm: "1.8rem",
                  md: "2.125rem",
                },
                overflowWrap: "anywhere",
              }}
            >
              AI Resume Analyzer
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                mt: 0.5,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                lineHeight: 1.7,
              }}
            >
              Upload your resume and get AI-powered career
              insights.
            </Typography>
          </Box>
        </Stack>

        {/* FEATURE CHIPS */}

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          mb={4}
          sx={{ position: "relative", flexWrap: "wrap" }}
        >
          <Chip
            icon={<AutoAwesome />}
            label="ATS Optimization"
            sx={{
              bgcolor: "rgba(59,130,246,0.15)",
              color: "#60A5FA",
              border: "1px solid rgba(59,130,246,0.3)",
              maxWidth: "100%",
            }}
          />

          <Chip
            icon={<Psychology />}
            label="AI Analysis"
            sx={{
              bgcolor: "rgba(139,92,246,0.15)",
              color: "#A78BFA",
              border: "1px solid rgba(139,92,246,0.3)",
              maxWidth: "100%",
            }}
          />

          <Chip
            icon={<CheckCircle />}
            label="Skill Detection"
            sx={{
              bgcolor: "rgba(16,185,129,0.15)",
              color: "#34D399",
              border: "1px solid rgba(16,185,129,0.3)",
              maxWidth: "100%",
            }}
          />
        </Stack>

        {/* UPLOAD AREA */}

        <Box
          sx={{
            position: "relative",
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: { xs: "16px", sm: "20px", md: "24px" },
            p: { xs: 2.5, sm: 4, md: 5 },
            textAlign: "center",
            backgroundColor: "background.default",
            transition: "0.3s",

            "&:hover": {
              border: "2px dashed rgba(59,130,246,0.6)",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 65, sm: 80, md: 90 },
              height: { xs: 65, sm: 80, md: 90 },
              margin: "auto",
              mb: 3,
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
              boxShadow:
                "0px 15px 40px rgba(37,99,235,0.4)",
            }}
          >
            <CloudUpload
              sx={{ fontSize: { xs: 36, sm: 44, md: 50 } }}
            />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.primary"
            mb={1}
            sx={{
              fontSize: {
                xs: "1.15rem",
                sm: "1.35rem",
                md: "1.5rem",
              },
            }}
          >
            Upload Your Resume
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              mb: 3,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              lineHeight: 1.7,
            }}
          >
            Supported Format: PDF • Max Size: 10MB
          </Typography>

          <Button
            component="label"
            variant="contained"
            size="large"
            fullWidth={isMobile}
            startIcon={<UploadFile />}
            disabled={loading}
            sx={{
              px: { xs: 2, sm: 4, md: 5 },
              py: 1.7,
              maxWidth: { xs: "100%", sm: "280px" },
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "none",
              background:
                "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              boxShadow:
                "0px 10px 30px rgba(59,130,246,0.35)",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#2563EB,#7C3AED)",
              },
            }}
          >
            Upload Resume

            <input
              hidden
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleUpload}
            />
          </Button>
        </Box>

        {/* LOADING */}

        {loading && (
          <Box mt={4}>
            <Typography
              sx={{
                color: "#94A3B8",
                mb: 1,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
              }}
            >
              AI is analyzing your resume...
            </Typography>

            <LinearProgress
              sx={{
                height: 10,
                borderRadius: 10,
              }}
            />
          </Box>
        )}

        {/* FILE INFO */}

        {fileName && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: { xs: 2, sm: 3 },
              borderRadius: "20px",
              backgroundColor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ minWidth: 0, alignItems: "center" }}
            >
              <Avatar
                sx={{
                  bgcolor: "#2563EB",
                  flexShrink: 0,
                }}
              >
                <Description />
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  color="text.primary"
                  fontWeight="bold"
                  sx={{
                    overflowWrap: "anywhere",
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                  }}
                >
                  {fileName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Resume uploaded successfully
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* ATS SCORE */}

        <Paper sx={resultPaperStyle}>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "text.primary" }}
            >
              ATS Score
            </Typography>

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#60A5FA" }}
            >
              {atsScore}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, Number(atsScore) || 0))}
            sx={{
              height: 12,
              borderRadius: 5,
              mt: 2,
              backgroundColor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                background:
                  "linear-gradient(90deg,#3B82F6,#8B5CF6)",
              },
            }}
          />
        </Paper>

        {/* DETECTED SKILLS */}

        <Paper sx={resultPaperStyle}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "text.primary", mb: 2 }}
          >
            Detected Skills
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
          >
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="success"
                  sx={{ maxWidth: "100%" }}
                />
              ))
            ) : (
              <Typography color="text.secondary">
                No skills detected yet.
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* MISSING SKILLS */}

        <Paper sx={resultPaperStyle}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "text.primary", mb: 2 }}
          >
            Missing Skills
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
          >
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="error"
                  sx={{ maxWidth: "100%" }}
                />
              ))
            ) : (
              <Typography color="text.secondary">
                No missing skills identified.
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* AI ANALYSIS */}

        <Paper sx={resultPaperStyle}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "text.primary" }}
          >
            AI Resume Analysis
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.8,
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            {aiAnalysis || "AI analysis will appear here after resume upload."}
          </Typography>
        </Paper>

        {/* RESUME PREVIEW */}

        {resumeText && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              borderRadius: "24px",
              overflow: "hidden",
              minWidth: 0,
              backgroundColor: "background.default",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                backgroundColor: "action.hover",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
              >
                AI Resume Preview
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "divider" }} />

            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                maxHeight: { xs: 300, sm: 350 },
                overflowY: "auto",
                overflowX: "hidden",
                overflowWrap: "anywhere",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                {resumeText.substring(0, 3000)}
              </Typography>
            </Box>
          </Paper>
        )}
      </Paper>

      {/* SUCCESS SNACKBAR */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{
          width: { xs: "calc(100% - 32px)", sm: "auto" },
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Resume Uploaded Successfully
        </Alert>
      </Snackbar>

      {/* ERROR SNACKBAR */}

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{
          width: { xs: "calc(100% - 32px)", sm: "auto" },
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResumeUpload;
