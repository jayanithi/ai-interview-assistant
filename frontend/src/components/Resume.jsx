
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
  CircularProgress
} from "@mui/material";

import {
  UploadFile,
  Description,
  CheckCircle,
  AutoAwesome,
  Psychology,
  CloudUpload
} from "@mui/icons-material";

const API_URL = "http://127.0.0.1:8000/api/resume/";

function ResumeUpload() {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [atsScore, setAtsScore] = useState(0);
  const [atsRating, setAtsRating] = useState("");

  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiStatus, setAiStatus] = useState("");

  const [resumeId, setResumeId] = useState(null);
  const [atsBreakdown, setAtsBreakdown] = useState({});

  // ==========================================
  // GET LATEST RESUME ANALYTICS
  // ==========================================

  const fetchResumeAnalytics = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await axios.get(
        `${API_URL}analytics/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data;

      if (data.success) {
        setResumeId(data.resume_id || null);

        setFileName(data.resume_name || "");

        setAtsScore(data.ats_score || 0);

        setAtsRating(data.ats_rating || "");

        setSkills(data.skills || []);

        setMissingSkills(data.missing_skills || []);

        setAtsBreakdown(data.ats_breakdown || {});

        setAiAnalysis(data.ai_analysis || "");

        setAiStatus(data.ai_status || "processing");
      }

    } catch (error) {
      console.log(
        "Resume Analytics Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // LOAD PREVIOUS RESUME
  // ==========================================

  useEffect(() => {
    fetchResumeAnalytics();
  }, []);

  // ==========================================
  // AUTOMATIC AI ANALYSIS POLLING
  // ==========================================

  useEffect(() => {
    if (!resumeId || aiStatus !== "processing") {
      return;
    }

    const token = localStorage.getItem("access");

    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_URL}analytics/`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = response.data;

        if (data.success && data.resume_id === resumeId) {
          setAiStatus(data.ai_status || "processing");

          setAiAnalysis(data.ai_analysis || "");

          setAtsScore(data.ats_score || 0);

          setAtsRating(data.ats_rating || "");

          setSkills(data.skills || []);

          setMissingSkills(data.missing_skills || []);

          setAtsBreakdown(data.ats_breakdown || {});

          // Stop polling automatically when status changes.
          if (
            ["completed", "fallback", "failed"].includes(
              data.ai_status
            )
          ) {
            clearInterval(intervalId);
          }
        }

      } catch (error) {
        console.log(
          "AI STATUS CHECK ERROR:",
          error.response?.data || error.message
        );
      }
    }, 3000);

    return () => clearInterval(intervalId);

  }, [resumeId, aiStatus]);

  // ==========================================
  // HANDLE RESUME UPLOAD
  // ==========================================

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      if (file.type !== "application/pdf") {
        setErrorMessage("Only PDF files allowed");
        e.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("PDF size must be below 10 MB");
        e.target.value = "";
        return;
      }

      setFileName(file.name);
      setLoading(true);

      // Reset previous results
      setAtsScore(0);
      setAtsRating("");
      setSkills([]);
      setMissingSkills([]);
      setAiAnalysis("");
      setAiStatus("processing");
      setResumeId(null);
      setAtsBreakdown({});

      const formData = new FormData();

      formData.append("file", file);

      const token = localStorage.getItem("access");

      const response = await axios.post(
        `${API_URL}upload/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const data = response.data;

      // Save upload response
      setResumeId(data.resume_id || null);

      setAtsScore(data.ats_score || 0);

      setAtsRating(data.ats_rating || "");

      setSkills(data.skills || []);

      setMissingSkills(data.missing_skills || []);

      setAtsBreakdown(data.ats_breakdown || {});

      setAiAnalysis(data.ai_analysis || "");

      setAiStatus(data.ai_status || "processing");

      console.log("RESUME UPLOAD:", data);

      setOpen(true);

    } catch (error) {
      console.log("UPLOAD ERROR:", error);

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
  // AI STATUS LABEL
  // ==========================================

  const getStatusLabel = () => {
    switch (aiStatus) {
      case "processing":
        return "AI is analyzing your resume...";

      case "completed":
        return "AI Analysis Completed";

      case "fallback":
        return "Rule-based Analysis Available";

      case "failed":
        return "AI Analysis Failed";

      default:
        return "Waiting for AI Analysis";
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          padding: { xs: 2, sm: 3, md: 4 },

          background:
            "linear-gradient(145deg,#020617,#0f172a,#111827)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          backdropFilter: "blur(20px)",

          boxShadow:
            "0px 20px 60px rgba(0,0,0,0.45)",

          transition: "0.4s ease",

          "&:hover": {
            boxShadow:
              "0px 30px 80px rgba(59,130,246,0.25)"
          }
        }}
      >
        {/* GLOW */}

        <Box
          sx={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(59,130,246,0.25),transparent)",
            top: -100,
            right: -100,
            pointerEvents: "none"
          }}
        />

        {/* HEADER */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={3}
        >
          <Avatar
            sx={{
              width: 65,
              height: 65,
              background:
                "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              boxShadow:
                "0px 10px 30px rgba(59,130,246,0.4)"
            }}
          >
            <Description sx={{ fontSize: 35 }} />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "white",
                letterSpacing: 1,
                fontSize: { xs: "24px", sm: "32px" }
              }}
            >
              AI Resume Analyzer
            </Typography>

            <Typography
              sx={{ color: "#94A3B8", mt: 0.5 }}
            >
              Upload your resume and get AI-powered career insights.
            </Typography>
          </Box>
        </Stack>

        {/* FEATURE CHIPS */}

        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
          mb={4}
        >
          <Chip
            icon={<AutoAwesome />}
            label="ATS Optimization"
            sx={{
              bgcolor: "rgba(59,130,246,0.15)",
              color: "#60A5FA",
              border: "1px solid rgba(59,130,246,0.3)"
            }}
          />

          <Chip
            icon={<Psychology />}
            label="AI Analysis"
            sx={{
              bgcolor: "rgba(139,92,246,0.15)",
              color: "#A78BFA",
              border: "1px solid rgba(139,92,246,0.3)"
            }}
          />

          <Chip
            icon={<CheckCircle />}
            label="Skill Detection"
            sx={{
              bgcolor: "rgba(16,185,129,0.15)",
              color: "#34D399",
              border: "1px solid rgba(16,185,129,0.3)"
            }}
          />
        </Stack>

        {/* UPLOAD AREA */}

        <Box
          sx={{
            border: "2px dashed rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: { xs: 3, sm: 5 },
            textAlign: "center",
            background: "rgba(255,255,255,0.03)",
            transition: "0.3s",

            "&:hover": {
              border: "2px dashed rgba(59,130,246,0.6)",
              background: "rgba(59,130,246,0.05)"
            }
          }}
        >
          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              mb: 3,
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
              boxShadow:
                "0px 15px 40px rgba(37,99,235,0.4)"
            }}
          >
            <CloudUpload sx={{ fontSize: 50 }} />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight="bold"
            color="white"
            mb={1}
          >
            Upload Your Resume
          </Typography>

          <Typography
            sx={{ color: "#94A3B8", mb: 4 }}
          >
            Supported Format: PDF • Max Size: 10MB
          </Typography>

          <Button
            component="label"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<UploadFile />}
            sx={{
              px: 5,
              py: 1.7,
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
                transform: "scale(1.03)"
              }
            }}
          >
            {loading ? "Uploading..." : "Upload Resume"}

            <input
              hidden
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleUpload}
            />
          </Button>
        </Box>

        {/* UPLOAD LOADING */}

        {loading && (
          <Box mt={4}>
            <Typography
              sx={{ color: "#94A3B8", mb: 1 }}
            >
              Uploading resume...
            </Typography>

            <LinearProgress
              sx={{
                height: 10,
                borderRadius: 10
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
              p: 3,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)"
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Avatar sx={{ bgcolor: "#2563EB" }}>
                <Description />
              </Avatar>

              <Box>
                <Typography
                  color="white"
                  fontWeight="bold"
                >
                  {fileName}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#94A3B8" }}
                >
                  Resume uploaded successfully
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* ATS SCORE */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            mb: 3,
            background: "rgba(255,255,255,0.04)",
            color: "white"
          }}
        >
          <Typography variant="h6">
            ATS Score
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mt: 1 }}
          >
            {atsScore}%
          </Typography>

          <LinearProgress
            variant="determinate"
            value={atsScore}
            sx={{
              height: 12,
              borderRadius: 5,
              mt: 2
            }}
          />

          {atsRating && (
            <Chip
              label={atsRating}
              sx={{
                mt: 2,
                color: "#60A5FA",
                bgcolor: "rgba(59,130,246,0.15)"
              }}
            />
          )}

          {Object.keys(atsBreakdown).length > 0 && (
            <Box mt={3}>
              <Typography fontWeight="bold" mb={2}>
                Score Breakdown
              </Typography>

              {Object.entries(atsBreakdown).map(
                ([key, value]) => (
                  <Stack
                    key={key}
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      sx={{
                        color: "#CBD5E1",
                        textTransform: "capitalize"
                      }}
                    >
                      {key}
                    </Typography>

                    <Typography color="white">
                      {value} points
                    </Typography>
                  </Stack>
                )
              )}
            </Box>
          )}
        </Paper>

        {/* DETECTED SKILLS */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: "rgba(255,255,255,0.04)",
            color: "white"
          }}
        >
          <Typography variant="h6" mb={2}>
            Detected Skills
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="success"
                />
              ))
            ) : (
              <Typography color="#94A3B8">
                No skills detected yet.
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* MISSING SKILLS */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: "rgba(255,255,255,0.04)",
            color: "white"
          }}
        >
          <Typography variant="h6" mb={2}>
            Missing Skills
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="error"
                />
              ))
            ) : (
              <Typography color="#94A3B8">
                No job-specific missing skills identified.
                Add a job description for targeted skill matching.
              </Typography>
            )}
          </Stack>
        </Paper>

        {/* AI RESUME ANALYSIS */}

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: "rgba(255,255,255,0.04)",
            color: "white"
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mb={2}
          >
            <Psychology sx={{ color: "#A78BFA" }} />

            <Typography variant="h6">
              AI Resume Analysis
            </Typography>
          </Stack>

          {aiStatus === "processing" && (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                mb={2}
              >
                <CircularProgress
                  size={22}
                  sx={{ color: "#60A5FA" }}
                />

                <Typography color="#60A5FA">
                  {getStatusLabel()}
                </Typography>
              </Stack>

              <LinearProgress />
              <Typography
                variant="body2"
                sx={{ color: "#94A3B8", mt: 2 }}
              >
                This section will update automatically when AI analysis finishes.
              </Typography>
            </Box>
          )}

          {aiStatus === "completed" && (
            <Chip
              label={getStatusLabel()}
              color="success"
              sx={{ mb: 2 }}
            />
          )}

          {aiStatus === "fallback" && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Ollama AI was unavailable. Showing fallback analysis.
            </Alert>
          )}

          {aiStatus === "failed" && (
            <Alert severity="error" sx={{ mb: 2 }}>
              AI analysis failed. Please check Ollama and try again.
            </Alert>
          )}

          {aiAnalysis ? (
            <Typography
              sx={{
                mt: 1,
                whiteSpace: "pre-line",
                lineHeight: 1.9,
                color: "#CBD5E1"
              }}
            >
              {aiAnalysis}
            </Typography>
          ) : (
            aiStatus !== "processing" && (
              <Typography color="#94A3B8">
                AI analysis is not available.
              </Typography>
            )
          )}
        </Paper>

      </Paper>

      {/* SUCCESS SNACKBAR */}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Alert severity="success" variant="filled">
          Resume Uploaded Successfully
        </Alert>
      </Snackbar>

      {/* ERROR SNACKBAR */}

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >
        <Alert severity="error" variant="filled">
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResumeUpload;
