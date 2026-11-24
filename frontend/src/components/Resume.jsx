
import React, { useState, useEffect, useRef } from "react";
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

const API_BASE_URL = "http://127.0.0.1:8000/api/resume/";

const POLLING_INTERVAL = 2000;
const MAX_POLLING_ATTEMPTS = 60;

function ResumeUpload() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ==========================================
  // STATES
  // ==========================================

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [atsScore, setAtsScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");

  const [aiStatus, setAiStatus] = useState("idle");

  // Prevent duplicate polling requests
  const pollingPromiseRef = useRef(null);

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access");

    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ==========================================
  // UPDATE RESUME DATA
  // ==========================================

  const updateResumeData = (data) => {
    setAtsScore(Number(data.ats_score) || 0);

    setSkills(
      Array.isArray(data.skills) ? data.skills : []
    );

    setMissingSkills(
      Array.isArray(data.missing_skills)
        ? data.missing_skills
        : []
    );

    setAiAnalysis(
      typeof data.ai_analysis === "string"
        ? data.ai_analysis
        : ""
    );

    setResumeText(data.resume_text || "");

    if (data.resume_name) {
      setFileName(data.resume_name);
    }

    setAiStatus(data.ai_status || "processing");
  };

  // ==========================================
  // FETCH LATEST RESUME ANALYTICS
  // ==========================================

  const fetchResumeAnalytics = async () => {
    const response = await axios.get(
      `${API_BASE_URL}analytics/`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("RESUME ANALYTICS:", response.data);

    updateResumeData(response.data);

    return response.data;
  };

  // ==========================================
  // POLLING - GET ACTUAL OLLAMA AI RESPONSE
  // ==========================================

  const pollResumeAnalysis = async () => {
    // Avoid multiple polling loops
    if (pollingPromiseRef.current) {
      return pollingPromiseRef.current;
    }

    const pollingTask = (async () => {
      try {
        console.log("AI POLLING STARTED");

        setAiStatus("processing");

        for (
          let attempt = 1;
          attempt <= MAX_POLLING_ATTEMPTS;
          attempt++
        ) {
          // Wait 2 seconds
          await new Promise((resolve) =>
            setTimeout(resolve, POLLING_INTERVAL)
          );

          try {
            const response = await axios.get(
              `${API_BASE_URL}analytics/`,
              {
                headers: getAuthHeaders(),
              }
            );

            const data = response.data;

            console.log(
              `AI POLLING ATTEMPT ${attempt}:`,
              data.ai_status
            );

            // Update frontend with backend data
            updateResumeData(data);

            // AI completed successfully
            if (data.ai_status === "completed") {
              console.log(
                "OLLAMA AI RESPONSE RECEIVED SUCCESSFULLY!"
              );

              console.log("AI ANALYSIS:", data.ai_analysis);

              if (!data.ai_analysis?.trim()) {
                setAiStatus("fallback");
              }

              return data;
            }

            // AI fallback response
            if (data.ai_status === "fallback") {
              console.log("AI ANALYSIS FALLBACK");

              return data;
            }

            // Backend reports failed
            if (data.ai_status === "failed") {
              setAiStatus("failed");

              setErrorMessage(
                "AI analysis failed. Please try uploading again."
              );

              return data;
            }

            // Still processing - continue polling
          } catch (error) {
            console.log(
              "AI POLLING REQUEST ERROR:",
              error.response?.data || error.message
            );

            // Authentication errors cannot be fixed by retrying
            if (
              error.response?.status === 401 ||
              error.response?.status === 403
            ) {
              setAiStatus("failed");

              setErrorMessage(
                "Session expired. Please login again."
              );

              return null;
            }

            // Other temporary errors: continue polling
          }
        }

        // Timeout after 120 seconds
        console.log("AI ANALYSIS POLLING TIMEOUT");

        setAiStatus("timeout");

        return null;
      } finally {
        pollingPromiseRef.current = null;
      }
    })();

    pollingPromiseRef.current = pollingTask;

    return pollingTask;
  };

  // ==========================================
  // LOAD PREVIOUS RESUME WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadResume = async () => {
      try {
        const data = await fetchResumeAnalytics();

        if (!isMounted) return;

        if (data.ai_status === "processing") {
          await pollResumeAnalysis();
        }
      } catch (error) {
        if (!isMounted) return;

        console.log(
          "RESUME ANALYTICS ERROR:",
          error.response?.data || error.message
        );

        if (error.response?.status === 404) {
          console.log("No previous resume found.");
          return;
        }

        if (error.response?.status === 401) {
          setErrorMessage(
            "Session expired. Please login again."
          );
        }
      }
    };

    loadResume();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==========================================
  // HANDLE RESUME UPLOAD
  // ==========================================

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      // Clear previous error
      setErrorMessage("");

      // ========================================
      // PDF VALIDATION
      // ========================================

      const isPDF =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPDF) {
        setErrorMessage("Only PDF files allowed");
        return;
      }

      // ========================================
      // FILE SIZE VALIDATION
      // ========================================

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Maximum file size is 10MB");
        return;
      }

      if (file.size === 0) {
        setErrorMessage("Selected PDF file is empty");
        return;
      }

      // ========================================
      // RESET PREVIOUS DATA
      // ========================================

      setLoading(true);

      setFileName(file.name);
      setResumeText("");

      setAtsScore(0);
      setSkills([]);
      setMissingSkills([]);
      setAiAnalysis("");

      setAiStatus("processing");

      const formData = new FormData();

      formData.append("file", file);

      // ========================================
      // UPLOAD TO DJANGO BACKEND
      // ========================================

      console.log("RESUME UPLOAD STARTED");

      const response = await axios.post(
        `${API_BASE_URL}upload/`,
        formData,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(
        "RESUME UPLOAD RESPONSE:",
        response.data
      );

      // ========================================
      // UPDATE INITIAL BACKEND RESPONSE
      // ========================================

      updateResumeData(response.data);

      // Show success notification
      setOpen(true);

      // ========================================
      // WAIT FOR OLLAMA AI RESPONSE
      // ========================================

      if (response.data.ai_status === "processing") {
        console.log(
          "WAITING FOR OLLAMA AI ANALYSIS..."
        );

        await pollResumeAnalysis();
      } else if (response.data.ai_status === "completed") {
        console.log("AI ANALYSIS ALREADY COMPLETED");
      } else if (response.data.ai_status === "fallback") {
        console.log("AI ANALYSIS FALLBACK RECEIVED");
      }
    } catch (error) {
      console.log(
        "RESUME UPLOAD ERROR:",
        error.response?.data || error.message
      );

      setAiStatus("failed");

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Resume Upload Failed"
      );
    } finally {
      setLoading(false);

      // Reset file input
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

  // ==========================================
  // UI
  // ==========================================

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

          borderRadius: {
            xs: "18px",
            sm: "24px",
            md: "32px",
          },

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

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
            width: {
              xs: 150,
              sm: 200,
              md: 250,
            },
            height: {
              xs: 150,
              sm: 200,
              md: 250,
            },
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
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={{
            xs: 2,
            sm: 2.5,
          }}
          mb={3}
          sx={{
            position: "relative",
            minWidth: 0,
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          <Avatar
            sx={{
              width: {
                xs: 52,
                sm: 60,
                md: 65,
              },
              height: {
                xs: 52,
                sm: 60,
                md: 65,
              },
              flexShrink: 0,
              background:
                "linear-gradient(135deg,#3B82F6,#8B5CF6)",
              boxShadow:
                "0px 10px 30px rgba(59,130,246,0.4)",
            }}
          >
            <Description
              sx={{
                fontSize: {
                  xs: 28,
                  sm: 32,
                  md: 35,
                },
              }}
            />
          </Avatar>

          <Box sx={{ minWidth: 0, width: "100%" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "text.primary",
                letterSpacing: {
                  xs: 0,
                  sm: 1,
                },
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
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                },
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
          sx={{
            position: "relative",
            flexWrap: "wrap",
          }}
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
            borderRadius: {
              xs: "16px",
              sm: "20px",
              md: "24px",
            },
            p: {
              xs: 2.5,
              sm: 4,
              md: 5,
            },
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
              width: {
                xs: 65,
                sm: 80,
                md: 90,
              },
              height: {
                xs: 65,
                sm: 80,
                md: 90,
              },
              margin: "auto",
              mb: 3,
              background:
                "linear-gradient(135deg,#2563EB,#7C3AED)",
              boxShadow:
                "0px 15px 40px rgba(37,99,235,0.4)",
            }}
          >
            <CloudUpload
              sx={{
                fontSize: {
                  xs: 36,
                  sm: 44,
                  md: 50,
                },
              }}
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
              fontSize: {
                xs: "0.8rem",
                sm: "0.9rem",
              },
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
              px: {
                xs: 2,
                sm: 4,
                md: 5,
              },
              py: 1.7,
              maxWidth: {
                xs: "100%",
                sm: "280px",
              },
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
            {loading ? "Analyzing Resume..." : "Upload Resume"}

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
                fontSize: {
                  xs: "0.85rem",
                  sm: "0.95rem",
                },
              }}
            >
              {aiStatus === "processing"
                ? "Ollama AI is analyzing your resume..."
                : "Uploading your resume..."}
            </Typography>

            <LinearProgress
              sx={{
                height: 10,
                borderRadius: 10,
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Please wait. This may take a few moments.
            </Typography>
          </Box>
        )}

        {/* FILE INFO */}

        {fileName && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: {
                xs: 2,
                sm: 3,
              },
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
              sx={{
                minWidth: 0,
                alignItems: "center",
              }}
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
                    fontSize: {
                      xs: "0.85rem",
                      sm: "1rem",
                    },
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
            value={Math.min(
              100,
              Math.max(0, Number(atsScore) || 0)
            )}
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
            sx={{
              color: "text.primary",
              mb: 2,
            }}
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
            sx={{
              color: "text.primary",
              mb: 2,
            }}
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
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            justifyContent="space-between"
            gap={1}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "text.primary" }}
            >
              AI Resume Analysis
            </Typography>

            {aiStatus === "completed" && (
              <Chip
                icon={<CheckCircle />}
                label="Completed"
                color="success"
                size="small"
              />
            )}

            {aiStatus === "processing" && (
              <Chip
                icon={<Psychology />}
                label="Analyzing..."
                color="info"
                size="small"
              />
            )}

            {aiStatus === "fallback" && (
              <Chip
                label="Fallback Response"
                color="warning"
                size="small"
              />
            )}

            {aiStatus === "failed" && (
              <Chip
                label="Analysis Failed"
                color="error"
                size="small"
              />
            )}

            {aiStatus === "timeout" && (
              <Chip
                label="Timed Out"
                color="warning"
                size="small"
              />
            )}
          </Stack>

          {/* AI PROCESSING MESSAGE */}

          {aiStatus === "processing" && (
            <Box mt={2}>
              <Typography
                color="info.main"
                sx={{
                  mb: 1,
                  fontSize: "0.9rem",
                }}
              >
                Ollama AI is generating your resume analysis.
                Please wait...
              </Typography>

              <LinearProgress
                sx={{
                  height: 6,
                  borderRadius: 5,
                }}
              />
            </Box>
          )}

          {/* AI RESPONSE */}

          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.8,
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
              },
            }}
          >
            {aiAnalysis ||
              (aiStatus === "processing"
                ? "Waiting for AI response..."
                : aiStatus === "timeout"
                ? "AI is taking longer than expected. Refresh the page to check the latest result."
                : aiStatus === "failed"
                ? "AI analysis failed. Please try again."
                : "AI analysis will appear here after resume upload.")}
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
                px: {
                  xs: 2,
                  sm: 3,
                },
                py: 2,
                backgroundColor: "action.hover",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="text.primary"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.25rem",
                  },
                }}
              >
                AI Resume Preview
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "divider" }} />

            <Box
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                },
                maxHeight: {
                  xs: 300,
                  sm: 350,
                },
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
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.9rem",
                  },
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
          width: {
            xs: "calc(100% - 32px)",
            sm: "auto",
          },
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
        autoHideDuration={5000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isMobile ? "center" : "right",
        }}
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "auto",
          },
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
