import { Bell, Menu, User } from "lucide-react";

import { useAuth } from "../../context/useAuth.js";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="app-header sticky top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        {/* =========================================================
            MOBILE MENU BUTTON
        ========================================================= */}

        <button
          type="button"
          onClick={toggleSidebar}
          className="header-menu-button inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 active:scale-90 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="header-menu-icon" size={24} strokeWidth={2} />
        </button>

        {/* =========================================================
            KEEPS DESKTOP CONTENT ALIGNED RIGHT
        ========================================================= */}

        <div className="hidden md:block" />

        {/* =========================================================
            RIGHT SIDE CONTENT
        ========================================================= */}

        <div className="header-actions flex items-center gap-3">
          {/* =======================================================
              NOTIFICATION BUTTON
          ======================================================= */}

          <button
            type="button"
            className="header-notification-button group relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-slate-900 active:scale-90"
            aria-label="Notifications"
          >
            <Bell
              className="header-bell-icon transition-all duration-300"
              size={20}
              strokeWidth={2}
            />

            {/* =================================================
                NOTIFICATION INDICATOR
            ================================================= */}

            <span className="header-notification-dot absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* =======================================================
              USER PROFILE
          ======================================================= */}

          <div className="header-profile-divider border-l border-slate-200/60 pl-3">
            <div className="header-profile group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-1.5 transition-all duration-300 hover:bg-slate-50 hover:shadow-sm">
              {/* =================================================
                  PROFILE HOVER SHINE
              ================================================= */}

              <span className="header-profile-shine pointer-events-none absolute inset-y-0 -left-full w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/70 to-transparent" />

              {/* =================================================
                  USER AVATAR
              ================================================= */}

              <div className="header-avatar relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <User
                  className="header-user-icon transition-transform duration-300"
                  size={18}
                  strokeWidth={2.5}
                />

                {/* =================================================
                    AVATAR INNER HIGHLIGHT
                ================================================= */}

                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
              </div>

              {/* =================================================
                  USER INFORMATION
              ================================================= */}

              <div className="header-user-info hidden sm:block">
                <p className="header-username text-sm font-semibold text-slate-900">
                  {user?.username || "User"}
                </p>

                <p className="header-email max-w-45 truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          PREMIUM HEADER ANIMATION STYLES
      ========================================================= */}

      <style>{`
        /* =====================================================
           HEADER ENTRANCE
        ===================================================== */

        .app-header {
          animation: headerEnter 0.55s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes headerEnter {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* =====================================================
           RIGHT SIDE CONTENT ENTRANCE
        ===================================================== */

        .header-actions {
          animation: headerActionsEnter 0.55s 0.12s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes headerActionsEnter {
          from {
            opacity: 0;
            transform: translateX(12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* =====================================================
           MOBILE MENU
        ===================================================== */

        .header-menu-button {
          animation: headerMenuEnter 0.45s 0.15s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes headerMenuEnter {
          from {
            opacity: 0;
            transform: scale(0.8);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .header-menu-icon {
          transition:
            transform 0.3s ease,
            opacity 0.2s ease;
        }

        .header-menu-button:hover .header-menu-icon {
          transform: rotate(-6deg) scale(1.08);
        }

        /* =====================================================
           NOTIFICATION BUTTON
        ===================================================== */

        .header-notification-button {
          transition:
            transform 0.25s ease,
            background-color 0.25s ease,
            color 0.25s ease,
            box-shadow 0.3s ease;
        }

        .header-notification-button:hover {
          box-shadow:
            0 8px 20px rgba(15, 23, 42, 0.06);
        }

        /* =====================================================
           BELL ICON
        ===================================================== */

        .header-bell-icon {
          transform-origin: 50% 10%;
        }

        .header-notification-button:hover .header-bell-icon {
          transform: rotate(-10deg) scale(1.08);
        }

        .header-notification-button:active .header-bell-icon {
          transform: rotate(8deg) scale(0.94);
        }

        /* =====================================================
           NOTIFICATION DOT
           ONE-TIME ENTRANCE ONLY
        ===================================================== */

        .header-notification-dot {
          animation: notificationDotEnter 0.45s 0.35s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes notificationDotEnter {
          from {
            opacity: 0;
            transform: scale(0);
          }

          60% {
            transform: scale(1.25);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* =====================================================
           PROFILE AREA
        ===================================================== */

        .header-profile {
          animation: profileEnter 0.55s 0.2s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes profileEnter {
          from {
            opacity: 0;
            transform: translateX(10px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* =====================================================
           PROFILE SHINE
           ONLY PLAYS ON HOVER
        ===================================================== */

        .header-profile-shine {
          transition:
            left 0.7s ease;
        }

        .header-profile:hover .header-profile-shine {
          left: 140%;
        }

        /* =====================================================
           AVATAR
        ===================================================== */

        .header-avatar {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .header-profile:hover .header-avatar {
          transform: translateY(-1px) scale(1.05);
        }

        /* =====================================================
           USER ICON
        ===================================================== */

        .header-user-icon {
          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        .header-profile:hover .header-user-icon {
          transform: scale(1.08);
          filter:
            drop-shadow(0 0 4px rgba(255, 255, 255, 0.35));
        }

        /* =====================================================
           USER TEXT
        ===================================================== */

        .header-user-info {
          transition:
            transform 0.3s ease;
        }

        .header-profile:hover .header-user-info {
          transform: translateX(2px);
        }

        .header-username {
          transition: color 0.25s ease;
        }

        .header-profile:hover .header-username {
          color: rgb(15, 118, 110);
        }

        .header-email {
          transition:
            color 0.25s ease,
            opacity 0.25s ease;
        }

        .header-profile:hover .header-email {
          color: rgb(100, 116, 139);
        }

        /* =====================================================
           FOCUS ACCESSIBILITY
        ===================================================== */

        .header-menu-button:focus-visible,
        .header-notification-button:focus-visible,
        .header-profile:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.16);
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .app-header,
          .header-actions,
          .header-menu-button,
          .header-notification-dot,
          .header-profile {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .header-menu-button:hover .header-menu-icon,
          .header-notification-button:hover .header-bell-icon,
          .header-notification-button:active .header-bell-icon,
          .header-profile:hover .header-avatar,
          .header-profile:hover .header-user-icon,
          .header-profile:hover .header-user-info {
            transform: none !important;
          }

          .header-profile-shine {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
