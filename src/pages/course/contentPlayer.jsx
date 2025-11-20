import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { useAuth } from "../../context/authContext";
import { motion } from "framer-motion";
import { Lock, PlayCircle, FileText, BookOpen, RefreshCcw } from "lucide-react";

const ContentPage = () => {
  const { courseId, contentId } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ✅ Fixed backend path
        const { data } = await apiClient.get(
          `/api/v1/courses/${courseId}/content/${contentId}`
        );
        setContent(data);
      } catch (err) {
        console.error("Failed to fetch content:", err);

        // ✅ Handle paywall or auth errors
        if (err.response?.status === 403) {
          setError(
            "This lesson is for premium members. Unlock it by subscribing below."
          );
        } else if (err.response?.status === 401) {
          setError("You need to log in to view this content.");
        } else {
          setError("Failed to load content. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [courseId, contentId]);

  const renderContent = () => {
    if (!content) return null;

    switch (content.contentType) {
      case "video":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-700"
          >
            <iframe
              src={content.contentUrl}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </motion.div>
        );

      case "pdf":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-[80vh] border border-gray-700 rounded-xl overflow-hidden"
          >
            <embed
              src={content.contentUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          </motion.div>
        );

      case "quiz":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center bg-[#0f172a] border border-gray-700 rounded-xl p-10 shadow-lg"
          >
            <BookOpen size={50} className="mx-auto text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-4">
              Quiz: {content.title}
            </h2>
            <p className="text-gray-400 mb-6 text-lg">
              Test your understanding with a quick knowledge check.
            </p>
            <Link
              to={`/quiz/${content._id}`}
              className="inline-block bg-gradient-to-r from-blue-500 to-emerald-500 px-8 py-3 rounded-lg text-white font-semibold hover:scale-[1.02] transition-transform"
            >
              Start Quiz
            </Link>
          </motion.div>
        );

      default:
        return (
          <p className="text-gray-400 text-center">
            ⚠️ Unsupported content type.
          </p>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <RefreshCcw className="animate-spin mb-3" size={26} />
        <p className="text-lg">Loading lesson...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
      >
        <Lock size={70} className="text-red-400 mb-6" />
        <h1 className="text-2xl font-bold text-red-400 mb-3">{error}</h1>
        <p className="text-gray-400 mb-6 max-w-md">
          {error.includes("premium")
            ? "Subscribe to access premium lectures, detailed notes, and quizzes designed by top mentors."
            : "Please check your login or try again later."}
        </p>

        {!user && (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold text-white"
          >
            Login
          </button>
        )}

        {user && !user.isSubscribed && (
          <Link
            to="/subscribe"
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 rounded-lg font-semibold text-white hover:scale-[1.03] transition-transform"
          >
            Subscribe & Unlock All Content
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-4 py-8 md:px-12">
      <div className="mb-6">
        <Link
          to={`/course/${courseId}`}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          ← Back to Course
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"
        >
          {content?.title}
        </motion.h1>

        <div className="mb-10">{renderContent()}</div>

        {content?.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PlayCircle size={24} className="text-blue-400" /> Lesson Overview
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {content.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ContentPage;
