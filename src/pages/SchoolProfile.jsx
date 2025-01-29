import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SchoolProfile = () => {
    const [school, setSchool] = useState(null);
    const [message, setMessage] = useState("");
        const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk hamburger menu
    
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            setMessage("Anda belum login, silakan login terlebih dahulu.");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setSchool(response.data.data);
                }
            } catch (error) {
                setMessage("Gagal mengambil data profil. Silakan coba lagi.");
            }
        };

        fetchProfile();
    }, [navigate, token]);

    const handleLogout = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/api/school/logout", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            setMessage("Gagal logout. Silakan coba lagi.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-orange-100">

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
                                onClick={() => navigate("/leaderboard")}
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
                    <h1 className="text-3xl font-bold text-orange-600 mb-6">
                        Profil Sekolah
                    </h1>

                    {message && <p className="mb-4 text-red-500">{message}</p>}

                    {school ? (
                        <div className="grid gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-orange-500 text-white flex items-center justify-center text-2xl font-bold rounded-full shadow">
                                    {school.school_name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold mt-3">{school.school_name}</h2>
                                <p className="text-gray-600">
                                    Kode Sekolah: <span className="font-semibold">{school.school_code}</span>
                                </p>
                            </div>

                            <div className="text-left border-t border-gray-300 pt-4">
                                <p><strong>Email:</strong> {school.email}</p>
                                <p><strong>Dibuat Pada:</strong> {new Date(school.created_at).toLocaleDateString()}</p>
                                <p><strong>Terakhir Diperbarui:</strong> {new Date(school.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        !message && <p className="text-gray-500">Mengambil data...</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SchoolProfile;
