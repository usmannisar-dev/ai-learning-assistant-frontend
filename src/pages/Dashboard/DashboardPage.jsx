import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import Spinner from "../../components/common/Spinner.jsx";
import progressService from "../../services/progressService.js";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await progressService.getDashboardData();

        console.log("DASHBOARD RESPONSE:", response);

        // SUPPORTS:
        // { data: {...} }
        // OR DIRECTLY {...}
        const data = response?.data ?? response;

        setDashboardData(data);
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);

        toast.error(error?.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData?.overview) {
    return (
      <>
        <style>{`
          /* =========================================
             EMPTY DASHBOARD ANIMATIONS
          ========================================= */

          @keyframes dashboardEmptyEnter {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes dashboardEmptyIcon {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
              box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
            }

            50% {
              transform: translateY(-6px) rotate(2deg);
              box-shadow:
                0 15px 35px rgba(16, 185, 129, 0.10),
                0 0 25px rgba(16, 185, 129, 0.08);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .dashboard-empty-animation,
            .dashboard-empty-icon {
              animation: none !important;
            }
          }
        `}</style>

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="dashboard-empty-animation text-center">
            <div className="dashboard-empty-icon mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>

            <p className="text-sm text-slate-600">
              No dashboard data available.
            </p>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments ?? 0,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
      accent: "blue",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards ?? 0,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      shadowColor: "shadow-purple-500/25",
      accent: "purple",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes ?? 0,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
      accent: "emerald",
    },
  ];

  const recentDocuments = dashboardData.recentActivity?.documents ?? [];

  const recentQuizzes = dashboardData.recentActivity?.quizzes ?? [];

  const recentActivities = [
    ...recentDocuments.map((doc) => ({
      id: doc._id,
      description: doc.title || doc.fileName || "Untitled Document",
      timestamp: doc.lastAccessed || doc.updatedAt || doc.createdAt,
      link: `/documents/${doc._id}`,
      type: "document",
    })),

    ...recentQuizzes.map((quiz) => ({
      id: quiz._id,
      description: quiz.title || "Quiz",
      timestamp: quiz.lastAttempted || quiz.updatedAt || quiz.createdAt,
      link: `/quizzes/${quiz._id}`,
      type: "quiz",
    })),
  ]
    .filter((activity) => activity.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  return (
    <>
      <style>{`
        /* =========================================
           DASHBOARD KEYFRAME ANIMATIONS
        ========================================= */

        @keyframes dashboardPageEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardHeaderEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
            filter: blur(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes dashboardTitleGlow {
          0%, 100% {
            text-shadow: 0 0 0 rgba(16, 185, 129, 0);
          }

          50% {
            text-shadow:
              0 0 18px rgba(16, 185, 129, 0.08);
          }
        }

        @keyframes dashboardCardEnter {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.96);
            filter: blur(6px);
          }

          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.005);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes dashboardCardGlow {
          0%, 100% {
            box-shadow:
              0 20px 45px rgba(148, 163, 184, 0.18),
              0 0 0 rgba(16, 185, 129, 0);
          }

          50% {
            box-shadow:
              0 22px 50px rgba(148, 163, 184, 0.20),
              0 0 28px rgba(16, 185, 129, 0.05);
          }
        }

        @keyframes dashboardIconFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-4px) rotate(1.5deg);
          }
        }

        @keyframes dashboardIconGlow {
          0%, 100% {
            filter:
              drop-shadow(0 0 0 rgba(255, 255, 255, 0));
          }

          50% {
            filter:
              drop-shadow(0 0 7px rgba(255, 255, 255, 0.35));
          }
        }

        @keyframes dashboardNumberEnter {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.85);
          }

          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.04);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes dashboardActivityEnter {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes dashboardActivityDot {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 rgba(16, 185, 129, 0);
          }

          50% {
            transform: scale(1.35);
            box-shadow:
              0 0 0 5px rgba(16, 185, 129, 0.08),
              0 0 15px rgba(16, 185, 129, 0.20);
          }
        }

        @keyframes dashboardClockFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes dashboardSectionEnter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dashboardOrbOne {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(35px, -25px, 0) scale(1.08);
          }
        }

        @keyframes dashboardOrbTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-35px, 25px, 0) scale(1.10);
          }
        }

        @keyframes dashboardOrbThree {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(20px, 30px, 0) scale(1.06);
          }
        }

        @keyframes dashboardShimmer {
          0% {
            transform: translateX(-130%);
          }

          100% {
            transform: translateX(130%);
          }
        }

        @keyframes dashboardViewArrow {
          0% {
            transform: translateX(0) translateY(0);
          }

          100% {
            transform: translateX(3px) translateY(-2px);
          }
        }

        @keyframes dashboardSectionIcon {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(-4deg) scale(1.05);
          }
        }

        @keyframes dashboardEmptyEnter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* =========================================
           PAGE
        ========================================= */

        .dashboard-page-animation {
          animation:
            dashboardPageEnter
            0.7s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        /* =========================================
           HEADER
        ========================================= */

        .dashboard-header-animation {
          animation:
            dashboardHeaderEnter
            0.7s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.1s
            both;
        }

        /* =========================================
           STAT CARDS
        ========================================= */

        .dashboard-stat-card {
          animation:
            dashboardCardEnter
            0.75s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .dashboard-stat-card:nth-child(1) {
          animation-delay: 0.20s;
        }

        .dashboard-stat-card:nth-child(2) {
          animation-delay: 0.32s;
        }

        .dashboard-stat-card:nth-child(3) {
          animation-delay: 0.44s;
        }

        .dashboard-stat-card:hover {
          transform: translateY(-7px) scale(1.01);
          border-color: rgba(16, 185, 129, 0.18);
          box-shadow:
            0 25px 60px rgba(148, 163, 184, 0.20),
            0 0 35px rgba(16, 185, 129, 0.07);
        }

        .dashboard-stat-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background:
            linear-gradient(
              120deg,
              transparent 20%,
              rgba(255, 255, 255, 0.45) 50%,
              transparent 80%
            );
          transform: translateX(-100%);
          transition: opacity 0.3s ease;
        }

        .dashboard-stat-card:hover::before {
          opacity: 1;
          animation:
            dashboardShimmer
            1.2s
            ease-in-out;
        }

        .dashboard-stat-icon svg {
          animation:
            dashboardIconGlow
            3s
            ease-in-out
            infinite;
        }

        .dashboard-stat-card:hover {
          transform:
            scale(1.12)
            rotate(-3deg);
        }

        .dashboard-stat-number {
          animation:
            dashboardNumberEnter
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
        }

        .dashboard-stat-card:nth-child(1) .dashboard-stat-number {
          animation-delay: 0.42s;
        }

        .dashboard-stat-card:nth-child(2) .dashboard-stat-number {
          animation-delay: 0.54s;
        }

        .dashboard-stat-card:nth-child(3) .dashboard-stat-number {
          animation-delay: 0.66s;
        }

        /* =========================================
           RECENT ACTIVITY SECTION
        ========================================= */

        .dashboard-section-animation {
          animation:
            dashboardSectionEnter
            0.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.6s
            both;
        }

        .dashboard-section-icon {
          animation:
            dashboardSectionIcon
            4s
            ease-in-out
            1.3s
            infinite;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .dashboard-section-icon:hover {
          transform: scale(1.08);
          box-shadow:
            0 8px 25px rgba(15, 23, 42, 0.10),
            0 0 20px rgba(16, 185, 129, 0.08);
        }

        /* =========================================
           ACTIVITY ITEMS
        ========================================= */

        .dashboard-activity-item {
          animation:
            dashboardActivityEnter
            0.55s
            cubic-bezier(0.22, 1, 0.36, 1)
            both;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .dashboard-activity-item:nth-child(1) {
          animation-delay: 0.75s;
        }

        .dashboard-activity-item:nth-child(2) {
          animation-delay: 0.84s;
        }

        .dashboard-activity-item:nth-child(3) {
          animation-delay: 0.93s;
        }

        .dashboard-activity-item:nth-child(4) {
          animation-delay: 1.02s;
        }

        .dashboard-activity-item:nth-child(5) {
          animation-delay: 1.11s;
        }

        .dashboard-activity-item:nth-child(6) {
          animation-delay: 1.20s;
        }

        .dashboard-activity-item:hover {
          transform: translateX(5px);
          border-color: rgba(16, 185, 129, 0.20);
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 10px 25px rgba(148, 163, 184, 0.10),
            -3px 0 0 rgba(16, 185, 129, 0.45);
        }

        .dashboard-activity-dot {
          animation:
            dashboardActivityDot
            3s
            ease-in-out
            infinite;
        }

        .dashboard-activity-item:nth-child(even)
          .dashboard-activity-dot {
          animation-delay: 0.8s;
        }

        /* =========================================
           VIEW LINK
        ========================================= */

        .dashboard-view-link {
          transition:
            color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .dashboard-view-link:hover {
          transform: translateY(-1px);
          background-color: rgba(16, 185, 129, 0.08);
          box-shadow:
            0 5px 15px rgba(16, 185, 129, 0.08);
        }

        .dashboard-view-link:hover svg {
          animation:
            dashboardViewArrow
            0.35s
            ease-out
            both;
        }

        /* =========================================
           EMPTY ACTIVITY STATE
        ========================================= */

        .dashboard-empty-animation {
          animation:
            dashboardEmptyEnter
            0.7s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.3s
            both;
        }

        .dashboard-empty-icon {
          animation:
            dashboardClockFloat
            4s
            ease-in-out
            infinite;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .dashboard-empty-icon:hover {
          transform: scale(1.08) translateY(-3px);
          box-shadow:
            0 15px 35px rgba(148, 163, 184, 0.16),
            0 0 25px rgba(16, 185, 129, 0.08);
        }

        /* =========================================
           AMBIENT BACKGROUND
        ========================================= */

        .dashboard-orb-one {
          animation:
            dashboardOrbOne
            9s
            ease-in-out
            infinite;
        }

        .dashboard-orb-two {
          animation:
            dashboardOrbTwo
            11s
            ease-in-out
            infinite;
        }

        .dashboard-orb-three {
          animation:
            dashboardOrbThree
            8s
            ease-in-out
            infinite;
        }

        /* =========================================
           REDUCED MOTION ACCESSIBILITY
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          .dashboard-page-animation,
          .dashboard-header-animation,
          .dashboard-stat-card,
          .dashboard-stat-icon svg,
          .dashboard-stat-number,
          .dashboard-section-animation,
          .dashboard-section-icon,
          .dashboard-activity-item,
          .dashboard-activity-dot,
          .dashboard-empty-animation,
          .dashboard-empty-icon,
          .dashboard-orb-one,
          .dashboard-orb-two,
          .dashboard-orb-three {
            animation: none !important;
          }

          .dashboard-stat-card,
          .dashboard-activity-item,
          .dashboard-view-link,
          .dashboard-section-icon,
          .dashboard-empty-icon {
            transition: none !important;
          }
        }
      `}</style>

      <div className="dashboard-page-animation relative min-h-screen">
        {/* =========================================
            BACKGROUND PATTERN
        ========================================= */}

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size:[16px_16px] opacity-30"
          aria-hidden="true"
        />

        {/* =========================================
            AMBIENT EMERALD ORB
        ========================================= */}

        <div
          className="dashboard-orb-one pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
          aria-hidden="true"
        />

        {/* =========================================
            AMBIENT TEAL ORB
        ========================================= */}

        <div
          className="dashboard-orb-two pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden="true"
        />

        {/* =========================================
            CENTER AMBIENT ORB
        ========================================= */}

        <div
          className="dashboard-orb-three pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          {/* =========================================
              HEADER
          ========================================= */}

          <div className="dashboard-header-animation mb-6">
            <h1 className="dashboard-title-animation mb-2 text-2xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Track your learning progress and activity.
            </p>
          </div>

          {/* =========================================
              STATS GRID
          ========================================= */}

          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="dashboard-stat-card group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500"
                >
                  {/* TOP ACCENT LINE */}

                  <div
                    className={`absolute left-0 right-0 top-0 h-2px bg-linear-to-r ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
                      {stat.label}
                    </span>

                    <div
                      className={`dashboard-stat-icon flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} transition-all duration-500`}
                    >
                      <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="dashboard-stat-number text-3xl font-semibold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-emerald-700">
                    {stat.value}
                  </div>

                  {/* BOTTOM GLOW */}

                  <div
                    className={`pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-linear-to-br ${stat.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                  />
                </div>
              );
            })}
          </div>

          {/* =========================================
              RECENT ACTIVITY
          ========================================= */}

          <div className="dashboard-section-animation rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
            {/* SECTION HEADER */}

            <div className="mb-6 flex items-center gap-3">
              <div className="dashboard-section-icon flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200">
                <Clock className="h-5 w-5 text-slate-600" strokeWidth={2} />
              </div>

              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  Recent Activity
                </h3>

                <p className="mt-0.5 text-xs text-slate-400">
                  Your latest learning interactions
                </p>
              </div>
            </div>

            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="dashboard-activity-item group flex items-center justify-between gap-4 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <div
                          className={`dashboard-activity-dot h-2 w-2 shrink-0 rounded-full ${
                            activity.type === "document"
                              ? "bg-blue-500"
                              : "bg-emerald-500"
                          }`}
                        />

                        <p className="truncate text-sm font-medium text-slate-900 transition-colors duration-200 group-hover:text-slate-950">
                          {activity.type === "document"
                            ? "Accessed Document: "
                            : "Attempted Quiz: "}

                          <span className="text-slate-700">
                            {activity.description}
                          </span>
                        </p>
                      </div>

                      <p className="pl-4 text-xs text-slate-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <Link
                      to={activity.link}
                      className="dashboard-view-link group/view shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold text-emerald-600"
                    >
                      <span className="flex items-center gap-1.5">
                        View
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-200"
                          strokeWidth={2.2}
                        />
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-animation py-12 text-center">
                <div className="dashboard-empty-icon mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Clock className="h-8 w-8 text-slate-400" />
                </div>

                <p className="text-sm text-slate-600">
                  No recent activity yet.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Start learning to see your progress here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
