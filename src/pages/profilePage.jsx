import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.jsx";
import apiClient from "../api/axios";
import {
  User,
  ShoppingBag,
  Bookmark,
  Activity,
  FileText,
  Clock,
  Tv,
  MessageSquare,
  CreditCard,
  Award,
} from "lucide-react";

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ color, icon, value, label }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-start hover:shadow-md transition-shadow">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}
    >
      {icon}
    </div>
    <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
      {label}
    </p>
  </div>
);

// ─── ComingSoon ───────────────────────────────────────────────────────────────
const ComingSoon = ({ tab }) => (
  <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <ShoppingBag className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h3>
    <p className="text-gray-500">The {tab} section is under development.</p>
  </div>
);

// ─── ProfileTab ───────────────────────────────────────────────────────────────
const ProfileTab = ({
  user,
  formData,
  setFormData,
  handleUpdateProfile,
  isSaving,
}) => (
  <>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
        Edit Profile
      </h2>
      <form onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email (Read Only)
            </label>
            <input
              type="text"
              value={formData.email}
              disabled
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Flat no./House no./Building/Company
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Landmark
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) =>
                setFormData({ ...formData, landmark: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter Landmark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Pin Code
            </label>
            <input
              type="text"
              value={formData.pinCode}
              onChange={(e) =>
                setFormData({ ...formData, pinCode: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter Pin Code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter State"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-500/30 disabled:bg-blue-400"
        >
          {isSaving ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>

    {/* Stats Section */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Stats</h3>
        <span className="text-sm text-gray-500">All time</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          color="bg-purple-100 text-purple-600"
          icon={<Clock size={24} />}
          value={`${user?.stats?.totalWatchMins || 0} Min`}
          label="Total Watch Mins"
        />
        <StatCard
          color="bg-green-100 text-green-600"
          icon={<Tv size={24} />}
          value={user?.stats?.contentsWatched || 0}
          label="Contents Watched"
        />
        <StatCard
          color="bg-red-100 text-red-600"
          icon={<FileText size={24} />}
          value={user?.stats?.quizzesAttempted || 0}
          label="Quizzes Attempted"
        />
        <StatCard
          color="bg-orange-100 text-orange-600"
          icon={<Award size={24} />}
          value={user?.stats?.quizzesCompleted || 0}
          label="Quizzes Completed"
        />
      </div>
    </div>
  </>
);

// ─── TransactionsTab ──────────────────────────────────────────────────────────
const TransactionsTab = ({ transactions, loadingTransactions }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-6">My Transactions</h3>
    {loadingTransactions ? (
      <p>Loading transactions...</p>
    ) : transactions.length === 0 ? (
      <p className="text-gray-500">No transactions found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-sm text-gray-500">Plan</th>
              <th className="p-3 text-sm text-gray-500">Amount</th>
              <th className="p-3 text-sm text-gray-500">Status</th>
              <th className="p-3 text-sm text-gray-500">Start</th>
              <th className="p-3 text-sm text-gray-500">End</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{tx.plan?.name}</td>
                <td className="p-3">₹{tx.plan?.price}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      tx.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(tx.startDate).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(tx.endDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// ─── Main ProfilePage ─────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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

  // ✅ FIX 1 — fetch fresh profile + stats on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await apiClient.get("/api/profile/me");

        // data shape: { role, user, stats, quizAttempts, watchHistory }
        // merge stats into user object so context stays flat
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

  // ✅ FIX 2 — populate formData whenever user updates in context
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

  // fetch transactions only when that tab is opened
  useEffect(() => {
    if (activeTab === "transactions") {
      fetchTransactions();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.put("/api/profile/me", formData);
      alert("Profile Updated Successfully! (Please refresh to see changes)");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const { data } = await apiClient.get(
        "/api/v1/subscriptions/my-transactions",
      );
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // ✅ FIX 3 — switch-based renderer, no accidental catch-all
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
    { id: "purchases", label: "My Purchases", icon: ShoppingBag },
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
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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

          {/* Main Content */}
          <div className="flex-grow space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
