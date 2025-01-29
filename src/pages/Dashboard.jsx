import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [chapters, setChapters] = useState([]);
    const [message, setMessage] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk hamburger menu

    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    // Fetch daftar chapters
    const fetchChapters = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/chapters", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setChapters(response.data.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("Unauthorized. Redirecting to login...");
                localStorage.removeItem("authToken");
                navigate("/login");
            } else {
                setMessage("Failed to fetch chapters.");
            }
        }
    };

    // Perbarui status chapter (mengubah is_active di tabel chapters)
    const updateChapterStatus = async (chapterId, isActive) => {
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/api/chapters/${chapterId}`,
                { is_active: isActive }, // Perubahan: kirim `is_active`
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setMessage(response.data.message);
                fetchChapters(); // Refresh daftar chapters
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage("Unauthorized. Redirecting to login...");
                localStorage.removeItem("authToken");
                navigate("/login");
            } else {
                setMessage("Failed to update chapter status.");
            }
        }
    };

    useEffect(() => {
        fetchChapters();
    }, []);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-orange-100">
            {/* Hamburger Menu Button */}
            <button
                className="md:hidden bg-orange-600 text-black p-3 m-3 rounded-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? "✖ Close Menu" : "☰ Open Menu"}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white text-black w-64 p-6 transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform md:translate-x-0 md:relative md:h-auto md:w-64`}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Quiz App</h1>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-700 hover:outline hover:transition hover:text-white hover:duration-300 hover:ease-in-out"
                                onClick={() => navigate("/dashboard")}
                            >
                                🏠 <span className="ml-2">Dashboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-700 hover:outline hover:transition hover:text-white hover:duration-300 hover:ease-in-out"
                                onClick={() => navigate("/school/leaderboard")}
                            >
                                🏆 <span className="ml-2">Leaderboard</span>
                            </button>
                        </li>
                        <li>
                            <button
                                className="flex items-center w-full px-4 py-2 rounded hover:bg-orange-700 hover:outline hover:transition hover:text-white hover:duration-300 hover:ease-in-out"
                                onClick={() => navigate("/profile")}
                            >
                                👤 <span className="ml-2">Profile</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="mt-6">
                    <button
                        onClick={() => {
                            localStorage.removeItem("authToken");
                            navigate("/login");
                        }}
                        className="w-full px-4 py-2 bg-red-500 hover:bg-orange-700 hover:outline hover:transition hover:text-white hover:duration-300 hover:ease-in-out rounded"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                        Dashboard
                    </h1>

                    {message && <p className="mb-4 text-red-500">{message}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse bg-white">
                            <thead>
                                <tr className="bg-orange-500 text-white">
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Chapter
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {chapters.map((chapter) => (
                                    <tr
                                        key={chapter.id}
                                        className="border-t hover:bg-orange-50 transition"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {chapter.chapter_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {chapter.is_active ? "Active" : "Inactive"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() =>
                                                    updateChapterStatus(
                                                        chapter.id,
                                                        !chapter.is_active
                                                    )
                                                }
                                                className={`px-4 py-2 rounded ${
                                                    chapter.is_active
                                                        ? "bg-red-500 hover:bg-orange-700 text-white"
                                                        : "bg-green-500 hover:bg-green-800 text-white"
                                                }`}
                                            >
                                                {chapter.is_active ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
