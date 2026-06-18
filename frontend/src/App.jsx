import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import SearchSkills from './components/SearchSkills';
import MatchList from './components/MatchList';
import Chat from './components/Chat';
import CreateSkill from './components/CreateSkill';
import SkillMatchPage from './pages/SkillMatchPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { isAuthenticated } = useAuth();
    
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {isAuthenticated && <Navbar />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <SearchSkills />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/matches"
                        element={
                            <ProtectedRoute>
                                <MatchList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/chat/:exchangeId"
                        element={
                            <ProtectedRoute>
                                <Chat />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-skill"
                        element={
                            <ProtectedRoute>
                                <CreateSkill />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/video-call"
                        element={
                            <ProtectedRoute>
                                <SkillMatchPage />
                            </ProtectedRoute>
                        }
                    />
                    
                </Routes>
            </div>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;