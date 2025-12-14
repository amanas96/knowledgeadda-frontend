import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Award,
  Clock,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import apiClient from "../api/axios";

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Fetch a few courses for the "Featured" section
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
    <div className="font-sans text-gray-800">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center bg-gray-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-900"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center md:text-left"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30 backdrop-blur-md">
              🚀 Revolutionizing Online Learning
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              Unlock Your Potential with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                KnowledgeAdda
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed md:mx-0 mx-auto">
              Master new skills with our comprehensive library of video courses,
              interactive quizzes, and expert-led tutorials. Your future starts
              here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:scale-105"
              >
                Start Learning Free <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById("courses");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Browse Courses
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Active Students" },
              { number: "50+", label: "Expert Courses" },
              { number: "1000+", label: "Video Hours" },
              { number: "4.9", label: "User Rating" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="hover:transform hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-4xl font-extrabold text-gray-900 mb-1">
                  {stat.number}
                </h3>
                <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FEATURED COURSES SECTION --- */}
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
                      to={`/course/${course._id}`}
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

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
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

      {/* --- FEATURES / "WHY US" SECTION --- */}
      <section id="features" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                alt="Students collaborating"
                className="rounded-2xl shadow-2xl relative z-10 w-full"
              />
            </div>
            <div className="lg:w-1/2">
              <span className="text-blue-600 font-bold uppercase tracking-wide text-sm mb-2 block">
                Why Choose Us?
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Learning that adapts to your{" "}
                <span className="text-blue-600">lifestyle</span>.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe education should be accessible, engaging, and
                effective. Our platform is built with modern technology to help
                you achieve your goals faster than ever before.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Learn at your own pace",
                    desc: "Lifetime access to all courses so you can learn whenever you want, wherever you are.",
                  },
                  {
                    title: "Expert Instructors",
                    desc: "Learn from industry professionals with real-world experience who care about your success.",
                  },
                  {
                    title: "Interactive Quizzes",
                    desc: "Test your knowledge with built-in quizzes and get instant feedback to reinforce learning.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already learning and growing with
            KnowledgeAdda. No credit card required to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-blue-700 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl"
            >
              Get Started for Free
            </Link>
            <Link
              to="/courses"
              className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      Email Us
                    </p>
                    <p className="font-medium text-lg text-gray-900">
                      support@knowledgeadda.com
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      We usually reply within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      Call Us
                    </p>
                    <p className="font-medium text-lg text-gray-900">
                      +91 1234567890
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Mon-Fri, 9am - 6pm IST
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">
                      Visit Us
                    </p>
                    <p className="font-medium text-lg text-gray-900">
                      Cyber City, Gurugram
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Haryana, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Link
                to="/"
                className="text-2xl font-bold text-white flex items-center gap-2 mb-4 justify-center md:justify-start"
              >
                <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-base">
                  K
                </span>
                KnowledgeAdda
              </Link>
              <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Empowering learners worldwide with high-quality, accessible
                education technology. Join the revolution today.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">
                Platform
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/courses"
                    className="hover:text-white transition-colors"
                  >
                    Browse Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/subscribe"
                    className="hover:text-white transition-colors"
                  >
                    Pricing & Plans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Student Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("contact")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="hover:text-white transition-colors"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} KnowledgeAdda. Made with ❤️ for
            students.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
