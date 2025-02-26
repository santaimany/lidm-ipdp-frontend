import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Element1 from "../components/Element";
import ScrollProgress from "../components/ScrollProgress";
import { default as Games1, default as Games2, default as Games3 } from "./Games";

const Games = [Games1, Games2, Games3]



// GuideModal dengan TTS (tetap ada di ChapterDetail)
const GuideModal = ({ onClose }) => {
  const guideText =
    "Step 1: Pilih materi dengan ikon buku untuk membaca storybook. Step 2: Selesaikan semua storybook untuk membuka kuis. Step 3: Tekan tombol START QUIZ setelah menyelesaikan storybooknya.";

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(
        (v) => v.name === "	id-ID-Standard-B" && v.lang === "id-ID"
      ) || voices.find((v) => v.lang === "id-ID");
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speakText(guideText);
    
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden mx-2"
      >
        
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl" aria-hidden="true">📘</span>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              PANDUAN BELAJAR
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup panduan"
            className="text-white text-2xl bg-white/20 rounded-full p-1 md:p-2 hover:bg-white/30 transition-colors focus:outline focus:outline-2 focus:outline-yellow-300"
          >
            ✕
          </button>
        </div>

        
        <div
          className="p-4 md:p-6 space-y-4 md:space-y-6 cursor-pointer"
        
        >
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-start space-x-3 md:space-x-4">
              <div className="bg-yellow-300 text-gray-800 rounded-full min-w-[2.5rem] min-h-[2.5rem] flex items-center justify-center text-lg md:text-xl font-bold">
                {num}
              </div>
              <p className="text-base md:text-lg text-gray-800">
                {num === 1 &&
                  "Pilih materi dengan ikon 📖 untuk membaca storybook"}
                {num === 2 && "Selesaikan semua storybook untuk membuka Quiz"}
                {num === 3 &&
                  "Tekan tombol 🚀 START QUIZ setelah menyelesaikan semua storybooknya"}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 flex justify-center">
          <button
            onClick={onClose}
            aria-label="Tutup panduan"
            className="px-6 py-2 md:px-8 md:py-3 bg-teal-600 text-white text-base md:text-lg rounded-lg hover:bg-teal-500 transition-colors flex items-center space-x-2 focus:outline focus:outline-2 focus:outline-yellow-300"
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
 
  const [selectedGameIndex, setSelectedGameIndex] = useState(null);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("session_id");

  const storageKey = `hasPlayedGame_${sessionId}`;

  const [hasPlayedGame, setHasPlayedGame] = useState(() => {
    return localStorage.getItem(storageKey) === "true";
  });

  useEffect(() => {
    if (!hasPlayedGame) {
      setSelectedGameIndex(Math.floor(Math.random() * Games.length));
    }
  }, [hasPlayedGame]);



  useEffect(() => {
    if (!hasPlayedGame) return;

    const fetchStoryBooks = async () => {
      try {
        const response = await axios.get(
          `https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks`,
          { params: { session_id: sessionId } }
        );
        setStoryBooks(response.data.data);
        setQuizUnlocked(response.data.data.every((sb) => sb.is_read));
      } catch (error) {
        setMessage("Gagal memuat materi. Silakan coba lagi.");
      }
    };
    fetchStoryBooks();
  }, [chapterId, sessionId, hasPlayedGame]);

  const handleGameComplete = () => {
    setHasPlayedGame(true);
    localStorage.setItem(storageKey, "true"); // simpan di localStorage
  };

  const goToQuiz = async () => {
    try {
      const response = await axios.get(
        `https://mossel.up.railway.app/api/chapters/${chapterId}/quiz`,
        { params: { session_id: sessionId } }
      );
      if (response.status === 200) {
        navigate(`/quiz/${chapterId}/start`, {
          state: { quiz: response.data.data },
        });
      }
    } catch (error) {
      setMessage("Selesaikan semua materi terlebih dahulu!");
    }
  };

  const currentUnlockedIndex = storyBooks.findIndex(
    (sb, index) => !sb.is_read && (index === 0 || storyBooks[index - 1]?.is_read)
  );
  
  if (!hasPlayedGame) {
    if (selectedGameIndex === null) return null; // atau bisa tampilkan loading spinner
    const SelectedGame = Games[selectedGameIndex];
    return (
      <div className="">
        {/* Komponen game diharapkan memanggil prop onComplete saat selesai */}
        <SelectedGame onComplete={handleGameComplete} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-800 to-teal-900 overflow-hidden">
      {/* Background Animations */}
      <ScrollProgress />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        aria-hidden="true"
      />
      <motion.div
        animate={{ x: [0, 20, 0], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-80px] left-[-80px] w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-4 md:px-6 md:py-5 shadow-lg relative z-10">
  <div className="relative flex items-center justify-center">
    {/* Tombol Back di sebelah kiri */}
    <button
      onClick={() => navigate("/chapters")}
      aria-label="Kembali ke daftar chapter"
      className="absolute left-0 text-white text-xl flex items-center space-x-2 hover:text-yellow-200 transition-colors focus:outline focus:outline-2 focus:outline-yellow-300"
    >
      <span className="text-3xl">←</span>
      <span className="hidden sm:inline text-3xl">Back</span>
    </button>

    {/* Teks STUDY TIME di tengah */}
    <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
      STUDY TIME
    </h1>

    {/* Tombol Panduan di sebelah kanan */}
    <button
      onClick={() => setShowGuide(true)}
      aria-label="Buka panduan belajar"
      className="absolute right-0 bg-yellow-300 px-4 py-2 md:px-5 md:py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2 focus:outline focus:outline-2 focus:outline-yellow-300"
    >
      <span className="text-2xl" aria-hidden="true">📘</span>
      <span className="hidden sm:inline text-lg">PANDUAN</span>
    </button>
  </div>
</header>


      {/* Main Content */}
      <main className="relative justify-center items-center z-10 max-w-4xl mx-auto px-5 py-8 md:py-10">
        <div className="flex flex-col items-center mx-auto space-y-6 md:space-y-8">
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
                  <div
                    className={`absolute left-1/2 -top-10 w-1.5 h-12 ${
                      storybook.is_read ? "bg-green-400" : "bg-gray-200"
                    }`}
                  />
                )}

                {/* Tooltip Jika Terkunci */}
                {isLocked && hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-14  transform z-20 right-0 left-0 w-full flex jsutify-center items-center"
                  >
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mx-auto rounded-lg shadow-lg space-x-1 ">
                      <span className="text-base font-semibold">
                        Complete the previous storybook!
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
                        ? "bg-teal-600 text-white"
                        : isLocked
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-300 hover:bg-yellow-400 hover:scale-105  "
                    }`}
                    onClick={() =>
                      !isLocked &&
                      navigate(
                        `/chapters/${chapterId}/storybooks/${storybook.id}`
                      )
                    }
                    disabled={isLocked}
                  >
                    {storybook.is_read ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        ✓
                      </motion.span>
                    ) : isLocked ? (
                      "🔒"
                    ) : (
                      "📖"
                    )}
                  </button>

                  <span className="mt-3 md:mt-4 px-4 py-2 bg-white rounded-lg shadow-md text-center text-base md:text-lg font-medium text-gray-700 max-w-[200px] md:max-w-[240px]">
                    {storybook.title}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Tombol Quiz */}
          <motion.div
            className="pt-8 md:pt-10 w-full max-w-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <button
              onClick={goToQuiz}
              disabled={!quizUnlocked}
              className={`w-full py-4 md:py-5 text-xl md:text-2xl font-bold rounded-xl transition-all shadow-xl ${
                quizUnlocked
                  ? "bg-yellow-300 hover:bg-yellow-400 text-teal-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {quizUnlocked
                ? "🚀 START QUIZ"
                : "COMPLETE THE STORYBOOK FIRST"}
            </button>
          </motion.div>
        </div>

        {/* Pesan Error */}
        {message && (
          <motion.div
            className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ {message}
          </motion.div>
        )}
      </main>

      {/* Modal Panduan */}
      <AnimatePresence>
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ChapterDetail;
