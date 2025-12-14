import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";

const AdminManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  // Fetch course & content
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

  // Handle content upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("contentType", formData.contentType);
      formDataToSend.append("isFree", formData.isFree);

      const hasFile =
        fileInputRef.current?.files && fileInputRef.current.files.length > 0;

      // If file selected → use file
      if (hasFile) {
        formDataToSend.append("contentFile", fileInputRef.current.files[0]);
      }

      // If NO file but URL provided → send URL
      if (!hasFile && formData.contentUrl.trim()) {
        formDataToSend.append("contentUrl", formData.contentUrl.trim());
      }

      // If neither file nor URL → reject submission
      if (!hasFile && !formData.contentUrl.trim()) {
        alert("Please upload a file OR paste a content URL.");
        setIsSubmitting(false);
        return;
      }

      const { data } = await apiClient.post(
        `/api/v1/courses/${courseId}/content`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setContentList([...contentList, data.content]);

      // Reset form
      setFormData({
        title: "",
        contentType: "video",
        contentUrl: "",
        isFree: false,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      alert("Content added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete content item
  const handleDelete = async (contentId) => {
    if (!window.confirm("Delete this content item?")) return;

    try {
      await apiClient.delete(
        `/api/v1/courses/${courseId}/content/${contentId}`
      );
      setContentList(contentList.filter((item) => item._id !== contentId));
      alert("Content deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete content.");
    }
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Delete this quiz?")) return;

    try {
      await apiClient.delete(`/api/v1/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
      alert("Quiz deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz.");
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
        </div>

        <div className="flex gap-3">
          <Link
            to={`/admin/quizzes?courseId=${courseId}`}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold hover:bg-gray-200"
          >
            View Quizzes
          </Link>

          <button
            onClick={() => navigate(`/admin/quizzes/new?courseId=${courseId}`)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
          >
            + Add Quiz
          </button>
        </div>
      </div>

      {/* Add Content Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g. Introduction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload File (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,application/pdf"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload video or PDF, OR paste a URL below.
            </p>
          </div>

          {/* Optional URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Content URL (YouTube / Vimeo / S3)
            </label>
            <input
              type="text"
              name="contentUrl"
              value={formData.contentUrl}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="https://..."
            />
          </div>

          {/* Free Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="ml-2 text-sm">Is this free?</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Adding..." : "Add Content"}
          </button>
        </form>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between">
          <h2 className="text-lg font-semibold text-gray-700">
            Course Modules
          </h2>
        </div>

        <ul className="divide-y">
          {contentList.map((item) => (
            <li
              key={item._id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {item.contentUrl}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Quiz List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Quizzes</h2>

          <Link
            to={`/admin/quizzes/new?courseId=${courseId}`}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            + Add Quiz
          </Link>
        </div>

        <ul className="divide-y">
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{quiz.title}</p>
              </div>

              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminManageCourse;
