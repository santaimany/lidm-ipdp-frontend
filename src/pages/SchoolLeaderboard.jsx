import axios from "axios";
import React, { useEffect, useState } from "react";
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
        const response = await axios.get("https://mossel.up.railway.app/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
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
    const filtered = data.filter(
      (entry) => entry.student.class_level === classLevel
    );
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
            School Leaderboard
          </h1>
          {message && <p className="mb-6 text-center text-red-300">{message}</p>}

          {/* Dropdown Pemilihan Kelas */}
          <div className="mb-8 text-center">
            <label
              htmlFor="classFilter"
              className="mr-4 text-lg font-semibold text-white"
            >
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

          {/* Tabel Leaderboard */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fdd401]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/80 font-semibold">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-white/80 font-semibold">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-white/80 font-semibold">
                    Skor
                  </th>
                  <th className="px-6 py-4 text-left text-white/80 font-semibold">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 text-white/90">{index + 1}</td>
                      <td className="px-6 py-4 text-white/90">
                        {entry.student.name}
                      </td>
                      <td className="px-6 py-4 text-white/90">
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-green-500 h-full"
                            style={{ width: `${entry.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold block mt-1 text-white">
                          {entry.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/90">
                        {formatTime(entry.time_taken)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-red-300"
                    >
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
