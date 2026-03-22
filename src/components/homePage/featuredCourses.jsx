import { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { Link } from "react-router-dom";
import { PlayCircle, ArrowRight, Award } from "lucide-react";

const FeaturedCourses = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await apiClient.get("/api/v1/courses");

        // Safety check: Ensure data is an array before using slice
        if (Array.isArray(data)) {
          setFeaturedCourses(data.slice(0, 3));
        } else {
          console.error("API response is not an array:", data);
          setFeaturedCourses([]);
        }
      } catch (err) {
        console.error("Failed to load courses", err);
        setFeaturedCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section id="courses" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Explore our top-rated courses designed to take you from beginner
              to pro.
            </p>
          </div>
          <Link
            to="/courses"
            className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors"
          >
            View All Courses <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>

        {isLoadingCourses ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading courses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses && featuredCourses.length > 0 ? (
              featuredCourses.map((course) => {
                if (!course) return null; // Skip if course object is invalid
                return (
                  <Link
                    to={`/course/${course.slug || course._id}`}
                    key={course._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col h-full"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={
                          course.thumbnailUrl ||
                          "https://placehold.co/600x400?text=Course"
                        }
                        alt={course.title || "Course Thumbnail"}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/600x400?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm uppercase tracking-wide">
                        Popular
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {/* Safely check if tags exist and are an array */}
                        {Array.isArray(course.tags) &&
                          course.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md uppercase tracking-wide"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title || "Untitled Course"}
                      </h3>
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow">
                        {course.description || "No description available."}
                      </p>

                      <div className="flex items-center justify-between  border-t border-gray-100 mt-auto">
                        <div className="flex items-center text-gray-500 text-sm font-medium">
                          <PlayCircle
                            size={16}
                            className="mr-2 text-blue-500"
                          />{" "}
                          Video Lessons
                        </div>
                        <div className="flex items-center text-gray-500 text-sm font-medium">
                          <Award size={16} className="mr-2 text-purple-500" />{" "}
                          Certificate
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  No courses available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/courses"
            className="inline-block px-8 py-3 bg-white border border-gray-300 rounded-full font-bold text-gray-700 shadow-sm"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
