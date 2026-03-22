import { Link } from "react-router-dom";
const Footer = () => {
  return (
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
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
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
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
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
  );
};

export default Footer;
