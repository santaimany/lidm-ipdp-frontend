import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ chapter }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-64 h-80 cursor-pointer perspective group" onClick={() => navigate(`/chapters/${chapter.id}`)}>
      <div className="relative w-full h-full transform-style-3d transition-transform duration-700 ease-in-out">
        
        {/* Sampul Depan */}
        <div className="absolute w-full h-full bg-orange-500 text-white flex flex-col justify-center items-center text-center p-6 rounded-lg shadow-lg transform-origin-left transition-transform duration-700 group-hover:rotate-y-[-40deg] z-20">
          <span className="text-6xl">📘</span>
          <h2 className="text-2xl font-bold mt-4">{chapter.chapter_name}</h2>
        </div>

        {/* Halaman Kiri (Tetap terlihat setelah sampul terbuka) */}
        <div className="absolute w-full h-full bg-white text-gray-800 flex flex-col justify-center items-center text-center p-6 rounded-lg shadow-lg transform-origin-left z-10">
          <p className="text-lg">{chapter.description || "Discover more in this chapter."}</p>
          <span
            className={`inline-block w-8 h-8 mt-4 rounded-full ${
              chapter.is_active ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </div>

        {/* Halaman Kanan (Efek lembaran terbuka) */}
        <div className="absolute w-full h-full bg-gray-100 text-gray-700 flex flex-col justify-center items-center text-center p-6 rounded-lg shadow-lg transform-origin-left transition-transform duration-700 group-hover:rotate-y-[-20deg] z-0">
          <p className="text-lg">Explore amazing content inside.</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
