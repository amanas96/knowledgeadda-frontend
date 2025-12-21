import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import { useAuth } from "./context/authContext.jsx";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/resetPasswordPage";
import CourseLibraryPage from "./pages/course/courseLibrary";
import CourseDetailPage from "./pages/course/courseDetail";
import SubscriptionPage from "./pages/subscription/subscriptionPage";
import ContentPage from "./pages/course/contentPlayer";
import PrivateRoute from "./route/privateRoute.jsx";

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
import AdminQuizEdit from "./pages/admin/adminQuizEdit.jsx";
import AdminQuestionEdit from "./pages/admin/adminQuestionEdit.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import AboutPage from "./pages/aboutPage.jsx";
import ContactPage from "./pages/contactPage.jsx";
import AdminContactList from "./pages/admin/adminContactList.jsx";

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
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* --- Course Routes --- */}
        <Route path="courses" element={<CourseLibraryPage />} />
        <Route
          path="course/:courseId"
          element={
            <PrivateRoute>
              <CourseDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="course/:courseId/content/:contentId"
          element={
            <PrivateRoute>
              <ContentPage />
            </PrivateRoute>
          }
        />

        <Route
          path="subscribe"
          element={
            <PrivateRoute>
              <SubscriptionPage />
            </PrivateRoute>
          }
        />
        <Route path="content" element={<ContentPage />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quiz/:quizId/start" element={<QuizStart />} />
        <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        <Route path="/quiz/:quizId/review" element={<QuizReview />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
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
          {/* EDIT QUIZ */}
          <Route path="quizzes/:quizId/edit" element={<AdminQuizEdit />} />

          {/* EDIT SINGLE QUESTION */}
          <Route
            path="quizzes/:quizId/questions/:questionId/edit"
            element={<AdminQuestionEdit />}
          />

          <Route path="contacts" element={<AdminContactList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
