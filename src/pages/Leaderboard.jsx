import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [selectedClass, setSelectedClass] = useState("7");
    const [message, setMessage] = useState("");
    const [userStats, setUserStats] = useState({ correctAnswers: 0, totalQuestions: 0 });
    const navigate = useNavigate();
    const sessionId = localStorage.getItem("session_id");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Leaderboard
                const leaderboardResponse = await axios.get("http://127.0.0.1:8000/api/leaderboard", {
                    params: { 
                        session_id: sessionId,
                        class_level: selectedClass 
                    }
                });
                
                if (leaderboardResponse.status === 200) {
                    setLeaderboard(leaderboardResponse.data.data);
                }

                // Fetch User Stats
                const statsResponse = await axios.get("http://127.0.0.1:8000/api/user-stats", {
                    params: { session_id: sessionId }
                });
                
                if (statsResponse.status === 200) {
                    setUserStats(statsResponse.data);
                }
            } catch (error) {
                setMessage("Gagal memuat data.");
            }
        };

        fetchData();
    }, [selectedClass, sessionId]);

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    // Find current user data
    const currentUser = leaderboard.find(entry => 
        entry.student.session_id === sessionId
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex flex-col items-center py-8 px-4">
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate("/chapters")}
                    className="flex items-center space-x-2 text-lg font-bold text-white hover:text-yellow-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>
            
            <h1 className="text-5xl   mb-8 shadow-sm">Leaderboard</h1>
            {message && <p className="text-red-500 mb-4">{message}</p>}

            {/* User Stats */}
            <div className="mb-8 bg-white/20 p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Your Result</h2>
                <p className="text-xl">
                    {userStats.correctAnswers} out 15 question correct
                </p>
                <p className="text-xl">
                    score: {userStats.totalQuestions > 0 
                        ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100)
                        : 0}%
                </p>
            </div>

            {/* Filter Kelas */}
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

            {/* Podium Top 3 */}
            <div className="flex justify-center items-end space-x-4 mb-12">
                {leaderboard.slice(0, 3).map((entry, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center text-center text-teal-900 font-bold text-3xl rounded-lg shadow-lg 
                            ${index === 0 ? 'bg-yellow-400 h-52' : 
                            index === 1 ? 'bg-gray-300 h-40' : 
                            'bg-yellow-500 h-32'} 
                            w-32 py-4 relative transition-all duration-300
                            ${entry.student.session_id === sessionId ? 'ring-4 ring-green-400 scale-105' : ''}`}
                    >
                        <span className="text-2xl font-bold">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                        <span className="font-bold mt-2">{entry.student.name}</span>
                        <span className="text-lg">{entry.score}%</span>
                        {entry.student.session_id === sessionId && (
                            <span className="absolute -top-4 text-sm bg-green-500 px-2 py-1 rounded-full">
                                You
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Tabel Leaderboard */}
            <div className="w-full md:w-3/4 bg-white/10 rounded-lg shadow-lg text-2xl  overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/20">
                        <tr>
                            <th className="px-4 py-3 text-left">Rank</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Score</th>
                            <th className="px-4 py-3 text-left">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.slice(3).map((entry, index) => (
                            <tr
                                key={index}
                                className={`border-t border-white/10 ${
                                    entry.student.session_id === sessionId ? 'bg-green-500/20' : ''
                                }`}
                            >
                                <td className="px-4 py-3">#{index + 4}</td>
                                <td className="px-4 py-3 flex items-center gap-2">
                                    {entry.student.name}
                                    {entry.student.session_id === sessionId && (
                                        <span className="bg-green-500 text-xs px-2 py-1 rounded-full">
                                            You
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${entry.score}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-lg">{entry.score}%</span>
                                </td>
                                <td className="px-4 py-3">{formatTime(entry.time_taken)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Posisi User jika di luar top 10 */}
            {currentUser && !leaderboard.slice(0, 10).includes(currentUser) && (
                <div className="mt-8 bg-white/20 p-6 rounded-xl shadow-lg w-full md:w-3/4">
                    <h2 className="text-xl font-bold mb-4">Your Position</h2>
                    <div className="flex items-center justify-between">
                        <span>#{leaderboard.indexOf(currentUser) + 1}</span>
                        <span>{currentUser.student.name}</span>
                        <span>{currentUser.score}%</span>
                        <span>{formatTime(currentUser.time_taken)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;