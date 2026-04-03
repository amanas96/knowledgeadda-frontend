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
import AboutPage from "./pages/company/aboutPage.jsx";
import ContactPage from "./pages/company/contactPage.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

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
import GlobalLeaderboard from "./pages/quiz/globalLeaderboard.jsx";

/* --- User Pages --- */
import ProfilePage from "./pages/profile/index.jsx";

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
import AdminQuizManage from "./pages/admin/adminManageQuiz.jsx";
import AdminQuizEdit from "./pages/admin/adminQuizEdit.jsx";
import AdminQuestionEdit from "./pages/admin/adminQuestionEdit.jsx";
import AdminContactList from "./pages/admin/adminContactList.jsx";
import AdminTicketConversation from "./pages/admin/adminConatctConversation.jsx";
import AdminAnalytics from "./pages/admin/adminAnalytics.jsx";
import PrivateRoute from "./route/privateRoute.jsx";
import PublicRoute from "./route/publicRoute.jsx";
import QuizLayout from "./components/quizLayout.jsx";
import PrivacyPolicy from "./pages/legal/privacyPolicy.jsx";
import TermsOfService from "./pages/legal/TermsOfService.jsx";
import CookiePolicy from "./pages/legal/CookiePolicy.jsx";

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
    <>
      <ScrollToTop />
      <Routes>
        {/* ---------------------------------------------------
                     PUBLIC ROUTES
      ---------------------------------------------------- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <RegisterPage />{" "}
              </PublicRoute>
            }
          />
          <Route
            path="forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="reset-password/:token"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
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
                           QUIZ ROUTES 
        ---------------------------------------------------- */}

        <Route element={<QuizLayout />}>
          <Route
            path="quiz/:slug/start"
            element={
              <PrivateRoute>
                <QuizStart />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route path="quizzes" element={<QuizList />} />
          <Route
            path="quiz/:slug"
            element={
              <PrivateRoute>
                <QuizDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="quiz/:slug/result"
            element={
              <PrivateRoute>
                <QuizResult />
              </PrivateRoute>
            }
          />
          <Route
            path="quiz/:slug/review"
            element={
              <PrivateRoute>
                <QuizReview />
              </PrivateRoute>
            }
          />
          // App.jsx
          <Route
            path="/quiz/:slug/review/:attemptId"
            element={
              <PrivateRoute>
                <QuizReview />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="leaderboard" element={<GlobalLeaderboard />} />

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
            <Route path="/admin/quizzes/manage" element={<AdminQuizManage />} />
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
        {/* ---------------------------------------------------
                     Footer Routes 
      ---------------------------------------------------- */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;
