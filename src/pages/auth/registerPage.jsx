import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/authLayout";
import AuthInput from "../../components/authInput";

const RegisterPage = () => {
  const { register, backendError, setBackendError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rules, setRules] = useState({
    lower: false,
    upper: false,
    number: false,
    special: false,
    length: false,
  });

  const [showRules, setShowRules] = useState(false); // 👈 show/hide rules

  const navigate = useNavigate();

  // ----- Password Rule Checker -----
  const validatePassword = (value) => {
    setRules({
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*]/.test(value),
      length: value.length >= 6 && value.length <= 12,
    });
  };

  // ----- Submit -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    const success = await register(name, email, password);

    if (success) navigate("/");
  };

  const ruleClass = (valid) => (valid ? "text-green-600" : "text-red-500");

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join KnowledgeAdda today and unlock your learning journey"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Backend Error */}
        {backendError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm rounded-md text-center">
            {backendError}
          </div>
        )}

        {/* Name */}
        <AuthInput
          id="name"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />

        {/* Email */}
        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password + SHOW RULES ON HOVER/FOCUS */}
        <div
          className="relative"
          onMouseEnter={() => setShowRules(true)}
          onMouseLeave={() => setShowRules(false)}
        >
          <div
            onFocus={() => setShowRules(true)}
            onBlur={() => setShowRules(false)}
          >
            <AuthInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Password Rules (ONLY on hover/focus) */}
          {showRules && (
            <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md p-3 mt-1 shadow-lg text-sm z-10 transition-all duration-200">
              <p className={ruleClass(rules.lower)}>
                {rules.lower ? "✔" : "✘"} At least one lowercase letter
              </p>
              <p className={ruleClass(rules.upper)}>
                {rules.upper ? "✔" : "✘"} At least one uppercase letter
              </p>
              <p className={ruleClass(rules.number)}>
                {rules.number ? "✔" : "✘"} At least one number
              </p>
              <p className={ruleClass(rules.special)}>
                {rules.special ? "✔" : "✘"} At least one special character (@,
                #, $, %, !)
              </p>
              <p className={ruleClass(rules.length)}>
                {rules.length ? "✔" : "✘"} 6–12 characters long
              </p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
