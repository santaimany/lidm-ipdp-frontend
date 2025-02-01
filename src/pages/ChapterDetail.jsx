import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Element1 from "../components/Element";

const GuideModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden mx-2"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#16a57a] to-[#12876b] p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📘</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              PANDUAN BELAJAR
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white text-2xl bg-white/20 rounded-full p-1 md:p-2 hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Konten */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-[#FFD700] text-gray-800 rounded-full min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center text-lg md:text-xl font-bold">
                {num}
              </div>
              <p className="text-base md:text-lg text-gray-800">
                {num === 1 && "Pilih materi dengan ikon 📖 untuk mulai belajar"}
                {num === 2 && "Selesaikan semua materi untuk membuka kuis"}
                {num === 3 && "Tekan tombol 🚀 MULAI KUIS untuk menguji diri"}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 md:px-8 md:py-3 bg-[#16a57a] text-white text-base md:text-lg rounded-lg hover:bg-[#12876b] transition-colors flex items-center space-x-2"
          >
            <span>Tutup</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ChapterDetail = () => {
  const { chapterId } = useParams();
  const [storyBooks, setStoryBooks] = useState([]);
  const [quizUnlocked, setQuizUnlocked] = useState(false);
  const [message, setMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("session_id");

  useEffect(() => {
    const fetchStoryBooks = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/chapters/${chapterId}/storybooks`,
          { params: { session_id: sessionId } }
        );
        setStoryBooks(response.data.data);
        setQuizUnlocked(response.data.data.every((sb) => sb.is_read));
      } catch (error) {
        setMessage("Gagal memuat materi. Silakan coba lagi.");
      }
    };
    fetchStoryBooks();
  }, [chapterId]);

  const goToQuiz = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/chapters/${chapterId}/quiz`,
        { params: { session_id: sessionId } }
      );
      if (response.status === 200) {
        navigate(`/quiz/${chapterId}/start`, { state: { quiz: response.data.data } });
      }
    } catch (error) {
      setMessage("Selesaikan semua materi terlebih dahulu!");
    }
  };

  const currentUnlockedIndex = storyBooks.findIndex(
    (sb, index) => !sb.is_read && (index === 0 || storyBooks[index - 1]?.is_read)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fff4] to-[#f8fafc]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#16a57a] to-[#12876b] px-5 py-4 md:px-6 md:py-5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-xl flex items-center space-x-2 hover:text-yellow-200 transition-colors"
          >
            <span className="text-3xl">←</span>
            <span className="hidden sm:inline">KEMBALI</span>
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            STUDI TIME
          </h1>
          
          <button
            onClick={() => setShowGuide(true)}
            className="text-white bg-[#FFD700]/90 px-4 py-2 md:px-5 md:py-3 rounded-lg hover:bg-[#FFD700] transition-colors flex items-center space-x-2"
          >
            <span className="text-2xl">📘</span>
            <span className="hidden sm:inline text-lg">PANDUAN</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-5 py-8 md:py-10">
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {storyBooks.map((storybook, index) => {
            const isLocked = !(index === 0 || storyBooks[index - 1]?.is_read);
            const showElement = currentUnlockedIndex === index && !quizUnlocked;

            return (
              <motion.div
                key={storybook.id}
                className="relative w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(isLocked ? index : null)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Progress Line */}
                {index > 0 && (
                  <div className={`absolute left-1/2 -top-10 w-1.5 h-12 ${storybook.is_read ? 'bg-[#16a57a]' : 'bg-gray-200'}`} />
                )}

                {/* Tooltip */}
                {isLocked && hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                      <span className="text-base font-semibold">
                        Selesaikan materi sebelumnya!
                      </span>
                      <div className="absolute bottom-0 left-1/2 -mb-2 w-4 h-4 bg-red-100 border-b border-l border-red-300 transform -translate-x-1/2 rotate-45" />
                    </div>
                  </motion.div>
                )}

                {/* Content Card */}
                <div className="relative flex flex-col items-center">
                  {showElement && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-14"
                    >
                      <Element1 />
                    </motion.div>
                  )}

                  <button
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-lg transition-all duration-300 ${
                      storybook.is_read
                        ? 'bg-[#16a57a] text-white'
                        : isLocked
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-[#FFD700] hover:bg-[#FFC800] hover:scale-105'
                    }`}
                    onClick={() => !isLocked && navigate(`/chapters/${chapterId}/storybooks/${storybook.id}`)}
                    disabled={isLocked}
                  >
                    {storybook.is_read ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        ✓
                      </motion.span>
                    ) : (
                      isLocked ? '🔒' : '📖'
                    )}
                  </button>

                  <span className="mt-3 md:mt-4 px-4 py-2 bg-white rounded-lg shadow-md text-center text-base md:text-lg font-medium text-gray-700 max-w-[200px] md:max-w-[240px]">
                    {storybook.title}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Quiz Button */}
          <motion.div
            className="pt-8 md:pt-10 w-full max-w-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <button
              onClick={goToQuiz}
              disabled={!quizUnlocked}
              className={`w-full py-4 md:py-5 text-xl md:text-2xl font-bold rounded-xl transition-all shadow-xl ${
                quizUnlocked
                  ? 'bg-[#FFD700] hover:bg-[#FFC800] text-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {quizUnlocked ? "🚀 MULAI KUIS" : "SELESAIKAN MATERI"}
            </button>
          </motion.div>
        </div>

        {/* Error Message */}
        {message && (
          <motion.div
            className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ {message}
          </motion.div>
        )}
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ChapterDetail;