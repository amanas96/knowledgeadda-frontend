import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * A modern, animated, reusable course card.
 */
const CourseCard = ({ course }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/course/${course._id}`}
        className="block bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
      >
        {/* Image Section */}
        <div className="relative ">
          <img
            src={
              course.thumbnailUrl ||
              "https://placehold.co/600x400?text=Course+Thumbnail"
            }
            alt={course.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=No+Image";
            }}
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Ribbon Tag */}
          <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {course.category || "General"}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {course.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center text-sm text-gray-600">
          <span>👨‍🏫 {course.instructor || "Instructor"}</span>
          <span>⏱ {course.duration || "Self-paced"}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
