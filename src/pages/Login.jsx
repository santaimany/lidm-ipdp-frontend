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
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-orange-100">
            {/* Tombol Back dengan Z-Index Tinggi */}
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-lg font-bold hover:text-orange-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>

            {/* Background gradient effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-10 w-56 h-56 bg-orange-400 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-1/4 right-10 w-56 h-56 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="w-full max-w-md bg-orange-100 rounded-lg p-8 z-10">
                <h1 className="text-3xl font-bold text-center mb-6">Masuk</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Email */}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email atau nama pengguna"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-orange-200 border border-gray-600 rounded-lg text-orange-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 ease-in-out"
                        />
                    </div>

                    {/* Input Password */}
                    <div>
                        <div className="flex justify-between items-center">
                            <input
                                type="password"
                                name="password"
                                placeholder="Kata sandi"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-orange-200 border border-gray-600 rounded-lg text-orange-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 ease-in-out"
                            />
                         
                        </div>
                    </div>

                    {/* Tombol Login */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-700 hover:outline hover:outline-black hover:transition hover:text-white hover:duration-300 hover:ease-in-out font-bold py-3 rounded-lg transition"
                    >
                        MASUK
                    </button>
                </form>

                {/* Pesan Error */}
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}

                {/* Footer Text */}
                <p className="text-xs text-gray-400 mt-6 text-center">
                    Dengan masuk, Anda menyetujui{" "}
                    <span className="text-orange-400 underline">Ketentuan</span> dan{" "}
                    <span className="text-orange-400 underline">Kebijakan Privasi</span> kami.
                </p>
            </div>
        </div>
    );
};

export default Login;
