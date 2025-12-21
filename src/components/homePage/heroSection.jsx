import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2070&q=80"
          className="w-full h-full object-cover opacity-20"
          alt="Hero Background"
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

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Unlock Your Potential with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              KnowledgeAdda
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl">
            Learn new skills with our high-quality video courses and interactive
            lessons.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition"
            >
              Start Learning Free
            </Link>
            <a
              href="#courses"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold text-lg"
            >
              Browse Courses
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
