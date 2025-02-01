import React, { useEffect, useId, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../effects/use-outside-click";
import { cn } from "../effects/utils";
import bg from "../assets/quiz.svg";

const Chapters = () => {
    const [chapters, setChapters] = useState([]);
    const [message, setMessage] = useState("");
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();
    const [activeChapter, setActiveChapter] = useState(null);
    const id = useId();
    const ref = useRef(null);

    useEffect(() => {
        const fetchChapters = async () => {
            const schoolCode = localStorage.getItem("schoolCode");
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/student/chapters`,
                    {
                        params: sessionId ? { session_id: sessionId } : { school_code: schoolCode },
                    }
                );

                if (response.status === 200) {
                    setChapters(response.data.data);
                }
            } catch (error) {
                setMessage("Gagal memuat daftar chapter. Silakan coba lagi.");
            }
        };

        fetchChapters();
    }, [sessionId]);

    const handleStartLearning = (chapterId) => {
        setActiveChapter(null);
        setTimeout(() => {
            navigate(`/chapters/${chapterId}`);
        }, 500);
    };

    useOutsideClick(ref, () => setActiveChapter(null));

    return (
        <div className="relative min-h-screen bg-orange-50">
            {/* Header */}
            <div className="bg-[#16a57ac2] text-white py-16 relative overflow-hidden">
                <div className="absolute top-6 left-6">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center space-x-2 text-lg font-bold text-white hover:text-yellow-300 transition"
                    >
                        <span>&larr;</span>
                        <span>Back</span>
                    </button>
                </div>

                <div className="container mx-auto text-center relative">
                    <h1 className="text-4xl font-bold mb-4 relative inline-block">
                       Educational kit
                        <svg 
                            viewBox="0 0 400 40" 
                            className="absolute -bottom-4 left-0 w-full h-8"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 35 C80 25 120 45 200 35 S320 15 400 35"
                                fill="none"
                                stroke="url(#melt-gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            >
                                <animate
                                    attributeName="d"
                                    dur="8s"
                                    repeatCount="indefinite"
                                    values="
                                        M0 35 C80 25 120 45 200 35 S320 15 400 35;
                                        M0 35 C80 45 120 25 200 35 S320 25 400 35;
                                        M0 35 C80 25 120 45 200 35 S320 15 400 35
                                    "
                                />
                            </path>
                            <defs>
                                <linearGradient id="melt-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="100%" stopColor="#ffd700" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h1>
                    <p className="text-2xl mt-4">Explore all available chapters and resources!</p>
                </div>

                <div className="absolute bottom-0 w-full">
                    <svg viewBox="0 0 1440 100" className="w-full">
                        <path 
                            d="M0 70 Q360 30 720 60 T1440 30 L1440 100 L0 100 Z" 
                            fill="#16a57ac2"
                        />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto py-12 px-4">
                {message && (
                    <p className="text-red-500 text-center text-2xl mb-6">{message}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chapters.map((chapter) => (
                        <motion.div
                            key={chapter.id}
                            layoutId={`card-${chapter.id}`}
                            onClick={() => setActiveChapter(chapter)}
                            className={cn(
                                "h-64 relative cursor-pointer group",
                                activeChapter?.id === chapter.id ? "z-50" : "z-0"
                            )}
                        >
                            {/* Book Card */}
                            <motion.div
                                layout
                                className="book relative w-full h-full transform-style-preserve-3d"
                            >
                                {/* Book Cover */}
                                <motion.div
    layoutId={`cover-${chapter.id}`}
    className="absolute w-full h-full bg-gradient-to-br from-[#16a57a] to-[#12876b] rounded-lg shadow-xl p-6 overflow-hidden"
>
    {/* Background Pattern */}
    <img
    src={bg}
    className="absolute inset-0 opacity-20"/>

    {/* Icon with Animation */}
    <motion.div
        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <span className="text-2xl">{chapter.icon || "📘"}</span>
    </motion.div>

    {/* Chapter Name with Glow Effect */}
    <div className="ml-10 absolute bottom-0 left-0 right-0">
        <motion.h3
            layoutId={`title-${chapter.id}`}
            className="text-xl font-bold text-white mb-2 filter drop-shadow-lg"
        >
            {chapter.chapter_name}
        </motion.h3>
        <div className={`h-2 w-8 rounded-full ${chapter.is_active ? "bg-green-400" : "bg-red-400"} filter drop-shadow-md`} />
    </div>

    {/* Floating Elements */}
    <motion.div
        className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
        className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full"
        animate={{ y: [0, 20, 0], rotate: [0, -360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
    />
</motion.div>

                                {/* Book Spine */}
                                <motion.div
                                    layoutId={`spine-${chapter.id}`}
                                    className="absolute left-0 top-0 h-full w-8 bg-[#0d6e56] rounded-l-lg shadow-lg"
                                >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="text-white font-bold text-sm vertical-text">
                                            {chapter.chapter_name}
                                        </span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Expanded Card */}
                <AnimatePresence>
                    {activeChapter && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/20 z-40"
                            />

                            <div className="fixed inset-0 z-50 grid place-items-center">
                                <motion.div
                                    layoutId={`card-${activeChapter.id}`}
                                    ref={ref}
                                    className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden"
                                >
                                    {/* Expanded Cover */}
                                    <motion.div
                                        layoutId={`cover-${activeChapter.id}`}
                                        className="bg-gradient-to-br from-[#16a57a] to-[#12876b] p-8 relative"
                                    >
                                        <motion.div
                                            layoutId={`spine-${activeChapter.id}`}
                                            className="absolute left-0 top-0 h-full w-8 bg-[#0d6e56] rounded-l-lg"
                                        />
                                        <div className="flex justify-between items-center pl-10">
                                            <motion.h3
                                                layoutId={`title-${activeChapter.id}`}
                                                className="text-3xl font-bold text-white"
                                            >
                                                {activeChapter.chapter_name}
                                            </motion.h3>
                                            <button
                                                onClick={() => setActiveChapter(null)}
                                                className="text-white hover:text-yellow-300 text-2xl"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Expanded Content */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-8"
                                    >
                                        <p className="text-gray-700 mb-6">
                                            {activeChapter.description ||
                                                "Explore this chapter to discover various learning materials and interactive content..."}
                                        </p>
                                        <button
                                            onClick={() => handleStartLearning(activeChapter.id)}
                                            className="mt-4 bg-[#16a57a] text-white px-6 py-3 rounded-lg hover:bg-[#12876b] transition-transform duration-200 hover:scale-105"
                                        >
                                            Start Learning Now →
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Chapters;