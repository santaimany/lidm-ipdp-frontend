import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Book1 from "./Book1";

const StorybookDetail = () => {
    const { chapterId, storybookId } = useParams(); 
    const [storybook, setStorybook] = useState(null);
    const [message, setMessage] = useState("");
    const sessionId = localStorage.getItem("session_id");
    const navigate = useNavigate();

    // Fetch detail storybook dari server
    useEffect(() => {
        const fetchStorybook = async () => {
            try {
                const response = await axios.get(`https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks/${storybookId}`);
                setStorybook(response.data);
            } catch (error) {
                console.error("Gagal memuat detail storybook:", error.response?.data || error.message);
                setMessage("Gagal memuat detail storybook. Silakan coba lagi.");
            }
        };

        fetchStorybook();
    }, [chapterId, storybookId]);

    // Tandai storybook sebagai selesai
    const markAsRead = async () => {
        try {
            const response = await axios.post(
                `https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks/${storybookId}/mark-read`,
                { session_id: sessionId }
            );

            console.log("Mark as read response:", response.data);
            setMessage("Storybook berhasil ditandai sebagai selesai.");
            navigate(`/chapters/${chapterId}`);

            // Menjalankan musik setelah storybook selesai ditandai
            const audioPermission = localStorage.getItem('audioPermission');
            if (audioPermission === 'granted') {
                const audioRef = document.querySelector('audio');
                if (audioRef) {
                    audioRef.play();
                }
            }
        } catch (error) {
            console.error("Failed to mark storybook as read:", error.response?.data || error.message);
            setMessage("Gagal menandai storybook sebagai selesai. Silakan coba lagi.");
        }
    };

    return (
        <div className=" mx-auto ">
           
            

            {storybook ? (
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
            ) : (
                <Book1/>
            )}
        </div>
    );
};

export default StorybookDetail;
