import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

import { useAuth } from "../../context/useAuth.js";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // =========================================================
  // HANDLE LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =========================================================
  // NAVIGATION LINKS
  // =========================================================

  const navLinks = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      text: "Dashboard",
    },
    {
      to: "/documents",
      icon: FileText,
      text: "Documents",
    },
    {
      to: "/flashcards",
      icon: BookOpen,
      text: "Flashcards",
    },
    {
      to: "/profile",
      icon: User,
      text: "Profile",
    },
  ];

  return (
    <>
      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      <div
        className={`sidebar-overlay fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={`app-sidebar fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-slate-200/60 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-20 md:h-screen md:shrink-0 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* =======================================================
            LOGO
        ======================================================= */}

        <div className="sidebar-logo-section flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 px-5">
          <div className="sidebar-brand flex items-center gap-3">
            {/* =================================================
                LOGO ICON
            ================================================= */}

            <div className="sidebar-logo-icon group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30">
              <BrainCircuit
                className="sidebar-brain-icon text-white transition-all duration-300"
                size={20}
                strokeWidth={2.5}
              />

              {/* =================================================
                  LOGO INNER RING
              ================================================= */}

              <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </div>

            {/* =================================================
                BRAND TEXT
            ================================================= */}

            <h1 className="sidebar-brand-text text-sm font-bold tracking-tight text-slate-900 md:text-base">
              AI Learning Assistant
            </h1>
          </div>

          {/* =====================================================
              MOBILE CLOSE BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={toggleSidebar}
            className="sidebar-close-button rounded-lg p-1.5 text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-slate-800 active:scale-90 md:hidden"
            aria-label="Close sidebar"
          >
            <X
              className="sidebar-close-icon transition-transform duration-300"
              size={22}
            />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================= */}

        <nav className="sidebar-navigation flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
          {navLinks.map((link, index) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  if (isSidebarOpen) {
                    toggleSidebar();
                  }
                }}
                style={{
                  "--sidebar-nav-index": index,
                }}
                className={({ isActive }) =>
                  `sidebar-nav-item group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-slate-700 hover:translate-x-1 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* =========================================
                        ACTIVE ITEM LIGHT
                    ========================================= */}

                    {isActive && (
                      <span className="sidebar-active-shine pointer-events-none absolute inset-y-0 -left-full w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent" />
                    )}

                    {/* =========================================
                        ACTIVE INDICATOR
                    ========================================= */}

                    {isActive && (
                      <span className="sidebar-active-indicator absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
                    )}

                    {/* =========================================
                        NAV ICON
                    ========================================= */}

                    <Icon
                      size={18}
                      strokeWidth={2.5}
                      className={`sidebar-nav-icon relative z-10 transition-all duration-300 ${
                        isActive
                          ? "scale-105"
                          : "group-hover:scale-110 group-hover:-rotate-2"
                      }`}
                    />

                    {/* =========================================
                        NAV TEXT
                    ========================================= */}

                    <span className="sidebar-nav-text relative z-10">
                      {link.text}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* =======================================================
            LOGOUT
        ======================================================= */}

        <div className="sidebar-logout-section shrink-0 border-t border-slate-200/60 px-4 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout-button group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:translate-x-1 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
          >
            {/* =================================================
                LOGOUT HOVER SHINE
            ================================================= */}

            <span className="sidebar-logout-shine pointer-events-none absolute inset-y-0 -left-full w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/60 to-transparent" />

            {/* =================================================
                LOGOUT ICON
            ================================================= */}

            <LogOut
              size={18}
              strokeWidth={2.5}
              className="sidebar-logout-icon relative z-10 transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-110"
            />

            {/* =================================================
                LOGOUT TEXT
            ================================================= */}

            <span className="relative z-10">Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          PREMIUM SIDEBAR ANIMATION STYLES
      ========================================================= */}

      <style>{`
        /* =====================================================
           SIDEBAR ENTRANCE
        ===================================================== */

        .app-sidebar {
          animation: sidebarEnter 0.6s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarEnter {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* =====================================================
           LOGO SECTION
        ===================================================== */

        .sidebar-logo-section {
          animation: sidebarLogoSectionEnter 0.5s 0.08s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarLogoSectionEnter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================================
           BRAND ICON
        ===================================================== */

        .sidebar-logo-icon {
          animation: sidebarLogoEnter 0.55s 0.15s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarLogoEnter {
          from {
            opacity: 0;
            transform: scale(0.75) rotate(-8deg);
          }

          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        .sidebar-logo-icon:hover .sidebar-brain-icon {
          transform: scale(1.1) rotate(4deg);
          filter:
            drop-shadow(0 0 5px rgba(255, 255, 255, 0.4));
        }

        /* =====================================================
           BRAND TEXT
        ===================================================== */

        .sidebar-brand-text {
          animation: sidebarBrandTextEnter 0.5s 0.22s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarBrandTextEnter {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* =====================================================
           NAVIGATION ENTRANCE
        ===================================================== */

        .sidebar-nav-item {
          animation: sidebarNavEnter 0.45s
            calc(0.22s + (var(--sidebar-nav-index) * 0.07s))
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarNavEnter {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* =====================================================
           NAV ICON
        ===================================================== */

        .sidebar-nav-icon {
          transform-origin: center;
        }

        /* =====================================================
           ACTIVE INDICATOR
        ===================================================== */

        .sidebar-active-indicator {
          animation: sidebarIndicatorEnter 0.45s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarIndicatorEnter {
          from {
            opacity: 0;
            height: 0;
          }

          to {
            opacity: 1;
            height: 24px;
          }
        }

        /* =====================================================
           ACTIVE ITEM SHINE
           ONLY WHEN HOVERING ACTIVE ITEM
        ===================================================== */

        .sidebar-active-shine {
          transition: left 0.7s ease;
        }

        .sidebar-nav-item:hover .sidebar-active-shine {
          left: 140%;
        }

        /* =====================================================
           MOBILE CLOSE BUTTON
        ===================================================== */

        .sidebar-close-button {
          animation: sidebarCloseEnter 0.45s 0.25s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarCloseEnter {
          from {
            opacity: 0;
            transform: scale(0.7);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .sidebar-close-button:hover .sidebar-close-icon {
          transform: rotate(90deg);
        }

        /* =====================================================
           LOGOUT SECTION
        ===================================================== */

        .sidebar-logout-section {
          animation: sidebarLogoutEnter 0.5s 0.5s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sidebarLogoutEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================================
           LOGOUT SHINE
           ONLY ON HOVER
        ===================================================== */

        .sidebar-logout-shine {
          transition: left 0.7s ease;
        }

        .sidebar-logout-button:hover .sidebar-logout-shine {
          left: 140%;
        }

        /* =====================================================
           LOGOUT ICON
        ===================================================== */

        .sidebar-logout-icon {
          transform-origin: center;
        }

        /* =====================================================
           MOBILE OVERLAY
        ===================================================== */

        .sidebar-overlay {
          transition:
            opacity 0.3s ease,
            backdrop-filter 0.3s ease;
        }

        /* =====================================================
           FOCUS ACCESSIBILITY
        ===================================================== */

        .sidebar-nav-item:focus-visible,
        .sidebar-close-button:focus-visible,
        .sidebar-logout-button:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.16);
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .app-sidebar,
          .sidebar-logo-section,
          .sidebar-logo-icon,
          .sidebar-brand-text,
          .sidebar-nav-item,
          .sidebar-active-indicator,
          .sidebar-close-button,
          .sidebar-logout-section {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .sidebar-logo-icon:hover,
          .sidebar-nav-item:hover,
          .sidebar-logout-button:hover {
            transform: none !important;
          }

          .sidebar-logo-icon:hover .sidebar-brain-icon,
          .sidebar-close-button:hover .sidebar-close-icon {
            transform: none !important;
          }

          .sidebar-active-shine,
          .sidebar-logout-shine {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
