import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import CloudinaryUploadWidget from "../../components/cloudinaryUploadWidget";

const AdminCreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- 2. HANDLE UPLOAD SUCCESS ---
  const handleUploadSuccess = (result) => {
    // The widget returns { url, ... }
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: result.url, // Set the URL from Cloudinary
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.thumbnailUrl) {
      alert("Please upload a thumbnail image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      await apiClient.post("/api/v1/courses", {
        ...formData,
        tags: tagsArray,
      });
      alert("Course created successfully!");
      navigate("/admin/courses");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Course
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Complete MERN Stack Guide"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="What will students learn?"
          />
        </div>

        {/* --- 3. REPLACED TEXT INPUT WITH WIDGET --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>

          <div className="flex items-center space-x-4">
            {/* The Upload Button */}
            <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />

            {/* The Preview */}
            {formData.thumbnailUrl ? (
              <div className="relative w-32 h-20 border rounded overflow-hidden">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload an image (JPG, PNG) to display on the course card.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="react, nodejs, mongodb (comma separated)"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateCourse;
