import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const AdminManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    contentType: "video",
    contentUrl: "",
    isFree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course + content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await apiClient.get(`/api/v1/courses/${courseId}`);
        setCourse(courseRes.data);

        const contentRes = await apiClient.get(
          `/api/v1/courses/${courseId}/content`
        );
        setContentList(contentRes.data);
        const quizRes = await apiClient.get(
          `/api/v1/quizzes/course/${courseId}`
        );
        setQuizzes(quizRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load course data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  // Handle input change
  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // Add content
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post(
        `/api/v1/courses/${courseId}/content`,
        formData
      );
      setContentList([...contentList, data]); // Update list immediately
      setFormData({
        title: "",
        contentType: "video",
        contentUrl: "",
        isFree: false,
      });
      alert("Content added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete content
  const handleDelete = async (contentId) => {
    if (window.confirm("Delete this content item?")) {
      try {
        // ✅ IMPORTANT: include courseId in URL
        await apiClient.delete(
          `/api/v1/courses/${courseId}/content/${contentId}`
        );
        setContentList(contentList.filter((item) => item._id !== contentId));
      } catch (err) {
        console.error(err);
        alert("Failed to delete content.");
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link
            to="/admin/courses"
            className="text-blue-600 hover:underline text-sm"
          >
            &larr; Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Manage: {course.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add, update and organize course content.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/admin/quizzes?courseId=${courseId}`}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200 transition"
          >
            View Quizzes
          </Link>

          <button
            onClick={() => navigate(`/admin/quizzes/new?courseId=${courseId}`)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
          >
            + Add Quiz
          </button>
        </div>
      </div>

      {/* Add Content Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Content
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Introduction Video"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content URL (Vimeo/S3/YouTube)
            </label>
            <input
              type="text"
              name="contentUrl"
              value={formData.contentUrl}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFree"
              id="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isFree" className="ml-2 text-sm text-gray-700">
              Is this free preview content?
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add Content"}
          </button>
        </form>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Course Modules
          </h2>
          <span className="text-xs text-gray-500">
            {contentList.length} item
            {contentList.length !== 1 ? "s" : ""}
          </span>
        </div>
        {contentList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No content added yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {contentList.map((item) => (
              <li
                key={item._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center overflow-hidden">
                  <span
                    className={`flex-shrink-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded uppercase mr-3 ${
                      item.contentType === "video"
                        ? "bg-blue-100 text-blue-800"
                        : item.contentType === "pdf"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.contentType}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.contentUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  {item.isFree && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* --- QUIZ LIST SECTION --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Quizzes</h2>

          <Link
            to={`/admin/quizzes/new?courseId=${courseId}`}
            className="px-4 py-2 rounded bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
          >
            + Add Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No quizzes created for this course yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <li
                key={quiz._id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-900">{quiz.title}</p>
                  <p className="text-gray-500 text-sm">
                    {quiz.totalMarks} Marks • {quiz.timeLimit} min
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    to={`/admin/quizzes/${quiz._id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminManageCourse;
