import React, {
  useState,
  useEffect
} from "react";

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

  const [resumeText, setResumeText] =
    useState("");

  const [fileName, setFileName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");
const [atsScore, setAtsScore] =
  useState(0);

const [skills, setSkills] =
  useState([]);

const [missingSkills, setMissingSkills] =
  useState([]);

const [aiAnalysis, setAiAnalysis] =
  useState("");
useEffect(() => {

  const fetchResumeAnalytics = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response =
        await axios.get(
          "http://127.0.0.1:8000/api/interview/dashboard/",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(response.data);

    } catch (error) {

      console.log(
        "Resume Analytics Error:",
        error
      );

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

      // VALIDATION
      if (
        file.type !== "application/pdf"
      ) {

        setErrorMessage(
          "Only PDF files allowed"
        );

        return;
      }

      setFileName(file.name);

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      // JWT TOKEN
      const token =
        localStorage.getItem("access");

      // API CALL
    const response = await axios.post(
  "http://127.0.0.1:8000/api/resume/upload/",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
);

setAtsScore(response.data.ats_score);

setSkills(
  response.data.skills || []
);

setMissingSkills(
  response.data.missing_skills || []
);

setAiAnalysis(
  response.data.ai_analysis || ""
);

      console.log(response.data);

      // SAVE RESPONSE
      setResumeText(
        response.data.resume_text
      );

      setOpen(true);

    } catch (error) {

      console.log(error);

      setErrorMessage(
        error.response?.data?.message ||
        "Resume Upload Failed"
      );

    } finally {

      setLoading(false);

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
          padding: 4,

          background:
            "linear-gradient(145deg,#020617,#0f172a,#111827)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          backdropFilter: "blur(20px)",

          boxShadow:
            "0px 20px 60px rgba(0,0,0,0.45)",

          transition: "0.4s ease",

          "&:hover": {

            transform: "translateY(-6px)",

            boxShadow:
              "0px 30px 80px rgba(59,130,246,0.25)",
          },
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
                "0px 10px 30px rgba(59,130,246,0.4)",
            }}
          >
            <Description
              sx={{ fontSize: 35 }}
            />
          </Avatar>

          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                color: "white",
                letterSpacing: 1,
              }}
            >
              AI Resume Analyzer
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                mt: 0.5,
              }}
            >
              Upload your resume and get
              AI-powered career insights.
            </Typography>
          </Box>
        </Stack>

        {/* FEATURE CHIPS */}
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          mb={4}
        >

          <Chip
            icon={<AutoAwesome />}
            label="ATS Optimization"
            sx={{
              bgcolor:
                "rgba(59,130,246,0.15)",

              color: "#60A5FA",

              border:
                "1px solid rgba(59,130,246,0.3)",
            }}
          />

          <Chip
            icon={<Psychology />}
            label="AI Analysis"
            sx={{
              bgcolor:
                "rgba(139,92,246,0.15)",

              color: "#A78BFA",

              border:
                "1px solid rgba(139,92,246,0.3)",
            }}
          />

          <Chip
            icon={<CheckCircle />}
            label="Skill Detection"
            sx={{
              bgcolor:
                "rgba(16,185,129,0.15)",

              color: "#34D399",

              border:
                "1px solid rgba(16,185,129,0.3)",
            }}
          />

        </Stack>

        {/* UPLOAD AREA */}
        <Box
          sx={{
            border:
              "2px dashed rgba(255,255,255,0.12)",

            borderRadius: "24px",

            padding: 5,

            textAlign: "center",

            background:
              "rgba(255,255,255,0.03)",

            transition: "0.3s",

            "&:hover": {

              border:
                "2px dashed rgba(59,130,246,0.6)",

              background:
                "rgba(59,130,246,0.05)",
            },
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
                "0px 15px 40px rgba(37,99,235,0.4)",
            }}
          >
            <CloudUpload
              sx={{ fontSize: 50 }}
            />
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
            sx={{
              color: "#94A3B8",
              mb: 4,
            }}
          >
            Supported Format: PDF • Max
            Size: 10MB
          </Typography>

          <Button
            component="label"
            variant="contained"
            size="large"
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

                transform: "scale(1.03)",
              },
            }}
          >

            Upload Resume

            <input
              hidden
              type="file"
              accept=".pdf"
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
              }}
            >
              AI is analyzing your
              resume...
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
              p: 3,

              borderRadius: "20px",

              background:
                "rgba(255,255,255,0.04)",

              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
            >

              <Avatar
                sx={{
                  bgcolor: "#2563EB",
                }}
              >
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
                  sx={{
                    color: "#94A3B8",
                  }}
                >
                  Resume uploaded
                  successfully
                </Typography>

              </Box>
            </Stack>
          </Paper>
        )}
<Paper sx={{ p: 3, mb: 3 }}>

  <Typography variant="h6">
    ATS Score
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
<Paper sx={{ p: 3, mb: 3 }}>

  <Typography variant="h6">
    Detected Skills
  </Typography>

  <Stack
    direction="row"
    spacing={1}
    flexWrap="wrap"
  >

    {skills.map((skill,index) => (

      <Chip
        key={index}
        label={skill}
        color="success"
      />

    ))}

  </Stack>

</Paper> 
<Paper sx={{ p: 3, mb: 3 }}>

  <Typography variant="h6">
    Missing Skills
  </Typography>

  <Stack
    direction="row"
    spacing={1}
    flexWrap="wrap"
  >

    {missingSkills.map((skill,index) => (

      <Chip
        key={index}
        label={skill}
        color="error"
      />

    ))}

  </Stack>

</Paper>  
<Paper sx={{ p: 3 }}>

  <Typography variant="h6">
    AI Resume Analysis
  </Typography>

  <Typography
    sx={{
      mt: 2,
      whiteSpace: "pre-line"
    }}
  >
    {aiAnalysis}
  </Typography>

</Paper>
  <Typography
    sx={{ mt: 1 }}
  >
    {atsScore}%
  </Typography>

</Paper> 

        {/* RESULT */}
        {resumeText && (

          <Paper
            elevation={0}
            sx={{

              mt: 4,

              borderRadius: "24px",

              overflow: "hidden",

              background:
                "rgba(255,255,255,0.04)",

              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >

            {/* HEADER */}
            <Box
              sx={{
                px: 3,
                py: 2,

                background:
                  "linear-gradient(135deg,#1E293B,#0F172A)",
              }}
            >

              <Typography
                variant="h6"
                fontWeight="bold"
                color="white"
              >
                AI Resume Preview
              </Typography>

            </Box>

            <Divider />

            {/* CONTENT */}
            <Box
              sx={{
                p: 3,
                maxHeight: 350,
                overflowY: "auto",
              }}
            >

              <Typography
                sx={{
                  color: "#CBD5E1",
                  lineHeight: 2,
                  whiteSpace: "pre-line",
                  fontSize: "15px",
                }}
              >
                {resumeText.substring(
                  0,
                  3000
                )}
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
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
        >
          Resume Uploaded Successfully
        </Alert>
      </Snackbar>

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() =>
          setErrorMessage("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResumeUpload;