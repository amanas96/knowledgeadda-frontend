import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetAllQuizzes, adminDeleteQuiz } from "../../api/adminApi";
import {
  Edit3,
  Trash2,
  Search,
  Plus,
  BookOpen,
  Clock,
  HelpCircle,
} from "lucide-react";

const AdminQuizManage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadQuizzes = async () => {
    try {
      const { data } = await adminGetAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Delete this quiz and all its questions?")) return;
    try {
      await adminDeleteQuiz(quizId);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-sm text-gray-500">
            Edit, update, or remove any quiz from the platform
          </p>
        </div>
        <Link
          to="/admin/quizzes/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
        >
          <Plus size={18} /> Create New Quiz
        </Link>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by quiz title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:block text-sm text-gray-400 font-medium">
          Total: {filteredQuizzes.length} Quizzes
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Quiz Info
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-10 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredQuizzes.map((q) => (
                <tr
                  key={q._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{q.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <HelpCircle size={12} /> {q.totalQuestions || 0} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {q.timeLimit}m
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {q.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/quizzes/${q._id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Quiz & Questions"
                      >
                        <Edit3 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQuizManage;
