import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, Rocket } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Empowering Your Learning Journey
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          KnowledgeAdda is dedicated to providing high-quality, affordable
          education to students everywhere. We bridge the gap between curiosity
          and mastery.
        </p>
      </motion.div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-gray-600">
            To democratize education by making premium test prep and skill-based
            courses accessible to everyone, regardless of their background.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">What We Serve</h3>
          <p className="text-gray-600">
            Comprehensive video courses, detailed PDF notes, and rigorous test
            series designed by experts to ensure your success in competitive
            exams.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3">Future Vision</h3>
          <p className="text-gray-600">
            We are building an AI-powered recommendation engine to personalize
            your learning path and adaptive quizzes that evolve with your skill
            level.
          </p>
        </div>
      </div>

      {/* Story / Text Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Why KnowledgeAdda?
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            In today's fast-paced world, finding structured, reliable study
            material can be overwhelming. KnowledgeAdda was born out of the need
            to simplify preparation for competitive exams.
          </p>
          <p>
            We don't just provide content; we provide a pathway. From
            understanding the basics with our video lectures to testing your
            knowledge with our quizzes, we are with you at every step.
          </p>
          <p className="font-semibold text-blue-600">
            Join thousands of students who are redefining their future with us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
