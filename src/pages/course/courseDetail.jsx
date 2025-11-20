import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/authContext";

// === Icon Components ===
const VideoIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const QuizIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setError("You must be logged in to view this course.");
      setPageLoading(false);
      setCourse(null);
      setContent([]);
      return;
    }

    setError(null);
    setPageLoading(true);

    const fetchCourseData = async () => {
      try {
        const courseRes = await apiClient.get(`/api/v1/courses/${courseId}`);
        setCourse(courseRes.data);

        const contentRes = await apiClient.get(
          `/api/v1/courses/${courseId}/content`
        );
        setContent(contentRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("You must be logged in to view this course.");
        } else {
          setError("Failed to load course details.");
        }
      } finally {
        setPageLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, authLoading, isAuthenticated]);

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">
          {authLoading ? "Verifying your session..." : "Loading course..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access this course content
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    );
  }

  const showSubscribeButton = isAuthenticated && user && !user.isSubscribed;
  const accessibleCount = content.filter((item) => item.isAccessible).length;
  const totalCount = content.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors group"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Courses
          </button>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {course?.title}
              </h1>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                {course?.description}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <ClockIcon />
                  <span className="ml-2 font-medium">{totalCount} Lessons</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <CheckCircleIcon />
                  <span className="ml-2 font-medium">
                    {accessibleCount} Accessible
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <img
                src={course?.thumbnailUrl}
                alt={course?.title}
                className="w-full h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/400x300/3b82f6/ffffff?text=Course")
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {showSubscribeButton && <SubscribeUpsell />}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
            <p className="text-gray-600 mt-1">
              {totalCount} {totalCount === 1 ? "lesson" : "lessons"} •{" "}
              {accessibleCount} accessible
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {content.length > 0 ? (
              content.map((item, index) => (
                <ContentItem key={item._id} item={item} index={index} />
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Content Available
                </h3>
                <p className="text-gray-600">
                  Course content will be added soon. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentItem = ({ item, index }) => {
  const [showMessage, setShowMessage] = useState(false);
  const linkTo = `/course/${item.course}/content/${item._id}`;

  const getIconAndColor = () => {
    switch (item.contentType) {
      case "video":
        return {
          icon: <VideoIcon />,
          color: "blue",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        };
      case "pdf":
        return {
          icon: <DocumentIcon />,
          color: "green",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        };
      case "quiz":
        return {
          icon: <QuizIcon />,
          color: "purple",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
        };
      default:
        return {
          icon: <DocumentIcon />,
          color: "gray",
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
        };
    }
  };

  const handleLockedClick = (e) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const { icon, bgColor, textColor } = getIconAndColor();

  return (
    <div className="relative group">
      <Link
        to={item.isAccessible ? linkTo : "#"}
        onClick={!item.isAccessible ? handleLockedClick : undefined}
        className={`flex items-center p-5 transition-all duration-200 ${
          item.isAccessible
            ? "hover:bg-blue-50 cursor-pointer"
            : "cursor-not-allowed opacity-60"
        }`}
      >
        <div className="flex items-center flex-1 min-w-0">
          <div
            className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center ${textColor} mr-4 transition-transform group-hover:scale-110`}
          >
            {icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-semibold text-gray-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 capitalize">
              {item.contentType}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 ml-4">
          {item.isAccessible ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">
              <CheckCircleIcon />
              <span>Start</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-semibold text-sm">
              <LockIcon />
              <span>Premium</span>
            </div>
          )}
        </div>
      </Link>

      {showMessage && (
        <div className="absolute top-5  left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl z-10 animate-bounce">
          <div className="flex items-center gap-2">
            <LockIcon />
            <span>Subscribe to unlock premium content</span>
          </div>
        </div>
      )}
    </div>
  );
};

const SubscribeUpsell = () => (
  <div className="mb-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl overflow-hidden">
    <div className="p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">Premium Course</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Unlock Full Access</h3>
          <p className="text-blue-100 mb-4 text-lg">
            Get unlimited access to all videos, PDFs, quizzes, and exclusive
            content with our premium subscription.
          </p>
          <ul className="space-y-2 mb-6">
            {[
              "All course materials",
              "Downloadable resources",
              "Quiz assessments",
              "Lifetime access",
            ].map((feature, i) => (
              <li key={i} className="flex items-center text-blue-50">
                <CheckCircleIcon />
                <span className="ml-2">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/subscribe"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Subscribe Now
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
        <div className="hidden md:block">
          <svg
            className="w-32 h-32 text-white/10"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

export default CourseDetailPage;
