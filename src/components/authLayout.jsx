import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            KnowledgeAdda
          </h1>
          {title && (
            <h2 className="text-2xl font-semibold mt-4 text-gray-800">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
