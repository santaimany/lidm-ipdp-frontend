import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterStudent = () => {
    const [formData, setFormData] = useState({
        name: "",
        class_level: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const schoolCode = localStorage.getItem("schoolCode"); // Ambil school_code dari localStorage

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/student/step2", {
                school_code: schoolCode,
                ...formData,
            });

            if (response.status === 200) {
                setMessage("Registrasi berhasil. Lanjutkan ke daftar chapter.");
                localStorage.setItem("session_id", response.data.data.session_id); // Simpan session_id
                navigate("/chapters"); // Redirect ke daftar chapter
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setMessage("Input tidak valid. Silakan periksa kembali.");
            } else {
                setMessage("Terjadi kesalahan. Silakan coba lagi nanti.");
            }
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#00A38D] overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-white text-lg font-bold hover:text-yellow-300 transition"
                >
                    <span>&larr;</span>
                    <span>Back</span>
                </button>
            </div>

            {/* **Main Content** */}
            <div className="relative flex flex-col md:flex-row items-center w-full max-w-5xl bg-transparent">
                {/* **Form Container** */}
                <div className="w-full md:w-1/2 bg-white p-10 rounded-xl shadow-xl animate-fade-in">
                    <h1 className="text-3xl font-bold text-teal-600 mb-6">Registrasi Siswa</h1>
                    <p className="text-gray-500 mb-6">
                        Isi informasi berikut untuk memulai perjalanan belajar Anda!
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama */}
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Masukkan nama"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                            />
                        </div>

                        {/* Kelas */}
                        <div>
                            <select
                                name="class_level"
                                value={formData.class_level}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-300"
                            >
                                <option value="">Pilih kelas</option>
                                <option value="7">Kelas 7</option>
                                <option value="8">Kelas 8</option>
                                <option value="9">Kelas 9</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                            Lanjutkan
                        </button>
                    </form>

                    {/* Message */}
                    {message && <p className="mt-4 text-red-500 font-medium">{message}</p>}
                </div>

                {/* **Illustration Section** */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                        <img
                            src="/hero_character.png"
                            alt="Superhero"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterStudent;
