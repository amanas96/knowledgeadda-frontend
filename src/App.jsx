import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/resetPasswordPage";
import CourseLibraryPage from "./pages/course/courseLibrary";
import CourseDetailPage from "./pages/course/courseDetail";
import SubscriptionPage from "./pages/subscription/subscriptionPage";
import ContentPage from "./pages/course/contentPlayer";
import { useAuth } from "./context/authContext";
import QuizStart from "./pages/quiz/quizStart.jsx";
import QuizReview from "./pages/quiz/quizReview.jsx";
import QuizResult from "./pages/quiz/quizResult.jsx";
import QuizList from "./pages/quiz/quizList.jsx";
import AdminRoute from "./components/adminRoute";
import AdminLayout from "./pages/admin/adminLayout";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import AdminCourseList from "./pages/admin/adminCourseList.jsx";
import AdminCreateCourse from "./pages/admin/adminCreateCourse.jsx";
import AdminManageCourse from "./pages/admin/adminManageCourse.jsx";
import AdminQuizCreate from "./pages/admin/adminQuizCreate.jsx";

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
        <Route path="course/:courseId" element={<CourseDetailPage />} />
        <Route path="subscribe" element={<SubscriptionPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:quizId/start" element={<QuizStart />} />
        <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        <Route path="/quiz/:quizId/review" element={<QuizReview />} />
      </Route>

      {/* --- ADMIN ROUTES (Protected) --- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourseList />} />
          <Route path="courses/new" element={<AdminCreateCourse />} />
          <Route
            path="courses/:courseId/manage"
            element={<AdminManageCourse />}
          />
          {/* <Route path="quizzes" element={<AdminQuizList />} /> */}
          <Route path="quizzes/new" element={<AdminQuizCreate />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
