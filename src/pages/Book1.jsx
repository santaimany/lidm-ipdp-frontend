import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Import asset halaman
import pages1 from "../assets/pages1.svg";
import pages10 from "../assets/pages10.svg";
import pages11 from "../assets/pages11.svg";
import pages12 from "../assets/pages12.svg";
import pages13 from "../assets/pages13.svg";
import pages14 from "../assets/pages14.svg";
import pages15 from "../assets/pages15.svg";
import pages16 from "../assets/pages16.svg";
import pages17 from "../assets/pages17.svg";
import pages18 from "../assets/pages18.svg";
import pages19 from "../assets/pages19.svg";
import pages2 from "../assets/pages2.svg";
import pages3 from "../assets/pages3.svg";
import pages4 from "../assets/pages4.svg";
import pages5 from "../assets/pages5.svg";
import pages6 from "../assets/pages6.svg";
import pages7 from "../assets/pages7.svg";
import pages8 from "../assets/pages8.svg";
import pages9 from "../assets/pages9.svg";

const Book1 = () => {
  // Deklarasi state dan variabel-variabel hook
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState("forward");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeImage, setActiveImage] = useState(null);
  const [message, setMessage] = useState("");
  
  // Mengambil parameter URL dan fungsi navigasi
  const { chapterId, storybookId } = useParams();
  const navigate = useNavigate();
  const sessionId = localStorage.getItem("session_id");

  // Memantau perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 400);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fungsi text-to-speech
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-GB";
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support Text-to-Speech.");
    }
  };

  // Contoh penggunaan text-to-speech saat halaman pertama dimuat
  useEffect(() => {
    if (currentPage === 0) {
      speakText("Things at My Home");
    }
  }, []);

  // Fungsi untuk menandai storybook sebagai selesai (mark as read)
  const markAsRead = async () => {
    try {
      const response = await axios.post(
        `https://mossel.up.railway.app/api/chapters/${chapterId}/storybooks/${storybookId}/mark-read`,
        { session_id: sessionId }
      );
      console.log("Mark as read response:", response.data);
      setMessage("Storybook berhasil ditandai sebagai selesai.");
      
      // Navigasi kembali ke halaman chapter setelah 1 detik
      setTimeout(() => {
        navigate(`/chapters/${chapterId}`);
      }, 1000);

      // Jika izin audio diberikan, putar audio
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
      setMessage("Gagal menandai storybook sebagai selesai. Silakan coba lagi.");
    }
  };

  // Array halaman storybook
  const pages = [
    {
      content: (
        <img src={pages1} alt="Page 1" className="h-full w-auto mx-auto rounded" />
      ),
    },
    {
      content: (
        <img src={pages2} alt="Page 2" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages3} alt="Page 3" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages4} alt="Page 4" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages5} alt="Page 5" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages6} alt="Page 6" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages7} alt="Page 7" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages8} alt="Page 8" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages9} alt="Page 9" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages10} alt="Page 10" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages11} alt="Page 11" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages12} alt="Page 12" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages13} alt="Page 13" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages14} alt="Page 14" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages15} alt="Page 15" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages16} alt="Page 16" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages17} alt="Page 17" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages18} alt="Page 18" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    {
      content: (
        <img src={pages19} alt="Page 19" className="h-full w-auto mx-auto rounded-xl" />
      ),
    },
    // Konten ke-20: Halaman untuk menandai selesai membaca
    {
      content: (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white p-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">
            Selamat!
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center">
            Anda telah menyelesaikan membaca storybook ini.
          </p>
          <button
            onClick={markAsRead}
            className="px-6 py-3 bg-white text-green-600 font-bold rounded-full hover:bg-gray-200 transition duration-300"
          >
            Tandai Selesai
          </button>
          {message && (
            <p className="mt-4 text-center text-sm md:text-base">{message}</p>
          )}
        </div>
      ),
    },
  ];

  // Fungsi untuk meng-handle flipping halaman
  const handleFlip = (direction) => {
    if (isFlipping) return;

    setIsFlipping(true);
    setFlipDirection(direction);

    setTimeout(() => {
      setCurrentPage((prev) =>
        direction === "forward"
          ? Math.min(prev + 1, pages.length - 1)
          : Math.max(prev - 1, 0)
      );
      setIsFlipping(false);
    }, 600);
  };

  // Penanganan gesture untuk perangkat mobile
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      handleFlip("forward");
    } else if (diffX < -50) {
      handleFlip("backward");
    }
    touchStartX.current = null;
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-200">
      <div
        className="relative w-full h-full shadow-2xl rounded-xl overflow-hidden [perspective:2000px]"
        onTouchStart={isMobile ? handleTouchStart : null}
        onTouchEnd={isMobile ? handleTouchEnd : null}
      >
        {pages.map((page, index) => (
          <div
            key={index}
            className={`absolute h-full w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
              index === currentPage
                ? "z-10 [transform:rotateY(0deg)]"
                : index < currentPage
                ? "z-0 [transform:rotateY(-180deg)]"
                : "z-0 [transform:rotateY(180deg)]"
            } ${
              isFlipping &&
              ((index === currentPage && flipDirection === "forward") ||
                (index === currentPage + 1 && flipDirection === "forward"))
                ? "[transform:rotateY(-180deg)]"
                : ""
            } ${
              isFlipping &&
              ((index === currentPage && flipDirection === "backward") ||
                (index === currentPage - 1 && flipDirection === "backward"))
                ? "[transform:rotateY(0deg)]"
                : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              transformOrigin: "left center",
            }}
          >
            {page.content}
            <div className="absolute top-4 right-0 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
              {index + 1} dari {pages.length}
            </div>

            {/* Tombol navigasi untuk perangkat non-mobile */}
            {!isMobile && index < pages.length - 1 && (
              <button
                className="absolute bottom-0 right-0 transform -translate-y-1/2 px-4 py-2 bg-green-400 z-50 text-white rounded-lg hover:bg-green-600 shadow-lg"
                onClick={() => handleFlip("forward")}
              >
                Next
              </button>
            )}

            {!isMobile && index > 0 && (
              <button
                className="absolute bottom-0 left-0 transform -translate-y-1/2 px-4 py-2 z-50 bg-blue-400 text-white rounded-lg hover:bg-blue-600 shadow-lg"
                onClick={() => handleFlip("backward")}
              >
                Prev
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book1;
