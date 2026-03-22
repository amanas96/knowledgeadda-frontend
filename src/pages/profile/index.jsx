// pages/profile/index.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext.jsx";
import apiClient from "../../api/axios";
import { getMyEnrollments } from "../../api/enrollmentApi";
import {
  User,
  ShoppingBag,
  Bookmark,
  Activity,
  Clock,
  Tv,
  MessageSquare,
  CreditCard,
} from "lucide-react";

import ProfileTab from "./tabs/profileTab";
import CoursesTab from "./tabs/coursesTab";
import TransactionsTab from "./tabs/transactionTab";
import ComingSoon from "./tabs/ComingSoon";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState(
    window.location.hash.replace("#", "") || "profile",
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const handleTabChange = (id) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await apiClient.get("/api/profile/me");
        updateUser({
          ...data.user,
          stats: {
            totalWatchMins: data.stats?.totalWatchTime || 0,
            contentsWatched: data.stats?.totalWatchedContents || 0,
            quizzesAttempted: data.quizAttempts?.length || 0,
            quizzesCompleted: data.stats?.quizzesCompleted || 0,
          },
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        landmark: user.landmark || "",
        city: user.city || "",
        state: user.state || "",
        pinCode: user.pinCode || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "transactions") fetchTransactions();
    if (activeTab === "courses") fetchEnrollments();
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.put("/api/profile/me", formData);
      alert("Profile Updated Successfully!");
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const { data } = await apiClient.get(
        "/api/v1/subscriptions/my-transactions",
      );
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchEnrollments = async () => {
    setLoadingCourses(true);
    try {
      const { data } = await getMyEnrollments();
      setEnrolledCourses(data);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            user={user}
            formData={formData}
            setFormData={setFormData}
            handleUpdateProfile={handleUpdateProfile}
            isSaving={isSaving}
          />
        );
      case "courses":
        return (
          <CoursesTab
            enrolledCourses={enrolledCourses}
            loadingCourses={loadingCourses}
          />
        );
      case "transactions":
        return (
          <TransactionsTab
            transactions={transactions}
            loadingTransactions={loadingTransactions}
          />
        );
      default:
        return <ComingSoon tab={activeTab} />;
    }
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "courses", label: "My Courses", icon: ShoppingBag },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "feed", label: "Feed", icon: Activity },
    { id: "quizzes", label: "Daily Quizzes", icon: MessageSquare },
    { id: "tests", label: "Time Based Test", icon: Clock },
    { id: "free", label: "Free Courses", icon: Tv },
    { id: "transactions", label: "My Transactions", icon: CreditCard },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
