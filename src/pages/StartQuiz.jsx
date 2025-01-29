import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Quizimg from "../assets/quiz.svg";

const StartQuiz = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const quizzes = state?.quiz;

    if (!quizzes || quizzes.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-yellow-100">
                <p className="text-2xl font-bold text-gray-600">
                    Data quiz tidak tersedia. Kembali ke halaman sebelumnya.
                </p>
            </div>
        );
    }

    const chapterId = quizzes[0]?.chapter_id;

    if (!chapterId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-yellow-100">
                <p className="text-2xl font-bold text-gray-600">
                    Chapter ID tidak ditemukan pada quiz. Silakan coba lagi.
                </p>
            </div>
        );
    }

    const handleStartQuiz = () => {
        navigate(`/quiz/${chapterId}/play`, { state: { quizzes, chapterId } });
    };

    return (
        <div className="min-h-screen bg-yellow-500 flex flex-col items-center justify-center relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-lg font-bold text-white hover:text-yellow-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-12">
                {/* Left Content */}
                <div className="text-white md:w-1/2 space-y-6">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        Quiz untuk Chapter {chapterId}
                    </h1>
                    <p className="text-lg leading-relaxed">
                        Terdapat {quizzes.length} pertanyaan dalam quiz ini. Persiapkan dirimu
                        untuk menyelesaikan semua soal dengan tepat!
                    </p>
                    <button
                        onClick={handleStartQuiz}
                        className="px-6 py-3 bg-white text-yellow-600 font-semibold text-lg rounded-lg shadow-lg hover:bg-yellow-100 transition duration-300"
                    >
                        Mulai Quiz →
                    </button>
                </div>

                {/* Right Content */}
                <div className="mt-8 md:mt-0 md:w-1/2 flex justify-center">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 rounded-full bg-yellow-300 blur-3xl opacity-50"></div>
                        <img
                            src={Quizimg}
                            alt="Quiz Illustration"
                            className="relative z-10 w-72 h-72 md:w-96 md:h-96 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartQuiz;
