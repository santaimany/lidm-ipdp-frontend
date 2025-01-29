import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ChapterDetail = () => {
    const { chapterId } = useParams();
    const [storyBooks, setStoryBooks] = useState([]);
    const [quizUnlocked, setQuizUnlocked] = useState(false);
    const [message, setMessage] = useState("");
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();

    // Fetch storybooks untuk chapter tertentu
    useEffect(() => {
        const fetchStoryBooks = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/chapters/${chapterId}/storybooks`,
                    { params: { session_id: sessionId } }
                );

                setStoryBooks(response.data.data);

                const allRead = response.data.data.every((sb) => sb.is_read);
                setQuizUnlocked(allRead);
            } catch (error) {
                setMessage("Gagal memuat storybooks. Silakan coba lagi.");
            }
        };

        fetchStoryBooks();
    }, [chapterId]);

    // Navigasi ke halaman quiz jika quiz sudah terbuka
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
            setMessage("Selesaikan semua storybooks terlebih dahulu untuk memainkan quiz.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Section */}
            <div className="w-full md:w-1/2 bg-[#f06262] p-8 text-white flex flex-col justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-lg font-bold flex items-center space-x-2 hover:text-[#ffdbdb] transition"
                >
                    <span>&larr;</span> <span>Back</span>
                </button>
                <div>
                    <h2 className="text-lg uppercase font-semibold mb-2">Pupils</h2>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        The Encyclopedia of Maple
                    </h1>
                </div>
                <button
                    onClick={() => navigate("/chapters")}
                    className="text-lg font-semibold uppercase bg-white text-[#f06262] py-3 px-6 rounded-lg transition hover:bg-[#ffdbdb]"
                >
                    Close
                </button>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-white p-8 flex flex-col">
                <h2 className="text-2xl font-bold mb-6">The Four Seasons</h2>
                <ul className="space-y-6">
                    {storyBooks.map((storybook) => (
                        <li
                            key={storybook.id}
                            className="flex justify-between items-center py-4 border-b border-gray-300 cursor-pointer hover:text-[#f06262]"
                            onClick={() =>
                                navigate(`/chapters/${chapterId}/storybooks/${storybook.id}`)
                            }
                        >
                            <span className="text-lg font-medium">{storybook.title}</span>
                            <span className="text-xl font-bold">&rarr;</span>
                        </li>
                    ))}
                </ul>

                {/* Quiz Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Quiz</h2>
                    <button
                        onClick={goToQuiz}
                        className={`px-6 py-3 text-lg font-semibold rounded-lg transition ${
                            quizUnlocked ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                        disabled={!quizUnlocked}
                    >
                        {quizUnlocked ? "Start Quiz" : "Complete Storybooks First"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChapterDetail;
