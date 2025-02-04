import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setMessage(response.data.message);

                // Simpan token ke localStorage
                localStorage.setItem("authToken", response.data.data.token);

                // Redirect ke dashboard
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setMessage("Invalid credentials. Please try again.");
                } else if (error.response.status === 422) {
                    setMessage("Validation error. Please check your input.");
                } else {
                    setMessage("An unexpected error occurred.");
                }
            } else {
                setMessage("Unable to connect to the server.");
            }
        }
    };

  
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-teal-900">
     
            
            {/* Tombol Back */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-white hover:text-amber-400 transition"
            >
                <span className="text-5xl">&larr;</span>
                <span className="font-bold text-3xl">Back</span>
            </button>

            {/* Form Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                    <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                       Welcome
                    </h1>
                  

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-[#fdd401]/50 transition-all"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-[#fdd401]/50 transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#fdd401] hover:bg-amber-400 text-teal-900 font-bold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Error Message */}
                    {message && (
                        <p className="mt-4 text-center text-red-300 font-medium">
                            {message}
                        </p>
                    )}

                    {/* Footer Text */}
                    <p className="text-sm text-white/70 mt-8 text-center">
                        By continuing, you agree to our{" "}
                        <span className="text-[#fdd401] hover:text-amber-400 cursor-pointer">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-[#fdd401] hover:text-amber-400 cursor-pointer">
                            Privacy Policy
                        </span>
                    </p>
                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#fdd401]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-300/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Login;
