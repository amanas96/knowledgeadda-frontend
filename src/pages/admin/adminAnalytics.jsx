import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics } from "../../api/adminApi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  TrendingUp,
  BookOpen,
  Award,
  CreditCard,
  Activity,
  FileText,
  Star,
  Clock,
  ChevronLeft,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonthlyData = (data) =>
  data.map((d) => ({
    month: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
    revenue: d.revenue || 0,
    users: d.count || 0,
  }));

const COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      {sub && (
        <p className="text-xs text-green-600 mt-0.5 font-medium">{sub}</p>
      )}
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, sub }) => (
  <div className="mb-4">
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await getAnalytics();
        setData(data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Failed to load analytics.
      </div>
    );
  }

  const { overview, charts, topQuizzes, topCourses } = data;
  const revenueChartData = formatMonthlyData(charts.monthlyRevenue);
  const usersChartData = formatMonthlyData(charts.monthlyUsers);

  // Merge for combined chart
  const combinedChartData = revenueChartData.map((r) => {
    const u = usersChartData.find((u) => u.month === r.month);
    return { ...r, users: u?.users || 0 };
  });

  // Pie chart data for content breakdown
  const contentPieData = [
    { name: "Courses", value: overview.totalCourses },
    { name: "Content", value: overview.totalContent },
    { name: "Quizzes", value: overview.totalQuizzes },
  ];

  // Quiz completion rate
  const completionRate =
    overview.totalQuizAttempts > 0
      ? Math.round(
          (overview.completedAttempts / overview.totalQuizAttempts) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Page Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-1"
            >
              <ChevronLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Analytics Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Everything you've created and how it's performing
            </p>
          </div>
        </div>

        {/* ── Overview Stats Row 1 ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users size={22} className="text-blue-600" />}
            label="Total Users"
            value={overview.totalUsers}
            sub={`+${overview.newUsersThisMonth} this month`}
            color="bg-blue-50"
          />
          <StatCard
            icon={<CreditCard size={22} className="text-green-600" />}
            label="Total Revenue"
            value={`₹${overview.totalRevenue.toLocaleString()}`}
            sub={`₹${overview.revenueThisMonth.toLocaleString()} this month`}
            color="bg-green-50"
          />
          <StatCard
            icon={<TrendingUp size={22} className="text-purple-600" />}
            label="Active Subscriptions"
            value={overview.activeSubscriptions}
            sub={`+${overview.newSubscriptionsThisMonth} this month`}
            color="bg-purple-50"
          />
          <StatCard
            icon={<Award size={22} className="text-orange-600" />}
            label="Avg Quiz Score"
            value={`${overview.avgQuizScore}%`}
            sub={`${overview.completedAttempts} completed`}
            color="bg-orange-50"
          />
        </div>

        {/* ── Overview Stats Row 2 ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen size={22} className="text-cyan-600" />}
            label="Courses Created"
            value={overview.totalCourses}
            color="bg-cyan-50"
          />
          <StatCard
            icon={<FileText size={22} className="text-indigo-600" />}
            label="Content Uploaded"
            value={overview.totalContent}
            color="bg-indigo-50"
          />
          <StatCard
            icon={<Star size={22} className="text-yellow-600" />}
            label="Quizzes Created"
            value={overview.totalQuizzes}
            color="bg-yellow-50"
          />
          <StatCard
            icon={<Activity size={22} className="text-rose-600" />}
            label="Total Quiz Attempts"
            value={overview.totalQuizAttempts}
            sub={`${completionRate}% completion rate`}
            color="bg-rose-50"
          />
        </div>

        {/* ── Revenue + Users Charts ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="Monthly Revenue (₹)"
              sub="Revenue generated over last 6 months"
            />
            {combinedChartData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No revenue data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={combinedChartData}>
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563eb"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* New Users Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="New Users per Month"
              sub="User signups over last 6 months"
            />
            {usersChartData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No user data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={combinedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar
                    dataKey="users"
                    fill="#8b5cf6"
                    radius={[6, 6, 0, 0]}
                    name="New Users"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Content Breakdown + Quiz Completion ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="Content Breakdown"
              sub="What you've created so far"
            />
            <div className="flex items-center justify-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={contentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {contentPieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {contentPieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto pl-4">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz Completion Rate */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="Quiz Performance"
              sub="How students are doing on your quizzes"
            />
            <div className="space-y-5 mt-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-gray-900">
                    {completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Avg Score</span>
                  <span className="font-bold text-gray-900">
                    {overview.avgQuizScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${overview.avgQuizScore}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.totalQuizAttempts}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Attempts</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {overview.completedAttempts}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Quizzes + Top Courses ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Quizzes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="Top Quizzes by Attempts"
              sub="Your most popular quizzes"
            />
            {topQuizzes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No quiz data yet
              </p>
            ) : (
              <div className="space-y-4">
                {topQuizzes.map((q, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {q.title}
                      </p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-orange-400 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min((q.attempts / (topQuizzes[0]?.attempts || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-800">
                        {q.attempts}
                      </p>
                      <p className="text-xs text-gray-400">{q.avgScore}% avg</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <SectionHeader
              title="Top Courses by Watch Time"
              sub="Your most watched courses"
            />
            {topCourses.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No watch data yet
              </p>
            ) : (
              <div className="space-y-4">
                {topCourses.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {c.title}
                      </p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-400 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min((c.totalWatchMins / (topCourses[0]?.totalWatchMins || 1)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-800">
                        {c.totalWatchMins} min
                      </p>
                      <p className="text-xs text-gray-400">
                        {c.totalStudents} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
