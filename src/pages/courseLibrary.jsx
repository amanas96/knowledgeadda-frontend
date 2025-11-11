import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import CourseCard from "../components/courseComponent";
import { motion } from "framer-motion";

const CourseLibraryPage = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data } = await apiClient.get("/api/v1/courses");
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("⚠️ Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Explore Our Courses
        </motion.h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-64 bg-gray-200 animate-pulse rounded-xl shadow-sm"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center mt-20 text-red-600 font-medium text-lg">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center mt-20 text-gray-600 text-lg">
            📚 No courses available right now. Check back soon!
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {courses.map((course) => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseLibraryPage;
