import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="not-found-page relative min-h-screen overflow-hidden bg-slate-50 px-6 py-12">
      {/* ==================== BACKGROUND DECORATION ==================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="not-found-orb not-found-orb-one absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="not-found-orb not-found-orb-two absolute -bottom-40 -right-32 h-120 w-120 rounded-full bg-teal-200/25 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-size:24px_24px" />
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          {/* ==================== ICON ==================== */}
          <div className="not-found-icon-animation mb-8 flex justify-center">
            <div className="not-found-icon-wrapper flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-200/70 bg-white shadow-xl shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/15">
              <div className="not-found-icon-inner flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                <Search className="h-6 w-6" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          {/* ==================== 404 NUMBER ==================== */}
          <div className="not-found-number-animation select-none">
            <h1 className="bg-linear-to-r from-slate-900 via-emerald-700 to-teal-600 bg-clip-text text-[clamp(7rem,22vw,12rem)] font-black leading-none tracking-[-0.08em] text-transparent drop-shadow-sm">
              404
            </h1>
          </div>

          {/* ==================== TITLE ==================== */}
          <div className="not-found-content-animation mt-4">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />

              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Page Not Found
              </span>

              <Sparkles className="h-4 w-4 text-teal-500" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Oops! This page wandered off.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
              The page you're looking for doesn't exist, may have been moved, or
              the URL might be incorrect.
            </p>
          </div>

          {/* ==================== ACTION BUTTONS ==================== */}
          <div className="not-found-actions-animation mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="not-found-primary-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0"
            >
              <Home className="not-found-button-icon h-4 w-4 transition-transform duration-300 group-hover:scale-110" />

              <span>Back to Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="not-found-secondary-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-900/10 active:translate-y-0"
            >
              <ArrowLeft className="not-found-button-icon h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />

              <span>Go Back</span>
            </button>
          </div>

          {/* ==================== BOTTOM BRANDING ==================== */}
          <div className="not-found-footer-animation mt-12">
            <div className="mx-auto flex max-w-xs items-center justify-center gap-3">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-emerald-200 to-transparent" />

              <span className="text-xs font-medium tracking-wide text-slate-400">
                AI Learning Assistant
              </span>

              <div className="h-px flex-1 bg-linear-to-r from-transparent via-teal-200 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ANIMATION STYLES ==================== */}
      <style>{`
        /* ==================== PAGE ENTRANCE ==================== */

        @keyframes notFoundPageEnter {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .not-found-page {
          animation: notFoundPageEnter 0.55s ease-out both;
        }


        /* ==================== ICON ENTRANCE ==================== */

        @keyframes notFoundIconEnter {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.88);
          }

          70% {
            opacity: 1;
            transform: translateY(-3px) scale(1.02);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .not-found-icon-animation {
          animation: notFoundIconEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1)
            0.08s both;
        }


        /* ==================== ICON INTERACTION ==================== */

        .not-found-icon-inner {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .not-found-icon-wrapper:hover .not-found-icon-inner {
          transform: rotate(-4deg) scale(1.06);
          box-shadow:
            0 8px 20px rgba(16, 185, 129, 0.2),
            0 0 25px rgba(20, 184, 166, 0.12);
        }


        /* ==================== 404 ENTRANCE ==================== */

        @keyframes notFoundNumberEnter {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.94);
            filter: blur(6px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .not-found-number-animation {
          animation: notFoundNumberEnter 0.75s cubic-bezier(0.22, 1, 0.36, 1)
            0.15s both;
        }


        /* ==================== CONTENT ENTRANCE ==================== */

        @keyframes notFoundContentEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .not-found-content-animation {
          animation: notFoundContentEnter 0.55s ease-out 0.35s both;
        }


        /* ==================== ACTION ENTRANCE ==================== */

        @keyframes notFoundActionsEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .not-found-actions-animation {
          animation: notFoundActionsEnter 0.55s ease-out 0.48s both;
        }


        /* ==================== BUTTON INTERACTION ==================== */

        .not-found-primary-button,
        .not-found-secondary-button {
          position: relative;
          overflow: hidden;
        }

        .not-found-primary-button::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.25),
            transparent
          );
          transition: left 0.55s ease;
        }

        .not-found-primary-button:hover::after {
          left: 140%;
        }

        .not-found-button-icon {
          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        .not-found-primary-button:hover .not-found-button-icon {
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.4));
        }


        /* ==================== FOOTER ENTRANCE ==================== */

        @keyframes notFoundFooterEnter {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .not-found-footer-animation {
          animation: notFoundFooterEnter 0.6s ease-out 0.65s both;
        }


        /* ==================== VERY SUBTLE BACKGROUND MOVEMENT ==================== */

        @keyframes notFoundOrbOne {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(12px, 10px, 0);
          }
        }

        @keyframes notFoundOrbTwo {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-10px, -8px, 0);
          }
        }

        .not-found-orb-one {
          animation: notFoundOrbOne 18s ease-in-out alternate infinite;
        }

        .not-found-orb-two {
          animation: notFoundOrbTwo 22s ease-in-out alternate infinite;
        }


        /* ==================== REDUCED MOTION ==================== */

        @media (prefers-reduced-motion: reduce) {
          .not-found-page,
          .not-found-icon-animation,
          .not-found-number-animation,
          .not-found-content-animation,
          .not-found-actions-animation,
          .not-found-footer-animation,
          .not-found-orb-one,
          .not-found-orb-two {
            animation: none !important;
          }

          .not-found-primary-button,
          .not-found-secondary-button,
          .not-found-icon-wrapper,
          .not-found-icon-inner,
          .not-found-button-icon {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
