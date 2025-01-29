import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StorybookDetail = () => {
    const { chapterId, storybookId } = useParams(); // Ambil chapterId dan storybookId dari URL
    const [storybook, setStorybook] = useState(null);
    const [message, setMessage] = useState("");
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();

    // Fetch detail storybook
    useEffect(() => {
        const fetchStorybook = async () => {
            try {
                const dummyData = {
                    id: storybookId,
                    title: `Storybook ${storybookId}`,
                    content: `Ini adalah konten dari storybook ${storybookId}. Bacalah dengan seksama.`,
                };
                setStorybook(dummyData);
            } catch (error) {
                setMessage("Gagal memuat detail storybook. Silakan coba lagi.");
            }
        };

        fetchStorybook();
    }, [storybookId]);

    // Tandai storybook sebagai selesai
    const markAsRead = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/chapters/${chapterId}/storybooks/${storybookId}/mark-read`,
                { session_id: sessionId }
            );
    
            console.log("Mark as read response:", response.data); // Debugging log
            setMessage("Storybook berhasil ditandai sebagai selesai.");
            navigate(`/chapters/${chapterId}`); // Kembali ke halaman chapter
        } catch (error) {
            console.error("Failed to mark storybook as read:", error.response?.data || error.message);
            setMessage("Gagal menandai storybook sebagai selesai. Silakan coba lagi.");
        }
    };
    
    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Detail Storybook</h1>
            {message && <p className="mb-4 text-red-500">{message}</p>}

            {storybook && (
                <div>
                    <h2 className="text-xl font-bold mb-4">{storybook.title}</h2>
                    <p className="mb-4">{storybook.content}</p>
                    <button
                        onClick={markAsRead}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Tandai Selesai
                    </button>
                </div>
            )}
        </div>
    );
};

export default StorybookDetail;
