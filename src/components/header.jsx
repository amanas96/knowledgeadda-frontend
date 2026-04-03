import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import {
  Menu,
  X,
  ChevronDown,
  Bookmark,
  LayoutDashboard,
  Brain,
  Clock,
  Tv,
  Mail,
  ShoppingBag,
  LogOut,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Refs for click outside
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const profileRef = useRef(null);

  /* ---------------- CLICK OUTSIDE FOR PROFILE DROPDOWN ---------------- */
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* --------------- CLICK OUTSIDE FOR MOBILE MENU ---------------- */
  useEffect(() => {
    function handleClick(e) {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMobileMenuOpen]);

  /* ---------------- SMOOTH SCROLLING FROM HEADER ---------------- */
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0  w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6  flex justify-between items-center h-16">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-gray-900">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            KnowledgeAdda
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("courses")}
            className="nav-link"
          >
            Courses
          </button>
          <button
            onClick={() => scrollToSection("features")}
            className="nav-link"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="nav-link"
          >
            Contact
          </button>
          <Link
            to="/leaderboard"
            className="dropdown-item"
            onClick={() => setIsProfileDropdownOpen(false)}
          >
            <Trophy size={16} /> Leaderboard
          </Link>

          {/* AUTH */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="nav-link">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-blue-500 text-gray-700 text-sm"
              >
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {user?.name?.split(" ")[0]}
                <ChevronDown size={14} />
              </button>

              {/* PROFILE DROPDOWN - EXACT UI YOU SENT */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    {/*  TOP SECTION */}
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

                    {/*  MENU ITEMS */}
                    <div className="py-2">
                      <Link
                        to="/courses"
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} /> Store
                      </Link>

                      <Link
                        to="/profile#courses"
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} /> My Courses
                      </Link>

                      <button className="dropdown-item text-left">
                        <Bookmark size={16} /> Bookmarks
                      </button>

                      <button className="dropdown-item text-left">
                        <LayoutDashboard size={16} /> Feed
                      </button>

                      <Link
                        to="/quizzes"
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Brain size={16} /> Daily Quizzes
                      </Link>

                      <button className="dropdown-item text-left">
                        <Clock size={16} /> Time Based Test
                      </button>

                      <Link
                        to="/courses"
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Tv size={16} /> Free Courses
                      </Link>

                      <Link
                        to="/support"
                        className="dropdown-item"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Mail size={16} /> Support Tickets
                      </Link>

                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          className="dropdown-item text-purple-600 bg-purple-50 hover:bg-purple-100 font-semibold"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} /> Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* EXACT LOGOUT SECTION */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          ref={buttonRef}
          className="md:hidden p-2 text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              <button
                onClick={() => scrollToSection("courses")}
                className="mobile-item"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="mobile-item"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="mobile-item"
              >
                Contact
              </button>
              <hr />

              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="mobile-auth">
                    Log in
                  </Link>
                  <Link to="/register" className="mobile-primary">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className="mobile-item">
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 py-2 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/* ---------- EXTRA TAILWIND HELPERS ---------- */
const styles = `
.nav-link {
  @apply text-sm font-medium text-gray-700 hover:text-blue-600 transition;
}
.dropdown-item {
  @apply flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors;
}
.mobile-item {
  @apply text-left text-gray-700 font-medium py-2 hover:text-blue-600;
}
.mobile-auth {
  @apply w-full py-3 border rounded-lg text-center text-gray-700;
}
.mobile-primary {
  @apply w-full py-3 bg-blue-600 text-white rounded-lg text-center;
}
`;

export default Header;
