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
  Award,
} from "lucide-react";

// ─── Constants & Config ──────────────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────────────────
const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

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
        setError(
          err.response?.status === 401
            ? "You must be logged in."
            : "Failed to load course.",
        );
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  if (authLoading || pageLoading)
    return <LoadingScreen message="Loading course..." />;
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── 1. Hero Section (Full Width) ────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
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

          <div className="max-w-4xl space-y-5">
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
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {course?.title}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
              {course?.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Main Content Grid (Left-Right Layout) ────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN (7/12) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl border border-gray-200 shadow-sm p-1 w-fit">
              {[
                { id: "content", label: `Curriculum (${totalCount})` },
                { id: "quizzes", label: `Quizzes (${quizzes.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List View */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === "content"
                    ? "Course Curriculum"
                    : "Practice Assessments"}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {activeTab === "content" ? (
                  content.length > 0 ? (
                    content.map((item, i) => (
                      <ContentItem key={item._id} item={item} index={i} />
                    ))
                  ) : (
                    <EmptyState icon={BookOpen} title="No lessons yet" />
                  )
                ) : quizzes.length > 0 ? (
                  quizzes.map((quiz, i) => (
                    <QuizListItem key={quiz._id} quiz={quiz} index={i} />
                  ))
                ) : (
                  <EmptyState icon={HelpCircle} title="No quizzes yet" />
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sidebar (5/12) ── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Thumbnail & Quick Stats */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
              <img
                src={course?.thumbnailUrl}
                alt={course?.title}
                className="w-full aspect-video object-cover rounded-xl shadow-inner"
                onError={(e) =>
                  (e.target.src =
                    "https://placehold.co/600x400/3b82f6/ffffff?text=Course")
                }
              />
              <div className="p-4 grid grid-cols-2 gap-4">
                <SidebarStat icon={Play} label="Videos" value={videoCount} />
                <SidebarStat icon={FileText} label="PDFs" value={pdfCount} />
              </div>
            </div>

            {/* Premium Upsell Card */}
            {showSubscribeButton && (
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-xl shadow-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Star
                    size={18}
                    className="text-yellow-400"
                    fill="currentColor"
                  />
                  <span className="font-bold text-sm tracking-wide uppercase">
                    Unlock Pro Access
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Master this subject with KnowledgeAdda Premium
                </h3>
                <ul className="space-y-3 mb-8 text-blue-50 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle size={16} /> Unlimited Content Access
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={16} /> Downloadable PDF Guides
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle size={16} /> Quiz Certifications
                  </li>
                </ul>
                <Link
                  to="/subscribe"
                  className="block text-center bg-white text-blue-600 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98]"
                >
                  Start Subscription{" "}
                  <ChevronRight className="inline ml-1" size={16} />
                </Link>
              </div>
            )}

            {/* Highlights Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-5">
                Course Highlights
              </h4>
              <div className="space-y-4">
                <HighlightRow
                  icon={Users}
                  text={`${accessibleCount} active learners`}
                />
                <HighlightRow icon={Zap} text="Updated for 2026 Curriculum" />
                <HighlightRow icon={Award} text="Includes Final Assessment" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const ContentItem = ({ item, index }) => {
  const [showToast, setShowToast] = React.useState(false);
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
        className={`flex items-center gap-4 px-6 py-5 transition-all group ${item.isAccessible ? "hover:bg-blue-50/50 cursor-pointer" : "cursor-not-allowed"}`}
      >
        <span className="text-sm font-bold text-gray-300 w-6 flex-shrink-0 text-center">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${config.color}`}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold truncate ${item.isAccessible ? "text-gray-800" : "text-gray-400"}`}
          >
            {item.title}
          </p>
          <span
            className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-md mt-1 inline-block ${config.badge}`}
          >
            {item.contentType}
          </span>
        </div>
        <div>
          {item.isAccessible ? (
            <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle size={13} /> Start
            </div>
          ) : (
            <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Lock size={13} /> Premium
            </div>
          )}
        </div>
      </Link>
      {showToast && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl z-20 flex items-center gap-2">
          Subscribe to unlock
        </div>
      )}
    </div>
  );
};

const QuizListItem = ({ quiz, index }) => (
  <Link
    to={`/quiz/${quiz.slug || quiz._id}`}
    className="flex items-center gap-4 px-6 py-5 hover:bg-purple-50/50 transition-colors group"
  >
    <span className="text-sm font-bold text-gray-300 w-6 text-center">
      {String(index + 1).padStart(2, "0")}
    </span>
    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
      <HelpCircle size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800 truncate">
        {quiz.title}
      </p>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {quiz.timeLimit} min
        </span>
        <span>{quiz.totalQuestions || "—"} questions</span>
      </div>
    </div>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-purple-500 transition-colors"
    />
  </Link>
);

const SidebarStat = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
    <Icon size={16} className="mx-auto mb-1 text-blue-600" />
    <div className="text-lg font-bold text-gray-900">{value}</div>
    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
      {label}
    </div>
  </div>
);

const HighlightRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 text-sm text-gray-600">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
      <Icon size={16} />
    </div>
    <span className="font-medium">{text}</span>
  </div>
);

const EmptyState = ({ icon: Icon, title }) => (
  <div className="py-20 text-center">
    <Icon size={48} className="mx-auto text-gray-200 mb-4" />
    <p className="font-bold text-gray-400">{title}</p>
  </div>
);

const LoadingScreen = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

const ErrorScreen = ({ error, isAuthenticated, navigate }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
      <Lock size={48} className="text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-6">{error}</h2>
      {!isAuthenticated && (
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
        >
          Sign In
        </button>
      )}
    </div>
  </div>
);

export default CourseDetailPage;
