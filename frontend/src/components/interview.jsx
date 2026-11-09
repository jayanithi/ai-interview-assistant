import React, {
  useEffect,
  useState
} from "react";

import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";

import {
  Psychology,
  CheckCircle,
} from "@mui/icons-material";

import { motion } from "framer-motion";

import axios from "axios";

function Interview() {

  const [questions, setQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answer, setAnswer] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // FETCH QUESTIONS
  // =====================================

  useEffect(() => {

    fetchQuestions();

  }, []);

  const fetchQuestions = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response = await axios.get(

        "http://127.0.0.1:8000/api/interview/questions/",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setQuestions(
        response.data.questions
      );

    } catch (error) {

      console.log(error);

      alert("Failed to load questions");
    }
  };

  // =====================================
  // NEXT QUESTION
  // =====================================

  const handleNext = async () => {

    if (!answer.trim()) {

      setFeedback(
        "Please enter your answer."
      );

      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("access");

      const response = await axios.post(

        "http://127.0.0.1:8000/api/interview/submit-answer/",

        {
          question:
            questions[currentQuestion],

          answer: answer,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setFeedback(
        response.data.feedback
      );

      setScore(
        response.data.score
      );

      setLoading(false);

      setTimeout(() => {

        if (
          currentQuestion <
          questions.length - 1
        ) {

          setCurrentQuestion(
            currentQuestion + 1
          );

          setAnswer("");

          setFeedback("");

          setScore(0);

        } else {

          setFeedback(
            "Interview Completed Successfully!"
          );
        }

      }, 2500);

    } catch (error) {

      console.log(error);

      setLoading(false);

      alert(
        error.response?.data?.message ||
        "Submission Failed"
      );
    }
  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right,#020617,#0f172a,#111827)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 1.5, sm: 3 },
      }}
    >

      <motion.div
        initial={{
          opacity: 0,
          y: 40
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        style={{
          width: "100%",
          maxWidth: "850px"
        }}
      >

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 5 },
            borderRadius: { xs: "22px", sm: "35px" },
            background:
              "rgba(17,24,39,0.95)",
            backdropFilter:
              "blur(20px)",
            color: "white",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >

          {/* HEADER */}

          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.8rem", sm: "2.25rem", md: "3rem" },
            }}
          >
            AI Mock Interview
          </Typography>

          <Typography
            color="#94A3B8"
            mb={4}
            sx={{ textAlign: "center" }}
          >
            Practice real interview
            questions with AI feedback
          </Typography>

          {/* QUESTION */}

          {

            questions.length > 0 && (

              <>

                <Stack
                  direction="row"
                  mb={3}
                  useFlexGap
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >

                  <Chip
                    icon={<Psychology />}
                    label={`Question ${currentQuestion + 1}`}
                    sx={{
                      bgcolor:
                        "rgba(59,130,246,0.15)",
                      color: "#60A5FA",
                    }}
                  />

                  <Chip
                    icon={<CheckCircle />}
                    label={`Score: ${score}`}
                    sx={{
                      bgcolor:
                        "rgba(16,185,129,0.15)",
                      color: "#34D399",
                    }}
                  />

                </Stack>

                <Typography
                  variant="h5"
                  mb={4}
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1.15rem", sm: "1.5rem" }, overflowWrap: "anywhere" }}
                >
                  {
                    questions[
                      currentQuestion
                    ]
                  }
                </Typography>

                {/* ANSWER */}

                <TextField
                  multiline
                  rows={8}
                  fullWidth
                  value={answer}
                  onChange={(e) =>
                    setAnswer(
                      e.target.value
                    )
                  }
                  placeholder="Type your answer here..."
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root":
                    {
                      color: "white",
                      borderRadius:
                        "20px",

                      "& fieldset": {
                        borderColor:
                          "#3b82f6",
                      },
                    },
                  }}
                />

                {/* FEEDBACK */}

                {

                  feedback && (

                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius:
                          "20px",
                        background:
                          "rgba(59,130,246,0.08)",
                        border:
                          "1px solid rgba(59,130,246,0.25)",
                        mb: 4,
                      }}
                    >

                      <Typography>
                        {feedback}
                      </Typography>

                    </Paper>

                  )
                }

                {/* LOADING */}

                {

                  loading && (

                    <LinearProgress
                      sx={{
                        mb: 4,
                        height: 10,
                        borderRadius: 10,
                      }}
                    />

                  )
                }

                {/* BUTTON */}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius:
                      "16px",
                    background:
                      "linear-gradient(90deg,#3b82f6,#8b5cf6)",
                    textTransform:
                      "none",
                    fontWeight: "bold",
                    fontSize: "16px",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Next Question
                </Button>

              </>

            )
          }

        </Paper>

      </motion.div>

    </Box>
  );
}

export default Interview;