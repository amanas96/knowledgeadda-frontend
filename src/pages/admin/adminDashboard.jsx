import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAnalytics,
  adminGetAllUsers,
  adminGetSubscribedUsers,
} from "../../api/adminApi";
import { useAuth } from "../../context/authContext";
import {
  Users,
  TrendingUp,
  BookOpen,
  CreditCard,
  PlusCircle,
  Settings,
  MessageSquare,
  BarChart2,
  ChevronRight,
  X,
  ArrowUpRight,
} from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color, onClick }) => {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 w-full text-left transition-all
        ${onClick ? "hover:shadow-md hover:scale-[1.02] cursor-pointer group" : ""}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {sub && (
          <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1">
            <ArrowUpRight size={12} /> {sub}
          </p>
        )}
      </div>
      {onClick && (
        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors"
        />
      )}
    </Wrapper>
  );
};

// ─── Quick Action Card ────────────────────────────────────────────────────────
const ActionCard = ({ to, icon, label, sub, color }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:scale-[1.01] transition-all group"
  >
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>
    </div>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors"
    />
  </Link>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ modal, modalData, modalLoading, closeModal }) => (
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={closeModal}
  >
    <div
      className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {modal === "users" ? "All Users" : "Subscriptions"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {modalData.length}{" "}
            {modal === "users" ? "registered users" : "subscription records"}
          </p>
        </div>
        <button
          onClick={closeModal}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
        {modalLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading data...</p>
          </div>
        ) : modalData.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No data found.</p>
          </div>
        ) : modal === "users" ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {["#", "Name", "Email", "Joined", "Role"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modalData.map((user, i) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(user.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                        user.isAdmin
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "Student"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {["#", "User", "Plan", "Amount", "Status", "Expires"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modalData.map((sub, i) => (
                <tr
                  key={`${sub._id}-${i}`}
                  className="hover:bg-green-50/30 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold flex-shrink-0">
                        {sub.user?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {sub.user?.name || "Deleted User"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {sub.user?.email || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {sub.plan?.name || "—"}
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-green-700">
                    ₹{sub.plan?.price || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                        sub.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(sub.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalRevenue: 0,
    totalUsers: 0,
    newUsersThisMonth: 0,
    revenueThisMonth: 0,
    activeSubscriptions: 0,
  });
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAnalytics();
        setStats({
          totalCourses: data.overview.totalCourses,
          totalRevenue: data.overview.totalRevenue,
          totalUsers: data.overview.totalUsers,
          newUsersThisMonth: data.overview.newUsersThisMonth,
          revenueThisMonth: data.overview.revenueThisMonth,
          activeSubscriptions: data.overview.activeSubscriptions,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  const openModal = async (type) => {
    setModal(type);
    setModalLoading(true);
    setModalData([]);
    try {
      if (type === "users") {
        const { data } = await adminGetAllUsers();
        setModalData(data);
      } else if (type === "revenue") {
        const { data } = await adminGetSubscribedUsers();
        setModalData(data);
      }
    } catch (err) {
      console.error("Failed to load modal data", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModal(null);
    setModalData([]);
  };

  // Get time of day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting} </p>
            <h1 className="text-2xl font-bold mt-1">{user?.name || "Admin"}</h1>
            <p className="text-blue-200 text-sm mt-1">
              Here's what's happening on your platform today.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <p className="text-blue-200 text-xs">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link
              to="/admin/analytics"
              className="mt-2 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <BarChart2 size={13} /> View Full Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<BookOpen size={22} className="text-blue-600" />}
          label="Total Courses"
          value={stats.totalCourses}
          color="bg-blue-50"
        />
        <StatCard
          icon={<CreditCard size={22} className="text-green-600" />}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          sub={`₹${stats.revenueThisMonth.toLocaleString()} this month`}
          color="bg-green-50"
          onClick={() => openModal("revenue")}
        />
        <StatCard
          icon={<Users size={22} className="text-purple-600" />}
          label="Total Users"
          value={stats.totalUsers}
          sub={`+${stats.newUsersThisMonth} this month`}
          color="bg-purple-50"
          onClick={() => openModal("users")}
        />
      </div>

      {/* ── Active Subscriptions Banner ───────────────────────────────── */}
      <div
        onClick={() => openModal("revenue")}
        className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-100 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <TrendingUp size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Active Subscriptions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.activeSubscriptions}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold group-hover:gap-3 transition-all">
          View Details <ChevronRight size={16} />
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActionCard
            to="/admin/courses/new"
            icon={<PlusCircle size={20} className="text-blue-600" />}
            label="Create New Course"
            sub="Add a new video series or tutorial"
            color="bg-blue-50"
          />
          <ActionCard
            to="/admin/courses"
            icon={<Settings size={20} className="text-purple-600" />}
            label="Manage Content"
            sub="Edit existing courses and quizzes"
            color="bg-purple-50"
          />
          <ActionCard
            to="/admin/quizzes/manage" // Points to the new page
            icon={<Settings size={20} className="text-purple-600" />}
            label="Manage Quizzes"
            sub="Edit or delete existing quizzes"
            color="bg-purple-50"
          />
          <ActionCard
            to="/admin/quizzes/new"
            icon={<PlusCircle size={20} className="text-indigo-600" />}
            label="Create New Quiz"
            sub="Add a new quiz to any course"
            color="bg-indigo-50"
          />
          <ActionCard
            to="/admin/contacts"
            icon={<MessageSquare size={20} className="text-red-500" />}
            label="Contact Messages"
            sub="View user enquiries & messages"
            color="bg-red-50"
          />
          <ActionCard
            to="/admin/analytics"
            icon={<BarChart2 size={20} className="text-green-600" />}
            label="View Analytics"
            sub="Full platform analytics and charts"
            color="bg-green-50"
          />
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {modal && (
        <Modal
          modal={modal}
          modalData={modalData}
          modalLoading={modalLoading}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
