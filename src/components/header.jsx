import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  ShoppingBag,
  Bookmark,
  LayoutDashboard,
  Brain,
  Clock,
  Tv,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3 text-gray-800"
          : "bg-transparent py-5 text-white"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold flex items-center gap-2 ${isScrolled ? "text-gray-900" : "text-white"}`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            KnowledgeAdda
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("courses")}
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Courses
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-sm font-medium hover:text-blue-500 transition-colors"
          >
            Contact
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  isScrolled
                    ? "border-gray-200 text-gray-700 hover:border-blue-500"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name?.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          Hi, {user?.name?.split(" ")[0]}
                        </p>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="text-xs text-blue-600 font-semibold hover:underline block"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/courses"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} /> Store
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} /> My Purchases
                      </Link>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left">
                        <Bookmark size={16} /> Bookmarks
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left">
                        <LayoutDashboard size={16} /> Feed
                      </button>
                      <Link
                        to="/quizzes"
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 
             hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Brain size={16} /> Daily Quizzes
                      </Link>

                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors text-left">
                        <Clock size={16} /> Time Based Test
                      </button>
                      <Link
                        to="/courses"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Tv size={16} /> Free Courses
                      </Link>

                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 font-semibold mt-1"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className={`text-sm font-medium hover:opacity-80 transition-opacity ${isScrolled ? "text-gray-600" : "text-white"}`}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 ${isScrolled ? "text-gray-600" : "text-white"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              <button
                onClick={() => scrollToSection("courses")}
                className="text-left text-gray-600 font-medium py-2"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-gray-600 font-medium py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-gray-600 font-medium py-2"
              >
                Contact
              </button>
              <hr />
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 font-medium py-2"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 font-medium py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-center w-full py-3 text-gray-600 font-medium border rounded-lg"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="text-center w-full py-3 bg-blue-600 text-white font-medium rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
