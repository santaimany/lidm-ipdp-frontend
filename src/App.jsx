import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/RegisterStudent";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Chapters from "./pages/Chapters";
import RegisterStudent from "./pages/RegisterStudent";
import ChapterDetail from "./pages/ChapterDetail";
import StorybookDetail from "./pages/StorybookDetail";
import Greeting from "./pages/Greeting";

import StartQuiz from "./pages/StartQuiz";
import PlayQuiz from "./pages/PlayQuiz";
import SchoolProfile from "./pages/SchoolProfile";
import SchoolLeaderboard from "./pages/SchoolLeaderboard";

function App() {
    return (
        <Router>
           
            <Routes>
                <Route path="/" element={<LandingPage/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/greeting" element={<Greeting/>} />
                <Route path="/chapters" element={<Chapters />} />
                <Route path="/dashboard" element={<Dashboard />} />;
                <Route path="/chapters/:chapterId" element={<ChapterDetail />} />
                <Route path="/chapters/:chapterId/storybooks/:storybookId" element={<StorybookDetail />} />
                <Route path="/profile" element={<SchoolProfile />} />
                <Route path="/school/leaderboard" element={<SchoolLeaderboard />} />

                <Route path="/quiz/:quizId/start" element={<StartQuiz />} />
                <Route path="/quiz/:chapterId/play" element={<PlayQuiz />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Router>
    );
}

export default App;
