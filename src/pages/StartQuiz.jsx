import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Quizimg from "../assets/quiz.svg";

const StartQuiz = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const quizzes = state?.quiz;
  const [showPreparation, setShowPreparation] = useState(false);
  const [selectedPercentage, setSelectedPercentage] = useState(null);

  // Pastikan chapterId didefinisikan jika quizzes ada
  const chapterId = quizzes && quizzes.length > 0 ? quizzes[0].chapter_id : null;

  // Fungsi TTS untuk membacakan teks
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // Cari voice yang sesuai (Google UK English Male dengan lang en-GB)
    const selectedVoice =
      voices.find(
        (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
      ) || voices.find((v) => v.lang === "en-GB");
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1;
    window.speechSynthesis.cancel(); // Batalkan TTS sebelumnya
    window.speechSynthesis.speak(utterance);
  };

  // Auto-play TTS saat tampilan berubah
  useEffect(() => {
    if (!showPreparation) {
      const initialText = `Quiz Chapter ${chapterId}. There are ${quizzes ? quizzes.length : 0} questions in this quiz. Get ready to answer them all correctly!`;
      speakText(initialText);
    } else {
      // Panggil TTS instruksi persiapan hanya sekali saat tampilan persiapan pertama kali muncul
      const prepText =
        "How ready are you? Choose your readiness level by tapping on one of the percentages.";
      speakText(prepText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreparation]);

  const handleStartQuiz = () => {
    setShowPreparation(true);
  };

  const handleContinue = () => {
    navigate(`/quiz/${chapterId}/play`, { state: { quizzes, chapterId } });
  };

  const getMotivationalMessage = (percentage) => {
    const messages = {
      25: "It's okay to start small! The important thing is you're brave enough to try 💪",
      50: "Halfway there! You can definitely do it! 😊",
      75: "Almost ready! Keep building your confidence! 🚀",
      100: "Ready to go! Time to show your best skills! 🔥",
    };
    return messages[percentage] || "You can definitely do it! Don't forget to pray before you start 🙏";
  };

  return (
    <div className="min-h-screen bg-yellow-500 flex flex-col items-center justify-center relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() =>
            showPreparation ? setShowPreparation(false) : navigate(-1)
          }
          className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-yellow-300 transition"
        >
          <span>&larr;</span>
          <span>Back</span>
        </button>
      </div>

      {(!quizzes || quizzes.length === 0) ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-600">
            Data quiz tidak tersedia. Kembali ke halaman sebelumnya.
          </p>
        </div>
      ) : !chapterId ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-600">
            Chapter ID tidak ditemukan pada quiz. Silakan coba lagi.
          </p>
        </div>
      ) : (
        <>
          {!showPreparation ? (
            /* Tampilan Awal */
            <div
              className="container mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left px-6 py-12"
              // Ketuk area ini untuk memicu ulang TTS instruksi awal
              onClick={() =>
                speakText(
                  `Quiz Chapter ${chapterId}. There are ${quizzes.length} questions in this quiz. Get ready to answer them all correctly!`
                )
              }
            >
              {/* Left Content */}
              <div className="text-white md:w-1/2 space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Quiz Chapter {chapterId}
                </h1>
                <p className="text-lg leading-relaxed">
                  There are {quizzes.length} questions in this quiz. Get ready to
                  answer them all correctly!
                </p>

                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 bg-white text-yellow-600 font-semibold text-lg rounded-lg shadow-lg hover:bg-yellow-100 transition duration-300"
                >
                  Start Quiz →
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
          ) : (
            /* Tampilan Persiapan */
            // Hapus onClick di container agar instruksi TTS tidak dipicu ulang setiap ketukan
            <div className="container mx-auto flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="text-white space-y-8 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold">
                  How ready are you?
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[25, 50, 75, 100].map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => setSelectedPercentage(percentage)}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        selectedPercentage === percentage
                          ? "bg-white text-yellow-600 scale-105"
                          : "bg-yellow-400/30 hover:bg-yellow-400/50"
                      }`}
                    >
                      <span className="text-2xl font-bold">{percentage}%</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-xl italic">
                    {selectedPercentage 
                      ? getMotivationalMessage(selectedPercentage)
                      : "Choose your readiness level first"}
                  </p>
                  <p className="text-lg">Don't forget to pray before starting it!</p>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!selectedPercentage}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all ${
                    selectedPercentage
                      ? "bg-white text-yellow-600 hover:scale-105"
                      : "bg-gray-200/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedPercentage ? "Continue →" : "Choose a percentage first!"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StartQuiz;
