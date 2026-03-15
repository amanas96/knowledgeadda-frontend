import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import {
  adminAddContent,
  adminDeleteContent,
  adminDeleteQuiz,
  adminGetQuizzesByCourse,
} from "../../api/adminApi"; // ✅

const AdminManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "video",
    contentUrl: "",
    isFree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await apiClient.get(`/api/v1/courses/${courseId}`); // ✅ public
        setCourse(courseRes.data);

        const contentRes = await apiClient.get(
          `/api/v1/courses/${courseId}/content`,
        ); // ✅ student route
        setContentList(contentRes.data);

        const quizRes = await adminGetQuizzesByCourse(courseId); // ✅ admin API
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

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("contentType", formData.contentType);
      formDataToSend.append("isFree", formData.isFree);

      const hasFile = fileInputRef.current?.files?.length > 0;
      if (hasFile) {
        formDataToSend.append("contentFile", fileInputRef.current.files[0]);
      } else if (formData.contentUrl.trim()) {
        formDataToSend.append("contentUrl", formData.contentUrl.trim());
      } else {
        alert("Please upload a file OR paste a content URL.");
        setIsSubmitting(false);
        return;
      }

      const { data } = await adminAddContent(courseId, formDataToSend); // ✅
      setContentList([...contentList, data.content]);
      setFormData({
        title: "",
        contentType: "video",
        contentUrl: "",
        isFree: false,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Content added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await adminDeleteContent(courseId, contentId); // ✅
      setContentList(contentList.filter((item) => item._id !== contentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete content.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await adminDeleteQuiz(quizId); // ✅
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz.");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
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
        <button
          onClick={() => navigate(`/admin/quizzes/new?courseId=${courseId}`)}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
        >
          + Add Quiz
        </button>
      </div>

      {/* Add Content Form */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Content
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>
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
        <div className="px-6 py-4 border-b bg-gray-50">
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
              <p className="font-semibold">{quiz.title}</p>
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
