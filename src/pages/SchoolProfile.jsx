import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SchoolProfile = () => {
  const [school, setSchool] = useState(null);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          headers: { Authorization: `Bearer ${token}` },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-900">
      {/* Tombol Menu Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#fdd401] rounded-lg shadow-lg hover:bg-amber-400 transition"
      >
        {isSidebarOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform bg-white/10 backdrop-blur-lg border-r border-white/20`}
      >
        <div className="p-6 h-full flex flex-col">
          <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#fdd401] to-amber-400 bg-clip-text text-transparent">
            Mossel
          </h1>
          <nav className="flex-1">
            <ul className="space-y-4">
              {[
                ["🏠 Dashboard", "/dashboard"],
                ["🏆 Leaderboard", "/school/leaderboard"],
                ["👤 Profile", "/profile"],
              ].map(([title, path]) => (
                <li key={title}>
                  <button
                    onClick={() => navigate(path)}
                    className="w-full px-4 py-3 text-left text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
            className="mt-6 px-4 py-3 bg-red-500/90 hover:bg-red-600 text-white rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="md:ml-64 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#fdd401] to-amber-400 bg-clip-text text-transparent text-center">
            Profil Sekolah
          </h1>
          {message && <p className="mb-6 text-center text-red-300">{message}</p>}
          {school ? (
            <div className="grid gap-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-teal-500 text-white flex items-center justify-center text-2xl font-bold rounded-full shadow">
                  {school.school_name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold mt-3 text-white">
                  {school.school_name}
                </h2>
                <p className="text-white/80">
                  Kode Sekolah:{" "}
                  <span className="font-semibold">{school.school_code}</span>
                </p>
              </div>

              <div className="text-left border-t border-white/20 pt-4">
                <p className="text-white/90">
                  <strong>Email:</strong> {school.email}
                </p>
                <p className="text-white/90">
                  <strong>Dibuat Pada:</strong>{" "}
                  {new Date(school.created_at).toLocaleDateString()}
                </p>
                <p className="text-white/90">
                  <strong>Terakhir Diperbarui:</strong>{" "}
                  {new Date(school.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            !message && <p className="text-center text-gray-300">Mengambil data...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SchoolProfile;
