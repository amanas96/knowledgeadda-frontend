import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import {
  adminAddContent,
  adminDeleteContent,
  adminDeleteQuiz,
  adminGetQuizzesByCourse,
  adminAddAttachment,
  adminDeleteAttachment,
} from "../../api/adminApi";
import {
  Play,
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const attachmentFileRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedContent, setExpandedContent] = useState(null);

  // ── Add content form
  const [formData, setFormData] = useState({
    title: "",
    isFree: false,
    order: "",
    attachmentType: "link",
    attachmentName: "",
    attachmentUrl: "",
  });

  // ── Add attachment form
  const [attachmentForm, setAttachmentForm] = useState({
    contentId: "",
    attachmentType: "pdf",
    attachmentName: "",
    attachmentUrl: "",
  });
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, contentRes, quizRes] = await Promise.all([
          apiClient.get(`/api/v1/courses/${courseId}`),
          apiClient.get(`/api/v1/courses/${courseId}/content`),
          adminGetQuizzesByCourse(courseId),
        ]);
        setCourse(courseRes.data);
        setContentList(contentRes.data.items || []);
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

  // add before return statement in AdminManageCourse component
  useEffect(() => {
    if (contentList.length > 0) {
      contentList.forEach((item) => {
        console.log(
          item._id,
          "video:",
          item.video,
          "attachments:",
          item.attachments,
        );
      });
    }
  }, [contentList]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // ── Submit new content
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("isFree", formData.isFree);

      fd.append("section", formData.section || "General");

      const hasFile = fileInputRef.current?.files?.length > 0;
      if (hasFile) {
        fd.append("contentFile", fileInputRef.current.files[0]);
      } else if (formData.attachmentUrl.trim()) {
        fd.append("attachmentType", formData.attachmentType);
        fd.append("attachmentName", formData.attachmentName || formData.title);
        fd.append("attachmentUrl", formData.attachmentUrl.trim());
      } else {
        alert("Please upload a file OR paste a URL.");
        setIsSubmitting(false);
        return;
      }

      const { data } = await adminAddContent(courseId, fd);
      setContentList([...contentList, data.content]);
      setFormData({
        title: "",
        isFree: false,
        section: "General",
        attachmentType: "link",
        attachmentName: "",
        attachmentUrl: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      alert("Content added successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Add attachment to existing content
  const handleAddAttachment = async (contentId) => {
    const hasFile = attachmentFileRef.current?.files?.length > 0;
    const hasUrl = attachmentForm.attachmentUrl.trim();

    if (!hasFile && !hasUrl) {
      alert("Please upload a file OR paste a URL.");
      return;
    }

    if (!attachmentForm.attachmentName.trim()) {
      alert("Please provide an attachment name.");
      return;
    }
    setIsAddingAttachment(true);
    try {
      const fd = new FormData();
      fd.append("attachmentType", attachmentForm.attachmentType);
      fd.append("attachmentName", attachmentForm.attachmentName);

      const hasFile = attachmentFileRef.current?.files?.length > 0;
      if (hasFile) {
        fd.append("attachmentFile", attachmentFileRef.current.files[0]);
        console.log("appended file to fd");
      } else if (attachmentForm.attachmentUrl.trim()) {
        fd.append("attachmentUrl", attachmentForm.attachmentUrl.trim());
      } else {
        alert("Please upload a file OR paste a URL.");
        setIsAddingAttachment(false);
        return;
      }

      const { data } = await adminAddAttachment(courseId, contentId, fd);
      setContentList(
        contentList.map((item) =>
          item._id === contentId ? data.content : item,
        ),
      );
      setAttachmentForm({
        contentId: "",
        attachmentType: "pdf",
        attachmentName: "",
        attachmentUrl: "",
      });
      if (attachmentFileRef.current) attachmentFileRef.current.value = "";
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add attachment.");
    } finally {
      setIsAddingAttachment(false);
    }
  };

  // ── Delete content
  const handleDelete = async (contentId) => {
    if (!window.confirm("Delete this content item?")) return;
    try {
      await adminDeleteContent(courseId, contentId);
      setContentList(contentList.filter((item) => item._id !== contentId));
    } catch (err) {
      alert("Failed to delete content.");
    }
  };

  // ── Delete attachment
  const handleDeleteAttachment = async (contentId, attachmentId) => {
    if (!window.confirm("Delete this attachment?")) return;
    try {
      await adminDeleteAttachment(courseId, contentId, attachmentId);
      setContentList(
        contentList.map((item) =>
          item._id === contentId
            ? {
                ...item,
                attachments: item.attachments.filter(
                  (a) => a._id !== attachmentId,
                ),
              }
            : item,
        ),
      );
    } catch (err) {
      alert("Failed to delete attachment.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await adminDeleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      alert("Failed to delete quiz.");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!course) return <div className="p-8 text-center">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
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

      {/* ── Add Content Form ───────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Content
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Introduction"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Polity, History, General"
                list="section-suggestions"
              />
              {/* ✅ show existing sections as suggestions */}
              <datalist id="section-suggestions">
                {[
                  ...new Set(contentList.map((c) => c.section).filter(Boolean)),
                ].map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
          </div>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload File (Video or PDF)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,application/pdf"
              className="block w-full text-sm text-gray-500
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-xs file:font-bold
    file:bg-blue-100 file:text-blue-700
    hover:file:bg-blue-200
    file:cursor-pointer cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">
              Video → stored as primary content. PDF → stored as attachment.
            </p>
          </div>

          {/* OR — direct URL */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-500 mb-3">
              OR add a URL resource
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="attachmentType"
                  value={formData.attachmentType}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="link">Link</option>
                  <option value="pdf">PDF URL</option>
                  <option value="notes">Notes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="attachmentName"
                  value={formData.attachmentName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Lecture Notes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="text"
                  name="attachmentUrl"
                  value={formData.attachmentUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-sm">Is this free?</span>
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Adding..." : "Add Content"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Content List ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Course Modules
          </h2>
        </div>
        <ul className="divide-y">
          {contentList.length === 0 && (
            <li className="p-6 text-center text-gray-400">No content yet</li>
          )}
          {contentList.map((item) => (
            <li key={item._id} className="p-4">
              {/* Content header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Play size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.video?.url && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Video
                        </span>
                      )}
                      {item.attachments?.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {item.attachments.length} attachment
                          {item.attachments.length > 1 ? "s" : ""}
                        </span>
                      )}
                      {item.isFree && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setExpandedContent(
                        expandedContent === item._id ? null : item._id,
                      )
                    }
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    {expandedContent === item._id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded — attachments + add attachment form */}
              {expandedContent === item._id && (
                <div className="mt-4 ml-11 space-y-3">
                  {/* Existing attachments */}
                  {item.attachments?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Attachments
                      </p>
                      {item.attachments.map((att) => (
                        <div
                          key={att._id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            {att.type === "link" ? (
                              <LinkIcon size={13} className="text-blue-500" />
                            ) : (
                              <FileText size={13} className="text-green-500" />
                            )}
                            <span className="text-sm text-gray-700">
                              {att.name}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">
                              ({att.type})
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteAttachment(item._id, att._id)
                            }
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ✅ only show add attachment form for video content */}
                  {item.video?.url && (
                    <div className="border border-dashed border-gray-200 rounded-lg p-4 space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Add Attachment
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          value={attachmentForm.attachmentType}
                          onChange={(e) =>
                            setAttachmentForm({
                              ...attachmentForm,
                              attachmentType: e.target.value,
                            })
                          }
                          className="p-2 border rounded-lg text-sm"
                        >
                          <option value="pdf">PDF</option>
                          <option value="notes">Notes</option>
                          <option value="link">Link</option>
                        </select>
                        <input
                          type="text"
                          value={attachmentForm.attachmentName}
                          onChange={(e) =>
                            setAttachmentForm({
                              ...attachmentForm,
                              attachmentName: e.target.value,
                            })
                          }
                          className="p-2 border rounded-lg text-sm"
                          placeholder="Attachment name"
                        />
                        <input
                          type="text"
                          value={attachmentForm.attachmentUrl}
                          onChange={(e) =>
                            setAttachmentForm({
                              ...attachmentForm,
                              attachmentUrl: e.target.value,
                            })
                          }
                          className="p-2 border rounded-lg text-sm"
                          placeholder="URL (optional)"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={attachmentFileRef}
                          accept="application/pdf,.doc,.docx"
                          className="text-sm"
                        />
                        <button
                          onClick={() => handleAddAttachment(item._id)}
                          disabled={isAddingAttachment}
                          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          <Plus size={14} />
                          {isAddingAttachment ? "Adding..." : "Add"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Quiz List ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Quizzes</h2>
          <Link
            to={`/admin/quizzes/new?courseId=${courseId}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
          >
            + Add Quiz
          </Link>
        </div>
        <ul className="divide-y">
          {quizzes.length === 0 && (
            <li className="p-6 text-center text-gray-400">No quizzes yet</li>
          )}
          {quizzes.map((quiz) => (
            <li
              key={quiz._id}
              className="p-4 flex justify-between items-center"
            >
              <p className="font-semibold text-gray-800">{quiz.title}</p>
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminManageCourse;
