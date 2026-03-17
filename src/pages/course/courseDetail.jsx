import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/authContext";
import {
  Play,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle,
  Lock,
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Zap,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// ─── Content type config ──────────────────────────────────────────────────────
const typeConfig = {
  video: {
    icon: Play,
    color: "bg-blue-50 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  pdf: {
    icon: FileText,
    color: "bg-green-50 text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  quiz: {
    icon: HelpCircle,
    color: "bg-purple-50 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
  },
};

// ─── Loading ──────────────────────────────────────────────────────────────────
const LoadingScreen = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

// ─── Error Screen ─────────────────────────────────────────────────────────────
const ErrorScreen = ({ error, isAuthenticated, navigate }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock size={28} className="text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{error}</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Please sign in to access this course.
      </p>
      {!isAuthenticated && (
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Sign In
        </button>
      )}
    </div>
  </div>
);

// ─── Content Item ─────────────────────────────────────────────────────────────
const ContentItem = ({ item, index }) => {
  const [showToast, setShowToast] = useState(false);
  const config = typeConfig[item.contentType] || typeConfig.pdf;
  const Icon = config.icon;
  const linkTo = `/course/${item.course}/content/${item._id}`;

  const handleLockedClick = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative">
      <Link
        to={item.isAccessible ? linkTo : "#"}
        onClick={!item.isAccessible ? handleLockedClick : undefined}
        className={`flex items-center gap-4 px-6 py-4 transition-all group
          ${
            item.isAccessible
              ? "hover:bg-blue-50/50 cursor-pointer"
              : "cursor-not-allowed"
          }`}
      >
        {/* Index */}
        <span className="text-sm font-bold text-gray-300 w-6 flex-shrink-0 text-center">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${config.color}`}
        >
          <Icon size={18} />
        </div>

        {/* Title + type */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold truncate ${item.isAccessible ? "text-gray-800" : "text-gray-400"}`}
          >
            {item.title}
          </p>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${config.badge}`}
          >
            {item.contentType}
          </span>
        </div>

        {/* Access badge */}
        <div className="flex-shrink-0">
          {item.isAccessible ? (
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold group-hover:bg-green-200 transition-colors">
              <CheckCircle size={13} />
              Start
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <Lock size={13} />
              Premium
            </div>
          )}
        </div>
      </Link>

      {/* Toast */}
      {showToast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-10 flex items-center gap-2 whitespace-nowrap">
          <Lock size={12} />
          Subscribe to unlock premium content
        </div>
      )}
    </div>
  );
};

// ─── Subscribe Upsell ─────────────────────────────────────────────────────────
const SubscribeUpsell = () => (
  <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
    <div className="p-8 text-white">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Star size={11} fill="currentColor" /> Premium Course
          </span>
          <h3 className="text-2xl font-bold mb-2">Unlock Full Access</h3>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">
            Get unlimited access to all videos, PDFs, quizzes, and exclusive
            content with our premium subscription.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              "All course materials",
              "Downloadable resources",
              "Quiz assessments",
              "Lifetime access",
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-blue-50 text-sm"
              >
                <CheckCircle size={14} className="flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Subscribe Now <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hidden md:flex w-24 h-24 rounded-2xl bg-white/10 items-center justify-center flex-shrink-0">
          <Zap size={40} className="text-white/60" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("content"); // "content" | "quizzes"

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, contentRes, quizRes] = await Promise.all([
          apiClient.get(`/api/v1/courses/${courseId}`),
          apiClient.get(`/api/v1/courses/${courseId}/content`),
          apiClient.get(`/api/v1/quizzes/course/${courseId}`),
        ]);
        setCourse(courseRes.data);
        setContent(contentRes.data);
        setQuizzes(quizRes.data || []);
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
  }, [courseId]);

  if (authLoading || pageLoading)
    return (
      <LoadingScreen
        message={
          authLoading ? "Verifying your session..." : "Loading course..."
        }
      />
    );

  if (error)
    return (
      <ErrorScreen
        error={error}
        isAuthenticated={isAuthenticated}
        navigate={navigate}
      />
    );

  const showSubscribeButton = isAuthenticated && user && !user.isSubscribed;
  const accessibleCount = content.filter((item) => item.isAccessible).length;
  const totalCount = content.length;
  const videoCount = content.filter((c) => c.contentType === "video").length;
  const pdfCount = content.filter((c) => c.contentType === "pdf").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 text-sm font-medium transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Courses
          </button>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-5">
              {/* Tags */}
              {course?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {course?.title}
              </h1>

              {/* Description */}
              <p className="text-blue-100 text-base leading-relaxed">
                {course?.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: BookOpen, label: `${totalCount} Lessons` },
                  { icon: Play, label: `${videoCount} Videos` },
                  { icon: FileText, label: `${pdfCount} PDFs` },
                  { icon: HelpCircle, label: `${quizzes.length} Quizzes` },
                  { icon: Users, label: `${accessibleCount} Accessible` },
                ].map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-sm font-medium"
                  >
                    <Icon size={15} className="text-blue-200" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="md:col-span-1">
              <img
                src={course?.thumbnailUrl}
                alt={course?.title}
                className="w-full h-56 object-cover rounded-2xl shadow-2xl border-2 border-white/20"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/400x300/3b82f6/ffffff?text=Course")
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Area ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Subscribe upsell */}
        {showSubscribeButton && <SubscribeUpsell />}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1 w-fit">
          {[
            { id: "content", label: `Content (${totalCount})` },
            { id: "quizzes", label: `Quizzes (${quizzes.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                Course Content
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCount} lessons · {accessibleCount} accessible
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {content.length > 0 ? (
                content.map((item, i) => (
                  <ContentItem key={item._id} item={item} index={i} />
                ))
              ) : (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen size={24} className="text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-700">No content yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">
                Course Quizzes
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {quizzes.length} quizzes available
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {quizzes.length > 0 ? (
                quizzes.map((quiz, i) => (
                  <Link
                    key={quiz._id}
                    to={`/quiz/${quiz._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-purple-50/50 transition-colors group"
                  >
                    <span className="text-sm font-bold text-gray-300 w-6 text-center flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <HelpCircle size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {quiz.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> {quiz.timeLimit} min
                        </span>
                        <span className="text-xs text-gray-400">
                          {quiz.totalQuestions || "—"} questions
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            quiz.isPremium
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {quiz.isPremium ? "Premium" : "Free"}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 group-hover:text-purple-500 transition-colors"
                    />
                  </Link>
                ))
              ) : (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle size={24} className="text-gray-400" />
                  </div>
                  <p className="font-semibold text-gray-700">No quizzes yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Quizzes will be added soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
