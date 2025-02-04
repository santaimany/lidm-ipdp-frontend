import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const QuizPlay = () => {
  const { chapterId: chapterIdFromParams } = useParams();
  const { state } = useLocation();
  const chapterId = state?.chapterId || chapterIdFromParams;

  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [randomMovingIndex, setRandomMovingIndex] = useState(null);
  const sessionId = localStorage.getItem("session_id");
  const navigate = useNavigate();

  const [draggedAnswer, setDraggedAnswer] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [appreciationMessage, setAppreciationMessage] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);

  const appreciationMessages = [
    "Great job! Keep it up! 🎉",
    "Well done! You're doing awesome! 👏",
    "Excellent work! You're on fire! 🔥",
    "Fantastic! Keep pushing forward! 💪",
    "Amazing effort! You're a star! 🌟",
  ];

  // Fungsi TTS dengan voice Google UK English Male (en-GB)
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(
        (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
      ) || voices.find((v) => v.lang === "en-GB");
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Variasi animasi untuk jawaban
  const answerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 },
    }),
    hover: { scale: 1.05 },
    selected: { scale: 1.1, boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)" },
  };

  // Shuffle function untuk pilihan jawaban
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (!chapterId) {
      setMessage("Chapter ID tidak ditemukan.");
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/chapters/${chapterId}/quiz`,
          { params: { session_id: sessionId } }
        );

        if (response.status === 200) {
          let quizzesData = response.data.data;

          // Hanya shuffle jawaban untuk soal pertama
          if (quizzesData[0]) {
            quizzesData[0].choices = shuffleArray(quizzesData[0].choices);
          }

          setQuizzes(quizzesData);
          setRandomMovingIndex(Math.floor(Math.random() * quizzesData.length));

          // Mulai timer
          const startTime = Date.now();
          const timer = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
          }, 1000);

          return () => clearInterval(timer);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Gagal memuat quiz.");
      }
    };

    fetchQuizzes();
  }, [chapterId, sessionId]);

  // Mengirim jawaban
  const handleSubmit = async () => {
    const score = Math.round(
      (quizzes.filter((quiz) => selectedAnswers[quiz.id] === quiz.correct_answer)
        .length /
        quizzes.length) *
        100
    );

    try {
      const quizId = quizzes[0]?.id; // Asumsi 1 quiz per chapter

      const response = await axios.post("http://127.0.0.1:8000/api/quiz/submit", {
        session_id: sessionId,
        quiz_id: quizId,
        score: score,
        time_taken: elapsedTime,
      });

      if (response.status === 200) {
        const randomMessage =
          appreciationMessages[
            Math.floor(Math.random() * appreciationMessages.length)
          ];
        setAppreciationMessage(randomMessage);
        speakText(randomMessage);
        setShowPopUp(true);

        setTimeout(() => {
          navigate("/leaderboard", {
            state: { score, elapsedTime, quizId },
          });
        }, 6000);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setMessage(
        "Gagal mengirim jawaban: " +
          (error.response?.data?.message || "Server error")
      );
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleDragStart = (answer) => {
    setDraggedAnswer(answer);
    setDragging(true);
    setIsDragging(true);
  };

  const handleTouchStart = (e, answer) => {
    e.preventDefault();
    handleDragStart(answer);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, questionId) => {
    e.preventDefault();
    if (draggedAnswer) {
      handleAnswerChange(questionId, draggedAnswer);
    }
    setDragging(false);
    setDraggedAnswer(null);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e, questionId) => {
    e.preventDefault();
    handleDrop(e, questionId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const generateDynamicStyle = (index) => {
    const borderRadius = "10px";

    if (currentQuestionIndex !== randomMovingIndex) {
      return {
        backgroundColor: `hsl(${index * 90}, 70%, 85%)`,
        borderRadius,
        transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
      };
    }

    return {
      position: "absolute",
      borderRadius,
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 75%)`,
      left: `${30 + index * 20}%`,
      top: `${Math.random() * 80 + 10}%`,
      transform: "translate(-50%, -50%)",
      animation: "float 6s ease-in-out infinite",
    };
  };

  const currentQuiz = quizzes[currentQuestionIndex];

  if (!currentQuiz) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-emerald-600 flex flex-col">
      {/* Header Section */}
      <header className="p-4 flex justify-between items-center bg-white/10 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-teal-100 transition"
        >
          <span className="material-icons text-3xl">arrow_back</span>
          <span className="font-bold text-2xl">Back</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="bg-white/20 px-4 py-2 rounded-lg font-mono">
            ⏱ {Math.floor(elapsedTime / 60)}:
            {elapsedTime % 60 < 10 ? "0" : ""}
            {elapsedTime % 60}
          </div>
          {/* Klik untuk memilih soal */}
          <div
            className="bg-white/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/30 transition"
            onClick={() => setShowQuestionPicker(true)}
          >
            🔢 {currentQuestionIndex + 1}/{quizzes.length}
          </div>
        </div>
      </header>

      {/* Modal Pemilihan Soal */}
      <AnimatePresence>
        {showQuestionPicker && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-center">Pilih Soal</h3>
              <div className="grid grid-cols-4 gap-2">
                {quizzes.map((quiz, index) => {
                  const isAnswered = selectedAnswers[quiz.id] !== undefined;
                  return (
                    <button
                      key={quiz.id || index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setShowQuestionPicker(false);
                      }}
                      className={`
                        py-2 rounded transition-all 
                        ${isAnswered ? "bg-green-500" : "bg-red-500"}
                        ${currentQuestionIndex === index ? "ring-4 ring-yellow-500" : ""}
                        text-white font-semibold hover:opacity-90
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setShowQuestionPicker(false)}
                className="mt-6 w-full text-sm text-gray-600 hover:underline"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quiz Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
          >
            {/* Question */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">
                {currentQuiz?.question}
              </h2>
              <div className="text-sm font-medium text-emerald-600">
                Pilih jawaban yang benar:
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px] relative">
              {currentQuiz?.choices.map((choice, index) => (
                <motion.div
                  key={index}
                  variants={answerVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover="hover"
                  style={generateDynamicStyle(index)}
                  className={`p-4 cursor-pointer text-sm font-bold flex items-center justify-center
                    ${
                      selectedAnswers[currentQuiz.id] === choice
                        ? "!bg-teal-500 !text-white ring-4 ring-teal-200"
                        : "text-gray-800"
                    }`}
                  draggable={currentQuestionIndex === 0}
                  onClick={() => {
                    if (currentQuestionIndex !== 0) {
                      handleAnswerChange(currentQuiz.id, choice);
                    }
                  }}
                  onTouchStart={(e) => {
                    if (currentQuestionIndex === 0) {
                      handleTouchStart(e, choice);
                    }
                  }}
                  onDragStart={() => {
                    if (currentQuestionIndex === 0) {
                      handleDragStart(choice);
                    }
                  }}
                  onDragEnd={handleDragEnd}
                >
                  {choice}
                </motion.div>
              ))}
            </div>

            {/* Drop Area */}
            {currentQuestionIndex === 0 && (
              <div
                className="mt-8 p-6 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg text-center relative"
                onDrop={(e) => handleDrop(e, currentQuiz.id)}
                onDragOver={handleDragOver}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, currentQuiz.id)}
              >
                {selectedAnswers[currentQuiz.id]
                  ? `Jawaban: ${selectedAnswers[currentQuiz.id]}`
                  : "Seret dan lepaskan jawaban di sini"}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Appreciation Pop-Up */}
      <AnimatePresence>
        {showPopUp && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg text-center max-w-lg mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl font-bold text-teal-600 mb-4">
                {appreciationMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="p-4 flex justify-center gap-4 bg-white/10 backdrop-blur-sm">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-50 transition"
        >
          ⏮ Sebelumnya
        </button>

        {currentQuestionIndex === quizzes.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            🚀 Submit Jawaban
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            Selanjutnya ⏭
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) rotate(-2deg); }
            50% { transform: translate(-50%, calc(-50% + 20px)) rotate(2deg); }
          }
        `}
      </style>
    </div>
  );
};

export default QuizPlay;
