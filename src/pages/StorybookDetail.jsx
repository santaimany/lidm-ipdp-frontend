import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Book1 from "./Book1";
import Book2 from "./Book2";
import Book3 from "./Book3";

const StorybookDetail = () => {
  const { chapterId, storybookId } = useParams();
  const [storybook, setStorybook] = useState(null);
  const [message, setMessage] = useState("");
  const sessionId = localStorage.getItem("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStorybook = async () => {
      try {
        const response = await axios.get(
          `https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks/${storybookId}`
        );
        setStorybook(response.data);
      } catch (error) {
        console.error(
          "Gagal memuat detail storybook:",
          error.response?.data || error.message
        );
        setMessage("Gagal memuat detail storybook. Silakan coba lagi.");
      }
    };

    fetchStorybook();
  }, [chapterId, storybookId]);

  const markAsRead = async () => {
    try {
      const response = await axios.post(
        `https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks/${storybookId}/mark-read`,
        { session_id: sessionId }
      );

      console.log("Mark as read response:", response.data);
      setMessage("Storybook berhasil ditandai sebagai selesai.");
      navigate(`/chapters/${chapterId}`);

      const audioPermission = localStorage.getItem("audioPermission");
      if (audioPermission === "granted") {
        const audioRef = document.querySelector("audio");
        if (audioRef) {
          audioRef.play();
        }
      }
    } catch (error) {
      console.error(
        "Failed to mark storybook as read:",
        error.response?.data || error.message
      );
      setMessage(
        "Gagal menandai storybook sebagai selesai. Silakan coba lagi."
      );
    }
  };

  const renderBookComponent = () => {
    switch (storybookId) {
      case "1":
        return <Book1 />;
      case "2":
        return <Book2 />;
      case "3":
        return <Book3 />;
      default:
        return <Book1 />;
    }
  };

  return (
    <div className="mx-auto">
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
        // Jika storybook belum ada, render komponen buku sesuai parameter
        renderBookComponent()
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default StorybookDetail;
