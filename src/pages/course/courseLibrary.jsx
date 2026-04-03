import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/axios";
import CourseCard from "./courseComponent";
import { motion, AnimatePresence } from "framer-motion";

const LIMIT = 6;

const SkeletonCard = () => (
  <div className="h-64 bg-gray-200 animate-pulse rounded-xl shadow-sm" />
);

const CourseLibraryPage = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // ── fetch a single page ────────────────────────────────────────────────────
  const fetchCourses = useCallback(async (pageNum, append = false) => {
    try {
      append ? setIsLoadingMore(true) : setIsLoading(true);
      setError(null);

      const { data } = await apiClient.get("/api/v1/courses", {
        params: {
          page: pageNum,
          limit: LIMIT,
          sortBy: "createdAt",
          order: "desc",
        },
      });

      setCourses((prev) =>
        append ? [...prev, ...data.courses] : data.courses,
      );
      setHasMore(data.pagination.hasMore);
      setTotal(data.pagination.total);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("⚠️ Failed to load courses. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchCourses(1, false);
  }, [fetchCourses]);

  // load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCourses(nextPage, true); // append = true → adds to existing list
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-gray-900 mb-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Explore Our Courses
        </motion.h1>

        {/* total count */}
        {!isLoading && total > 0 && (
          <motion.p
            className="text-center text-gray-500 text-sm mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Showing {courses.length} of {total} courses
          </motion.p>
        )}

        {/* initial skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
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
          <>
            {/* course grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              {/* existing courses */}
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  layout
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}

              {/* skeleton cards appended while loading more */}
              <AnimatePresence>
                {isLoadingMore &&
                  [1, 2, 3].map((n) => (
                    <motion.div
                      key={`skeleton-${n}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <SkeletonCard />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>

            {/* load more button */}
            {hasMore && (
              <motion.div
                className="flex flex-col items-center mt-12 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isLoadingMore ? "Loading..." : "Load More Courses"}
                </button>
                <p className="text-gray-400 text-xs">
                  {total - courses.length} more course
                  {total - courses.length !== 1 ? "s" : ""} available
                </p>
              </motion.div>
            )}

            {/* all loaded message */}
            {!hasMore && courses.length > LIMIT && (
              <motion.p
                className="text-center text-gray-400 text-sm mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                You have seen all {total} courses
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseLibraryPage;
