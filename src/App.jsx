import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import ResetPasswordPage from "./pages/resetPasswordPage";
import CourseLibraryPage from "./pages/courseLibrary";
import CourseDetailPage from "./pages/courseDetail";
import { useAuth } from "./context/authContext";

function App() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl">Loading...</h1>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* --- Public Routes --- */}
        <Route index element={<HomePage />} />
        {/* index means this is the default route for "/"*/}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        {/* --- Course Routes --- */}
        <Route path="courses" element={<CourseLibraryPage />} />
        <Route path="course/:courseId" element={<CourseDetailPage />} />{" "}
        {/* The :courseId is a dynamic parameter */}
        {/* We will add QuizPage and PaymentPage here later */}
        {/* <Route path="quiz/:quizId" element={<QuizPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
