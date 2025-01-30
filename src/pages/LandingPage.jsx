import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Magnet from "../effects/Magnet";
import BlurText from "../effects/BlurText";
import Navbar from "../components/Navbar";
import Superhero from "../assets/superhro.svg"
const LandingPage = () => {
    const [schoolCode, setSchoolCode] = useState("");
    const [message, setMessage] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [particles, setParticles] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null); // Simpan suara yang dipilih
    const navigate = useNavigate();
    const buttonRef = useRef(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            
            // Cari suara "Google UK English Male"
            const googleUKMale = availableVoices.find(voice => 
                voice.name.includes("Google UK English Male") && voice.lang === "en-GB"
            );

            if (googleUKMale) {
                setSelectedVoice(googleUKMale);
            } else if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0]); // Pakai suara default jika tidak tersedia
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, []);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "en-GB"; // Set bahasa ke British English
            if (selectedVoice) speech.voice = selectedVoice;
            speech.rate = 1;
            window.speechSynthesis.speak(speech);
        } else {
            alert("Browser Anda tidak mendukung fitur Text-to-Speech.");
        }
    };

    const handleStart = () => {
        const rect = buttonRef.current.getBoundingClientRect();
        createParticles(rect);
        setTimeout(() => {
            setParticles([]);
            setFormVisible(true);
        }, 1000);
    };

    const createParticles = (rect) => {
        const particleArray = [];
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 50 + 50;
            particleArray.push({
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2,
                angle,
                speed,
                size: Math.random() * 8 + 6,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            });
        }
        setParticles(particleArray);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/student/step1", {
                school_code: schoolCode,
            });

            if (response.status === 200) {
                const successMessage = "School code is valid. Continue registration.";
                setMessage(successMessage);
                speakText(successMessage);
                localStorage.setItem("schoolCode", schoolCode);
                navigate("/register-student");
            }
        } catch (error) {
            const errorMessage = error.response && error.response.status === 422
                ? "Invalid school code. Please try again."
                : "An error occurred. Please try again later.";
            setMessage(errorMessage);
            speakText(errorMessage);
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-[#F9E4CF] flex flex-col items-center justify-center overflow-hidden">
                {/* Background Illustration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-red-400 rounded-full blur-3xl opacity-50"></div>
                </div>

                <div className="z-10 text-center max-w-xl mx-auto">
                    {/* Title dengan tombol TTS */}
                    <div className="flex items-center justify-center space-x-2">
                        <BlurText
                            text="Welcome to the Wonderful World of English!"
                            delay={150}
                            animateBy="words"
                            direction="top"
                            className="text-7xl md:text-7xl font-bold text-orange-900"
                        />
                        <button
                            onClick={() => speakText("Welcome to the Wonderful World of English!")}
                            className="text-orange-900 text-2xl hover:text-orange-600 transition"
                            aria-label="Read aloud"
                        >
                            🔊
                        </button>
                    </div>

                    {/* Subtitle dengan tombol TTS */}
                    <div className="flex items-center justify-center space-x-2">
                        <BlurText
                            text="Explore the exciting journey with us. Let's get started!"
                            delay={100}
                            animateBy="words"
                            direction="bottom"
                            className="mt-4 text-2xl text-orange-700"
                        />
                        <button
                            onClick={() => speakText("Explore the exciting journey with us. Let's get started!")}
                            className="text-orange-700 text-2xl hover:text-orange-500 transition"
                            aria-label="Read aloud"
                        >
                            🔊
                        </button>
                    </div>

                    {/* Button untuk menampilkan form */}
                    {!formVisible && (
                        <Magnet>
                            <button
                                ref={buttonRef}
                                onClick={handleStart}
                                className="mt-8 w-32 h-32 bg-yellow-500 text-white font-bold text-3xl rounded-full shadow-xl hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                            >
                                Start
                            </button>
                        </Magnet>
                    )}

                    {/* Form untuk kode sekolah */}
                    {formVisible && (
                        <div className="mt-12 space-y-6 transition-all duration-500">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Enter school code"
                                    value={schoolCode}
                                    onChange={(e) => setSchoolCode(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 text-2xl border border-black bg-orange-200 text-orange-900 rounded-lg shadow focus:outline-none transition duration-300 ease-in-out focus:ring-4 focus:ring-yellow-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-700 transition text-2xl font-bold rounded-lg shadow-lg"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}

                    {message && (
                        <p className="mt-6 text-red-500 text-xl font-medium">{message}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default LandingPage;
