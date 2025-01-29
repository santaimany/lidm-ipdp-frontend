import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SchoolLeaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
    const [selectedClass, setSelectedClass] = useState("7");
    const [message, setMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/leaderboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setLeaderboard(response.data.data);
                    filterByClass(response.data.data, selectedClass);
                }
            } catch (error) {
                setMessage("Gagal memuat leaderboard sekolah.");
            }
        };

        fetchLeaderboard();
    }, [token]);

    const filterByClass = (data, classLevel) => {
        const filtered = data.filter((entry) => entry.student.class_level === classLevel);
        setFilteredLeaderboard(filtered);
    };

    const handleClassChange = (event) => {
        const selectedClassLevel = event.target.value;
        setSelectedClass(selectedClassLevel);
        filterByClass(leaderboard, selectedClassLevel);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex min-h-screen bg-orange-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white shadow-lg w-64 p-6 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform md:translate-x-0 md:relative md:h-auto md:w-64`}
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Quiz App</h1>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition"
                                onClick={() => navigate("/dashboard")}
                            >
                                🏠 <span className="ml-2">Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition"
                                onClick={() => navigate("/school/leaderboard")}
                            >
                                🏆 <span className="ml-2">Leaderboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-600 hover:text-white transition"
                                onClick={() => navigate("/profile")}
                            >
                                👤 <span className="ml-2">Profile</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            navigate("/login");
                        }}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-orange-700 text-white rounded transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:ml-64">
                {/* Hamburger Menu Button */}
                <button
                    className="md:hidden bg-orange-600 text-white p-3 mb-4 rounded-lg"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? "✖ Close Menu" : "☰ Open Menu"}
                </button>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                        School Leaderboard
                    </h1>

                    {message && <p className="text-red-500 text-center">{message}</p>}

                    {/* Dropdown for class selection */}
                    <div className="mb-8 text-center">
                        <label htmlFor="classFilter" className="mr-4 text-lg font-semibold">
                            Pilih Kelas:
                        </label>
                        <select
                            id="classFilter"
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="px-4 py-2 border rounded text-gray-800 bg-gray-200"
                        >
                            <option value="7">Kelas 7</option>
                            <option value="8">Kelas 8</option>
                            <option value="9">Kelas 9</option>
                        </select>
                    </div>

                    {/* Table for Leaderboard */}
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white text-gray-900 rounded-lg shadow-lg">
                            <thead>
                                <tr className="bg-orange-500 text-white">
                                    <th className="px-6 py-3 text-left">Rank</th>
                                    <th className="px-6 py-3 text-left">Nama</th>
                                    <th className="px-6 py-3 text-left">Skor</th>
                                    <th className="px-6 py-3 text-left">Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaderboard.length > 0 ? (
                                    filteredLeaderboard.map((entry, index) => (
                                        <tr key={index} className="border-b hover:bg-orange-50 transition">
                                            <td className="px-6 py-4 text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 text-sm">{entry.student.name}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                                    <div
                                                        className="bg-green-500 h-full"
                                                        style={{ width: `${entry.score}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold block mt-1">
                                                    {entry.score}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{formatTime(entry.time_taken)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-red-500">
                                            Tidak ada data untuk kelas {selectedClass}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchoolLeaderboard;
