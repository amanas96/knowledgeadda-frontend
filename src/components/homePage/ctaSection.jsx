import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Ready to Start Learning?
      </h2>
      <p className="text-xl text-blue-100 mb-10">
        Join thousands of students on the journey to upgrade their skills.
      </p>

      <Link
        to="/register"
        className="px-10 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-xl"
      >
        Get Started for Free
      </Link>
    </section>
  );
};

export default CTASection;
