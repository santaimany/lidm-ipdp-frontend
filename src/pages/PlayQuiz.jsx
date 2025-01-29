import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const QuizPlay = () => {
    const { chapterId: chapterIdFromParams } = useParams();
    const { state } = useLocation();
    const chapterId = state?.chapterId || chapterIdFromParams;

    const [quizzes, setQuizzes] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [message, setMessage] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerId, setTimerId] = useState(null);
    const [randomMovingIndex, setRandomMovingIndex] = useState(null); // Index soal yang bergerak
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();

    useEffect(() => {
        if (!chapterId) {
            setMessage("Chapter ID tidak ditemukan. Kembali ke halaman sebelumnya.");
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/chapters/${chapterId}/quiz`,
                    { params: { session_id: sessionId } }
                );

                if (response.status === 200) {
                    setQuizzes(response.data.data);
                    const now = Date.now();
                    setStartTime(now);
                    startTimer(now);

                    // Tentukan soal acak yang akan bergerak
                    const randomIndex = Math.floor(
                        Math.random() * response.data.data.length
                    );
                    setRandomMovingIndex(randomIndex);
                }
            } catch (error) {
                setMessage(error.response?.data?.message || "Gagal memuat quiz.");
            }
        };

        fetchQuizzes();

        return () => clearInterval(timerId);
    }, [chapterId]);

    const startTimer = (startTimestamp) => {
        const id = setInterval(() => {
            const now = Date.now();
            const secondsElapsed = Math.floor((now - startTimestamp) / 1000);
            setElapsedTime(secondsElapsed);
        }, 1000);
        setTimerId(id);
    };

    const handleSubmit = async () => {
        clearInterval(timerId);

        const totalQuestions = quizzes.length;
        let correctAnswers = 0;

        quizzes.forEach((quiz) => {
            if (selectedAnswers[quiz.id] === quiz.correct_answer) {
                correctAnswers += 1;
            }
        });

        const score = Math.round((correctAnswers / totalQuestions) * 100);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/quiz/submit", {
                session_id: sessionId,
                quiz_id: chapterId,
                score,
                time_taken: elapsedTime,
            });

            setMessage(response.data.message);
            navigate("/leaderboard", { state: { score, elapsedTime } });
        } catch (error) {
            setMessage("Gagal mengirimkan jawaban. Silakan coba lagi.");
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const currentQuiz = quizzes[currentQuestionIndex];

    const handleAnswerChange = (questionId, selectedAnswer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: selectedAnswer,
        }));
    };

    const generateRandomStyle = () => {
        const borderRadius = `${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}% ${Math.random() * 50}%`;
        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        const left = Math.random() * 60 + 10; // Random left position (10% to 70%)
        const top = Math.random() * 60 + 10; // Random top position (10% to 70%)

        return {
            position: "absolute",
            borderRadius,
            backgroundColor: color,
            left: `${left}%`,
            top: `${top}%`,
            transform: "translate(-50%, -50%)",
            padding: "10px 20px",
            textAlign: "center",
        };
    };

    return (
        <div className="min-h-screen flex flex-col bg-teal-500 text-white overflow-hidden">
            {/* Close Button */}
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-lg font-bold"
                >
                    <span className="text-white bg-teal-700 w-10 h-10 flex items-center justify-center rounded-full">
                        &larr;
                    </span>
                    Close
                </button>
            </div>

            {/* Timer */}
            <div className="absolute top-4 right-4 text-lg font-bold bg-white text-teal-700 px-4 py-2 rounded-lg shadow">
                Timer: {formatTime(elapsedTime)}
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col justify-center items-center px-6">
                <div className="relative bg-white text-teal-700 rounded-lg shadow-lg w-[90%] md:w-3/5 p-8 text-center overflow-hidden">
                    {/* Top Section */}
                    <div className="absolute top-4 right-4 text-teal-700 font-bold">
                        {currentQuestionIndex + 1} / {quizzes.length}
                    </div>

                    {/* Question */}
                    {currentQuiz && (
                        <>
                            <h2 className="text-lg font-semibold uppercase mb-4">
                                Did you know?
                            </h2>
                            <p className="text-2xl md:text-3xl font-bold mb-8">
                                {currentQuiz.question}
                            </p>

                            {/* Answer Choices */}
                            <div
                                className={`relative ${
                                    currentQuestionIndex === randomMovingIndex
                                        ? "h-64"
                                        : "grid grid-cols-2 gap-4"
                                }`}
                            >
                                {currentQuiz.choices.map((choice, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer text-white text-sm font-bold transition-all duration-300 ease-in-out relative ${
                                            selectedAnswers[currentQuiz.id] === choice
                                                ? "shadow-lg border-2 border-teal-700"
                                                : ""
                                        }`}
                                        style={
                                            currentQuestionIndex === randomMovingIndex
                                                ? generateRandomStyle()
                                                : {
                                                      backgroundColor: `hsl(200, 70%, ${
                                                          70 - index * 10
                                                      }%)`,
                                                      borderRadius: "10px",
                                                      padding: "10px 20px",
                                                      textAlign: "center",
                                                  }
                                        }
                                        onClick={() =>
                                            handleAnswerChange(currentQuiz.id, choice)
                                        }
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: "0",
                                                clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
                                            }}
                                        ></div>
                                        {choice}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Navigation Buttons */}
                   

                    {/* Submit Button */}
                    {currentQuestionIndex === quizzes.length - 1 && (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 mt-8 px-6 py-3 text-white text-lg rounded-lg shadow hover:bg-green-600 transition"
                        >
                            Submit Answers
                        </button>
                    )}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
    <button
        onClick={() =>
            setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
        }
        disabled={currentQuestionIndex === 0}
        className={`flex items-center justify-center p-3 rounded-lg shadow-md transition ${
            currentQuestionIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
        }`}
    >
        <svg 
            className="w-8 h-8 text-white"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
            />
        </svg>
    </button>
    
    <button
        onClick={() =>
            setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, quizzes.length - 1)
            )
        }
        disabled={currentQuestionIndex === quizzes.length - 1}
        className={`flex items-center justify-center p-3 rounded-lg shadow-md transition ${
            currentQuestionIndex === quizzes.length - 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
        }`}
    >
        <svg 
            className="w-8 h-8 text-white"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
            />
        </svg>
    </button>
</div>
            <style>
                {`
                @keyframes smoothMove {
                    0%, 100% {
                        transform: translate(-50%, -50%);
                    }
                    50% {
                        transform: translate(-50%, calc(-50% + 15px));
                    }
                }
                `}
            </style>
        </div>
    );
};

export default QuizPlay;
