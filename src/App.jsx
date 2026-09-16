import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import DocumentListPage from "./pages/Documents/DocumentListPage.jsx";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage.jsx";

import FlashcardsListPage from "./pages/Flashcards/FlashcardsListPage.jsx";
import FlashcardPage from "./pages/Flashcards/FlashcardPage.jsx";

import QuizTakePage from "./pages/Quizzes/QuizTakePage.jsx";
import QuizResultPage from "./pages/Quizzes/QuizResultPage.jsx";

import ProfilePage from "./pages/Profile/ProfilePage.jsx";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import CustomCursor from "./components/common/CustomCursor.jsx";

import { useAuth } from "./context/useAuth.js";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  // ========================================
  // AUTHENTICATION LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* ========================================
          CUSTOM CURSOR
      ======================================== */}

      <CustomCursor />

      {/* ========================================
          APPLICATION ROUTES
      ======================================== */}

      <Routes>
        {/* ========================================
            ROOT
        ======================================== */}

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ========================================
            PUBLIC ROUTES
        ======================================== */}

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* ========================================
            PROTECTED ROUTES
        ======================================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/documents" element={<DocumentListPage />} />

          <Route path="/documents/:id" element={<DocumentDetailPage />} />

          <Route path="/flashcards" element={<FlashcardsListPage />} />

          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />

          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />

          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* ========================================
            404 PAGE
        ======================================== */}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
