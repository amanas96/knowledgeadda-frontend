// pages/profile/tabs/CoursesTab.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight } from "lucide-react";

const CoursesTab = ({ enrolledCourses, loadingCourses }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800">My Courses</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {enrolledCourses.length} course
          {enrolledCourses.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>
      <Link
        to="/courses"
        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
      >
        Browse More <ChevronRight size={14} />
      </Link>
    </div>

    {loadingCourses ? (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : enrolledCourses.length === 0 ? (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} className="text-gray-400" />
        </div>
        <h4 className="font-bold text-gray-700 mb-1">No courses yet</h4>
        <p className="text-gray-400 text-sm mb-5">
          Enroll in a course to start learning
        </p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          Browse Courses <ChevronRight size={14} />
        </Link>
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {enrolledCourses.map((course) => (
          <Link
            to={`/course/${course.slug || course._id}`}
            key={course._id}
            className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50/40 transition-colors group"
          >
            <img
              src={
                course.thumbnailUrl || "https://placehold.co/80x56?text=Course"
              }
              alt={course.title}
              className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/80x56?text=No+Image";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                {course.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                {course.description}
              </p>
              {course.tags?.length > 0 && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {course.tags.slice(0, 2).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium border border-blue-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
              <ChevronRight
                size={14}
                className="text-gray-400 group-hover:text-blue-500 transition-colors"
              />
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default CoursesTab;
