import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import { useAuth } from "../context/authContext";

// --- Icon Helper Components ---
const VideoIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

const QuizIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
// ------------------------------

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch course details
        const courseRes = await apiClient.get(`/api/v1/courses/${courseId}`);
        setCourse(courseRes.data);

        // 2. Fetch course content list (this call is paywalled)
        const contentRes = await apiClient.get(
          `/api/v1/courses/${courseId}/content`
        );
        setContent(contentRes.data);
      } catch (err) {
        console.error("Failed to fetch course data:", err);
        if (err.response && err.response.status === 401) {
          // If not logged in, API sends 401
          setError("You must be logged in to view this course.");
        } else {
          setError("Failed to load course details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]); // Re-fetch if the user logs in/out

  if (isLoading) {
    return <div className="text-center mt-20 text-xl">Loading course...</div>;
  }

  // Handle case where user is not logged in
  if (error && !isAuthenticated) {
    return (
      <div className="text-center mt-20 p-4">
        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Login to View
        </button>
      </div>
    );
  }

  // Handle other errors
  if (error) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">{error}</div>
    );
  }

  // Show the subscribe button if user is logged in but not subscribed
  const showSubscribeButton = isAuthenticated && user && !user.isSubscribed;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Course Header */}
      <div className="flex flex-col md:flex-row items-center mb-8">
        <img
          src={course?.thumbnailUrl}
          alt={course?.title}
          className="w-full md:w-1_3 h-48 md:h-64 object-cover rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x300/e2e8f0/cbd5e0?text=Course";
          }}
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-3">{course?.title}</h1>
          <p className="text-lg text-gray-700 mb-4">{course?.description}</p>
          {showSubscribeButton && <SubscribeUpsell />}
        </div>
      </div>

      {/* Course Content List */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
        <div className="space-y-3">
          {content.length > 0 ? (
            content.map((item) => <ContentItem key={item._id} item={item} />)
          ) : (
            <p className="text-gray-600">
              {showSubscribeButton
                ? "Subscribe to see the full course content."
                : "No content available for this course yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const ContentItem = ({ item }) => {
  const getIcon = () => {
    switch (item.contentType) {
      case "video":
        return <VideoIcon />;
      case "pdf":
        return <DocumentIcon />;
      case "quiz":
        return <QuizIcon />;
      default:
        return null;
    }
  };

  // This link points to the "ContentPlayer" page (Phase 7)
  const linkTo = `/course/${item.course}/content/${item._id}`;

  return (
    <Link
      to={linkTo}
      className="flex items-center p-4 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors"
    >
      {getIcon()}
      <span className="text-lg font-medium text-gray-800">{item.title}</span>
      {item.isFree && (
        <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
          Free
        </span>
      )}
    </Link>
  );
};

const SubscribeUpsell = () => (
  <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow">
    <h3 className="font-bold">This is a premium course</h3>
    <p className="mb-3">
      Subscribe now to get access to all paid videos, PDFs, and quizzes.
    </p>
    <Link
      to="/subscribe"
      className="inline-block bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
    >
      Subscribe Now
    </Link>
  </div>
);

export default CourseDetailPage;
