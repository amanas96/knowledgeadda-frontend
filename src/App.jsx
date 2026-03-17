import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout";
import { useAuth } from "./context/authContext.jsx";

/* --- Public Pages --- */
import HomePage from "./pages/homePage";
import LoginPage from "./pages/auth/loginPage";
import RegisterPage from "./pages/auth/registerPage";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/resetPasswordPage";
import AboutPage from "./pages/aboutPage.jsx";
import ContactPage from "./pages/contactPage.jsx";

/* --- Courses --- */
import CourseLibraryPage from "./pages/course/courseLibrary";
import CourseDetailPage from "./pages/course/courseDetail";
import ContentPage from "./pages/course/contentPlayer";
import SubscriptionPage from "./pages/subscription/subscriptionPage";

/* --- Quizzes --- */
import QuizList from "./pages/quiz/quizList.jsx";
import QuizDetail from "./pages/quiz/quizDetail.jsx";
import QuizStart from "./pages/quiz/quizStart.jsx";
import QuizReview from "./pages/quiz/quizReview.jsx";
import QuizResult from "./pages/quiz/quizResult.jsx";

/* --- User Pages --- */
import ProfilePage from "./pages/profilePage.jsx";

/* --- Support Ticket System (User) --- */
import UserTicketList from "./pages/user/userTicketList.jsx";
import UserTicketConversation from "./pages/user/userTicketConversation.jsx";
import CreateTicket from "./pages/user/userTicket.jsx";

/* --- Admin Pages --- */
import AdminRoute from "./route/adminRoute.jsx";
import AdminLayout from "./pages/admin/adminLayout";
import AdminDashboard from "./pages/admin/adminDashboard.jsx";
import AdminCourseList from "./pages/admin/adminCourseList.jsx";
import AdminCreateCourse from "./pages/admin/adminCreateCourse.jsx";
import AdminManageCourse from "./pages/admin/adminManageCourse.jsx";
import AdminQuizCreate from "./pages/admin/adminQuizCreate.jsx";
import AdminQuizEdit from "./pages/admin/adminQuizEdit.jsx";
import AdminQuestionEdit from "./pages/admin/adminQuestionEdit.jsx";
import AdminContactList from "./pages/admin/adminContactList.jsx";
import AdminTicketConversation from "./pages/admin/adminConatctConversation.jsx";
import AdminAnalytics from "./pages/admin/adminAnalytics.jsx";
import PrivateRoute from "./route/privateRoute.jsx";

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
      {/* ---------------------------------------------------
                     PUBLIC ROUTES
      ---------------------------------------------------- */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* ---------------------------------------------------
                           COURSE ROUTES (Public + Protected) 
        ---------------------------------------------------- */}
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

        {/* ---------------------------------------------------
                           QUIZ ROUTES 
        ---------------------------------------------------- */}

        <Route path="quizzes" element={<QuizList />} />

        <Route
          path="quiz/:quizId"
          element={
            <PrivateRoute>
              <QuizDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="quiz/:quizId/start"
          element={
            <PrivateRoute>
              <QuizStart />
            </PrivateRoute>
          }
        />

        <Route
          path="quiz/:quizId/result"
          element={
            <PrivateRoute>
              <QuizResult />
            </PrivateRoute>
          }
        />

        <Route
          path="quiz/:quizId/review"
          element={
            <PrivateRoute>
              <QuizReview />
            </PrivateRoute>
          }
        />

        {/* ---------------------------------------------------
                           USER ROUTES (Protected)
        ---------------------------------------------------- */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* ---------------------------------------------------
                       SUPPORT TICKET SYSTEM (USER)
        ---------------------------------------------------- */}
        <Route
          path="support"
          element={
            <PrivateRoute>
              <UserTicketList />
            </PrivateRoute>
          }
        />
        <Route
          path="support/new"
          element={
            <PrivateRoute>
              <CreateTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="support/ticket/:id"
          element={
            <PrivateRoute>
              <UserTicketConversation />
            </PrivateRoute>
          }
        />
      </Route>

      {/* ---------------------------------------------------
                     ADMIN ROUTES (Protected)
      ---------------------------------------------------- */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourseList />} />
          <Route path="courses/new" element={<AdminCreateCourse />} />
          <Route
            path="courses/:courseId/manage"
            element={<AdminManageCourse />}
          />
          <Route path="quizzes/new" element={<AdminQuizCreate />} />
          <Route path="quizzes/:quizId/edit" element={<AdminQuizEdit />} />
          <Route
            path="quizzes/:quizId/questions/:questionId/edit"
            element={<AdminQuestionEdit />}
          />
          <Route path="analytics" element={<AdminAnalytics />} />

          {/* Admin Support Ticket Inbox */}
          <Route path="contacts" element={<AdminContactList />} />
          <Route path="tickets/:id" element={<AdminTicketConversation />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
