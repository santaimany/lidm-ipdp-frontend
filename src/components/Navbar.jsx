import axios from "axios";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "/api/logout",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="fixed w-full top-0 z-50 backdrop-blur-md border-b border-white/10">
         
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="h-10 w-10 bg-[#fdd401] rounded-lg flex items-center justify-center 
                        transition-transform group-hover:rotate-12 shadow-md">
                        <span className="text-teal-900 font-bold text-xl">M</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#fdd401] to-amber-400 
                        bg-clip-text text-transparent tracking-tighter">
                        Mossel
                    </h1>
                </Link>

                {/* Navigation Items */}
                <div className="flex items-center space-x-4">
                    {location.pathname === "/" || location.pathname === "/login" ? (
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-[#fdd401]/90 hover:bg-[#fabf00] text-teal-900 font-semibold 
                                rounded-full shadow-md transition-all transform hover:scale-105 
                                hover:shadow-lg flex items-center space-x-2"
                        >
                            <span>Login For School</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500/90 hover:bg-red-600 text-white font-semibold 
                                rounded-full shadow-md transition-all transform hover:scale-105 
                                hover:shadow-lg flex items-center space-x-2"
                        >
                            <span>Logout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;