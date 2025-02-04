import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Noise from "../effects/Noise";

const Dashboard = () => {
  const [chapters, setChapters] = useState([]);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const fetchChapters = async () => {
    setIsLoading(true); // Mulai loading
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/chapters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setChapters(response.data.data);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  };

  const updateChapterStatus = async (chapterId, isActive) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/chapters/${chapterId}`,
        { is_active: isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        fetchChapters();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
    setMessage(error.response?.data?.message || "An error occurred");
  };

  useEffect(() => {
    fetchChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-900">
      {/* Mobile Menu Button */}
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
            Quizzer
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

      {/* Main Content */}
      <main className="md:ml-64 p-6 min-h-screen">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#fdd401] to-amber-400 bg-clip-text text-transparent text-center">
            Chapter Management
          </h1>

          {message && <p className="mb-6 text-center text-red-300">{message}</p>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-white text-xl">Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/20">
              <table className="w-full">
                <thead className="bg-[#fdd401]/10">
                  <tr>
                    {["Chapter", "Status", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-white/80 font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className="border-t border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 text-white/90">
                        {chapter.chapter_name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full ${
                            chapter.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {chapter.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            updateChapterStatus(chapter.id, !chapter.is_active)
                          }
                          className={`px-4 py-2 rounded-lg transition-all ${
                            chapter.is_active
                              ? "bg-red-500/90 hover:bg-red-600"
                              : "bg-green-500/90 hover:bg-green-600"
                          } text-white`}
                        >
                          {chapter.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
