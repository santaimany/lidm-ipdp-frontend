import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chapters = () => {
    const [chapters, setChapters] = useState([]);
    const [message, setMessage] = useState("");
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();

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

    return (
        <div className="relative min-h-screen bg-orange-50">
            {/* Header */}
            <div className="bg-[#16a57ac2] text-white py-16">
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-lg font-bold text-white hover:text-yellow-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>

                <div className="container mx-auto text-center">
                    <h1 className="text-6xl font-bold">Educational Kit</h1>
                    <p className="text-2xl mt-4">Explore all available chapters and resources!</p>
                </div>
            </div>

            <div className="container mx-auto py-12">
                {message && (
                    <p className="text-red-500 text-center text-2xl mb-6">{message}</p>
                )}

                {/* Chapter Cards - Vertical Layout */}
                <div className="space-y-8">
                    {chapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            className="bg-white shadow-lg rounded-xl flex items-center p-8 hover:shadow-2xl transition cursor-pointer"
                            onClick={() => navigate(`/chapters/${chapter.id}`)}
                        >
                            {/* Icon Section */}
                            <div className="flex-shrink-0 bg-orange-100 p-6 rounded-full">
                                <span className="text-6xl font-bold text-orange-500">
                                    {chapter.icon || "📘"}
                                </span>
                            </div>

                            {/* Content Section */}
                            <div className="ml-6 flex-grow">
                                <p className="text-lg font-semibold text-gray-500 uppercase">
                                    Elementary Level
                                </p>
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {chapter.chapter_name}
                                </h2>
                                <p className="text-lg text-gray-700 mt-4">
                                    {chapter.description ||
                                        "This chapter contains amazing educational resources to enhance learning experiences."}
                                </p>
                            </div>

                            {/* Status Section */}
                            <div className="ml-6 text-right">
                                <span
                                    className={`inline-block w-8 h-8 rounded-full ${
                                        chapter.is_active
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                ></span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chapters;
