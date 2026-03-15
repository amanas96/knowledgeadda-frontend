import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const CTASection = () => {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  const targetLink = isLoggedIn ? "/profile" : "/register";
  const buttonText = isLoggedIn ? "Continue Learning" : "Get Started for Free";

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-6">
        Ready to Start Learning?
      </h2>

      <p className="text-xl text-blue-100 mb-10">
        Join thousands of students on the journey to upgrade their skills.
      </p>

      <Link
        to={targetLink}
        className="px-10 py-4 bg-white text-blue-700 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition"
      >
        {buttonText}
      </Link>
    </section>
  );
};

export default CTASection;
