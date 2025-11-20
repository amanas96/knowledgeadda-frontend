import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/axios";

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses on mount
  const fetchCourses = async () => {
    try {
      const { data } = await apiClient.get("/api/v1/courses");
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (
      window.confirm(
        "Are you sure? This will delete the course and ALL its videos, PDFs, and quizzes. This cannot be undone."
      )
    ) {
      try {
        await apiClient.delete(`/api/v1/courses/${courseId}`);
        // Remove from UI immediately
        setCourses(courses.filter((c) => c._id !== courseId));
        alert("Course deleted successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to delete course.");
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
        <Link
          to="/admin/courses/new"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          + Create New Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={course.thumbnailUrl}
                    alt=""
                    className="h-12 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {course.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {course.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1">
                    {course.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/courses/${course._id}/manage`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Manage Content
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No courses found. Create one!
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseList;
