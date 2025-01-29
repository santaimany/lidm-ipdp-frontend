import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Untuk mendapatkan rute saat ini

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("authToken");

            // Panggil API logout
            const response = await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Hapus token dari localStorage
                localStorage.removeItem("authToken");

                // Redirect ke halaman login
                navigate("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="bg-[#F9E4CF] p-4 ">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src="/path-to-logo.png" // Ganti dengan path logo yang sesuai
                        alt="Logo"
                        className="h-10 w-10"
                    />
                    <h1 className="text-orange-800 text-lg font-bold tracking-wide">
                         Quiz
                    </h1>
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center space-x-6">
                    {/* Tombol Login atau Logout */}
                    {location.pathname === "/" || location.pathname === "/login" ? (
                        <Link
                            to="/login"
                            className="bg-orange-500 hover:bg-orange-700 hover:outline hover:transition hover:text-white hover:duration-300 hover:ease-in-out px-4 py-2 rounded-lg shadow-md  transition"
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
