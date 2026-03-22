// pages/profile/tabs/ComingSoon.jsx
import React from "react";
import { ShoppingBag } from "lucide-react";

const ComingSoon = ({ tab }) => (
  <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <ShoppingBag className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h3>
    <p className="text-gray-500">The {tab} section is under development.</p>
  </div>
);

export default ComingSoon;
