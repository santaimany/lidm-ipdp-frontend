import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
    const [selectedClass, setSelectedClass] = useState("7"); // Default kelas 7
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const userId = 1;
   // Ganti dengan ID pengguna yang sedang login
    
   
    // Fetch leaderboard data from API
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/leaderboard");

                if (response.status === 200) {
                    setLeaderboard(response.data.data);
                    filterByClass(response.data.data, selectedClass); // Filter for the initial class
                }
            } catch (error) {
                setMessage("Gagal memuat leaderboard.");
            }
        };

        fetchLeaderboard();
    }, []);

    // Filter leaderboard by class
    const filterByClass = (data, classLevel) => {
        const filtered = data.filter((entry) => entry.student.class_level === classLevel);
        setFilteredLeaderboard(filtered);
    };

    // Handle class selection change
    const handleClassChange = (event) => {
        const selectedClassLevel = event.target.value;
        setSelectedClass(selectedClassLevel);
        filterByClass(leaderboard, selectedClassLevel);
    };

    // Format time from seconds to mm:ss
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-8 px-4">
              <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate("/chapters")}
                    className="flex items-center space-x-2 text-lg font-bold text-white hover:text-yellow-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>
            <h1 className="text-4xl font-bold mb-8">Leaderboard</h1>
            {message && <p className="text-red-500 mb-4">{message}</p>}

            {/* Dropdown for class selection */}
            <div className="mb-8">
                <label htmlFor="classFilter" className="mr-4 text-lg font-semibold">
                    Pilih Kelas:
                </label>
                <select
                    id="classFilter"
                    value={selectedClass}
                    onChange={handleClassChange}
                    className="px-4 py-2 border rounded text-black"
                >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                </select>
            </div>

            {/* Podium for Top 3 */}
            {filteredLeaderboard.length > 0 && (
                <div className="flex justify-center items-end space-x-4 mb-12">
                    {filteredLeaderboard.slice(0, 3).map((entry, index) => {
                        const isCurrentUser = entry.student.id === userId;
                        const isFirst = index === 0;
                        const isSecond = index === 1;
                        const isThird = index === 2;
                        const width = isFirst ? "w-40" : "w-32";
                        const bgColor = isFirst
                            ? "bg-yellow-400"
                            : isSecond
                            ? "bg-gray-300"
                            : "bg-yellow-500";

                        return (
                            <div
                                key={index}
                                className={`flex flex-col items-center text-center rounded-lg shadow-lg ${bgColor} ${width} py-4 relative`}
                                style={{
                                    border: isCurrentUser ? "4px solid #4ade80" : "none",
                                    transform: "translateY(0)",
                                    animation: "fadeIn 1s ease-out",
                                }}
                            >
                                <span className="absolute top-[-20px] text-2xl font-bold text-black">
                                    {isFirst ? "🥇" : isSecond ? "🥈" : "🥉"}
                                </span>
                                <span className="text-lg font-bold text-black">
                                    {entry.student.name}
                                </span>
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-2">
                                    <div
                                        className="bg-green-500 h-full"
                                        style={{
                                            width: `${entry.score}%`,
                                            transition: "width 1s ease",
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold mt-1 text-black">
                                    {entry.score}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table for the rest */}
            <table className="table-auto w-full md:w-3/4 bg-gray-800 text-white rounded-lg shadow-lg">
                <thead>
                    <tr className="border-b border-gray-700">
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">Skor</th>
                        <th className="px-4 py-2">Waktu</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaderboard.length > 0 ? (
                        filteredLeaderboard.slice(3).map((entry, index) => {
                            const isCurrentUser = entry.student.id === userId;
                            return (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-700 text-center ${
                                        isCurrentUser ? "bg-green-800" : ""
                                    }`}
                                >
                                    <td className="px-4 py-2">{index + 4}</td>
                                    <td className="px-4 py-2">{entry.student.name}</td>
                                    <td className="px-4 py-2">
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full"
                                                style={{
                                                    width: `${entry.score}%`,
                                                    transition: "width 1s ease",
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold block mt-1">
                                            {entry.score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{formatTime(entry.time_taken)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-4 text-center text-red-500">
                                Tidak ada data untuk kelas {selectedClass}.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
