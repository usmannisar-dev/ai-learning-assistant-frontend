import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/useAuth.js";
import authService from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ============================================================
  // PASSWORD VISIBILITY STATE
  // ============================================================

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // ============================================================
  // LOGIN SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      const message = "Email and password are required";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await authService.login(email.trim(), password);

      const { token, user } = response;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      login(user, token);

      toast.success("Logged in successfully");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        "Failed to login. Please check your credentials.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ============================================================
          ANIMATION STYLES
      ============================================================ */}

      <style>{`
        /* ============================================================
           PAGE ENTRANCE
        ============================================================ */

        @keyframes loginPageEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ============================================================
           CARD ENTRANCE
        ============================================================ */

        @keyframes loginCardEnter {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.97);
            filter: blur(8px);
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

        /* ============================================================
           LOGO FLOAT
        ============================================================ */

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-5px) rotate(1deg);
          }
        }

        /* ============================================================
           LOGO GLOW
        ============================================================ */

        @keyframes logoGlow {
          0%,
          100% {
            box-shadow:
              0 8px 20px rgba(16, 185, 129, 0.20),
              0 0 20px rgba(16, 185, 129, 0.08);
          }

          50% {
            box-shadow:
              0 12px 28px rgba(16, 185, 129, 0.28),
              0 0 35px rgba(16, 185, 129, 0.16),
              0 0 55px rgba(5, 150, 105, 0.08);
          }
        }

        /* ============================================================
           BACKGROUND ORB ONE
        ============================================================ */

        @keyframes ambientOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(35px, -25px, 0) scale(1.08);
          }
        }

        /* ============================================================
           BACKGROUND ORB TWO
        ============================================================ */

        @keyframes ambientOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, 25px, 0) scale(1.10);
          }
        }

        /* ============================================================
           BACKGROUND ORB THREE
        ============================================================ */

        @keyframes ambientOrbThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(20px, 35px, 0);
          }
        }

        /* ============================================================
           HEADER STAGGER
        ============================================================ */

        @keyframes headerFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ============================================================
           INPUT ENTRANCE
        ============================================================ */

        @keyframes formItemEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ============================================================
           ERROR ENTRANCE
        ============================================================ */

        @keyframes errorEnter {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ============================================================
           BUTTON SHINE
        ============================================================ */

        @keyframes buttonShimmer {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(120%);
          }
        }

        /* ============================================================
           BUTTON PULSE
        ============================================================ */

        @keyframes buttonGlow {
          0%,
          100% {
            box-shadow:
              0 10px 25px rgba(16, 185, 129, 0.20),
              0 0 0 rgba(16, 185, 129, 0);
          }

          50% {
            box-shadow:
              0 12px 30px rgba(16, 185, 129, 0.28),
              0 0 28px rgba(16, 185, 129, 0.10);
          }
        }

        /* ============================================================
           FOOTER ENTRANCE
        ============================================================ */

        @keyframes footerEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ============================================================
           ICON ACTIVE PULSE
        ============================================================ */

        @keyframes iconActivePulse {
          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.12);
          }

          100% {
            transform: scale(1.06);
          }
        }

        /* ============================================================
           INPUT EMERALD GLOW
        ============================================================ */

        @keyframes inputEmeraldGlow {
          0%,
          100% {
            box-shadow:
              0 0 0 4px rgba(16, 185, 129, 0.08),
              0 8px 22px rgba(16, 185, 129, 0.04);
          }

          50% {
            box-shadow:
              0 0 0 4px rgba(16, 185, 129, 0.12),
              0 10px 28px rgba(16, 185, 129, 0.08);
          }
        }

        /* ============================================================
           EYE ICON POP
        ============================================================ */

        @keyframes eyePop {
          0% {
            opacity: 0.5;
            transform: scale(0.85);
          }

          70% {
            opacity: 1;
            transform: scale(1.12);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ============================================================
           APPLY ANIMATIONS
        ============================================================ */

        .login-page-animation {
          animation: loginPageEnter 0.7s ease-out both;
        }

        .login-card-animation {
          animation:
            loginCardEnter 0.85s cubic-bezier(0.22, 1, 0.36, 1)
            0.05s both;
        }

        .login-logo-animation {
          animation:
            logoFloat 4s ease-in-out infinite,
            logoGlow 3s ease-in-out infinite;
        }

        .login-header-animation {
          animation: headerFadeUp 0.65s ease-out 0.35s both;
        }

        .login-email-animation {
          animation: formItemEnter 0.55s ease-out 0.45s both;
        }

        .login-password-animation {
          animation: formItemEnter 0.55s ease-out 0.55s both;
        }

        .login-button-animation {
          animation:
            formItemEnter 0.55s ease-out 0.65s both,
            buttonGlow 3.5s ease-in-out 1.3s infinite;
        }

        .login-footer-animation {
          animation: footerEnter 0.55s ease-out 0.8s both;
        }

        .login-error-animation {
          animation: errorEnter 0.3s ease-out both;
        }

        .login-orb-one {
          animation: ambientOrbOne 8s ease-in-out infinite;
        }

        .login-orb-two {
          animation: ambientOrbTwo 10s ease-in-out infinite;
        }

        .login-orb-three {
          animation: ambientOrbThree 7s ease-in-out infinite;
        }

        /* ============================================================
           CARD HOVER
        ============================================================ */

        .login-card-hover {
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.45s ease,
            border-color 0.35s ease;
        }

        .login-card-hover:hover {
          transform: translateY(-4px);

          box-shadow:
            0 25px 60px rgba(15, 23, 42, 0.10),
            0 0 45px rgba(16, 185, 129, 0.06);

          border-color: rgba(16, 185, 129, 0.20);
        }

        /* ============================================================
           INPUT BASE ANIMATION
        ============================================================ */

        .login-input {
          transition:
            border-color 0.25s ease,
            background-color 0.25s ease,
            box-shadow 0.3s ease,
            transform 0.25s ease;
        }

        .login-input:hover:not(:disabled) {
          border-color: rgba(16, 185, 129, 0.35);

          box-shadow:
            0 4px 15px rgba(16, 185, 129, 0.05);
        }

        .login-input:focus {
          transform: translateY(-1px);

          animation: inputEmeraldGlow 2.4s ease-in-out infinite;

          outline: none;
        }

        /* ============================================================
           ICON BASE
        ============================================================ */

        .login-icon {
          transition:
            transform 0.3s ease,
            color 0.25s ease,
            filter 0.3s ease;
        }

        /* ============================================================
           ACTIVE ICON
        ============================================================ */

        .login-icon-active {
          animation: iconActivePulse 0.35s ease-out both;

          transform: scale(1.06);

          filter:
            drop-shadow(0 0 5px rgba(16, 185, 129, 0.30))
            drop-shadow(0 0 10px rgba(16, 185, 129, 0.12));
        }

        /* ============================================================
           ICON HOVER
        ============================================================ */

        .login-icon-container {
          transition:
            transform 0.3s ease,
            color 0.25s ease;
        }

        .login-icon-container:hover {
          transform: translateX(1px);
        }

        /* ============================================================
           PASSWORD INPUT
        ============================================================ */

        .login-password-input {
  letter-spacing: 0.12em;
  font-size: 14px;
  font-weight: 500;
}

/* MAKE VISIBLE PASSWORD TEXT EXACTLY LIKE EMAIL TEXT */
.login-password-input[type="text"] {
  letter-spacing: normal;
  font-size: 14px;
  font-weight: 500;
  text-shadow: none;
}

/* KEEP PASSWORD DOTS SLIGHTLY SPACED WITHOUT MAKING THEM HUGE */
.login-password-input[type="password"] {
  letter-spacing: 0.12em;
  font-size: 14px;
  font-weight: 500;
}

        /* ============================================================
           EYE BUTTON
        ============================================================ */

        .login-eye-button {
          transition:
            color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.3s ease;
        }

        .login-eye-button:hover:not(:disabled) {
          color: rgb(16, 185, 129);

          background-color: rgba(16, 185, 129, 0.08);

          transform: scale(1.08);

          box-shadow:
            0 0 15px rgba(16, 185, 129, 0.10);
        }

        .login-eye-button:active:not(:disabled) {
          transform: scale(0.92);
        }

        .login-eye-icon {
          animation: eyePop 0.25s ease-out both;

          transition:
            transform 0.25s ease,
            filter 0.25s ease;
        }

        .login-eye-button:hover .login-eye-icon {
          transform: scale(1.08);

          filter:
            drop-shadow(0 0 5px rgba(16, 185, 129, 0.35));
        }

        /* ============================================================
           LOGO HOVER
        ============================================================ */

        .login-logo-wrapper {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .login-logo-wrapper:hover {
          transform: translateY(-4px) scale(1.04);

          box-shadow:
            0 15px 35px rgba(16, 185, 129, 0.30),
            0 0 45px rgba(16, 185, 129, 0.14);
        }

        /* ============================================================
           BUTTON HOVER
        ============================================================ */

        .login-button {
          transition:
            transform 0.25s ease,
            box-shadow 0.3s ease,
            filter 0.3s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);

          filter: brightness(1.03);

          box-shadow:
            0 14px 30px rgba(16, 185, 129, 0.28),
            0 0 35px rgba(16, 185, 129, 0.12);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        /* ============================================================
           SHIMMER
        ============================================================ */

        .login-shimmer {
          animation: buttonShimmer 2.8s ease-in-out infinite;
        }

        /* ============================================================
           SIGN UP LINK
        ============================================================ */

        .login-signup-link {
          position: relative;

          transition:
            color 0.25s ease,
            text-shadow 0.25s ease;
        }

        .login-signup-link::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -2px;

          width: 100%;
          height: 1px;

          background: currentColor;

          transform: scaleX(0);
          transform-origin: right;

          transition: transform 0.3s ease;
        }

        .login-signup-link:hover {
          text-shadow:
            0 0 12px rgba(16, 185, 129, 0.25);
        }

        .login-signup-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* ============================================================
           REDUCED MOTION ACCESSIBILITY
        ============================================================ */

        @media (prefers-reduced-motion: reduce) {
          .login-page-animation,
          .login-card-animation,
          .login-logo-animation,
          .login-header-animation,
          .login-email-animation,
          .login-password-animation,
          .login-button-animation,
          .login-footer-animation,
          .login-error-animation,
          .login-orb-one,
          .login-orb-two,
          .login-orb-three,
          .login-shimmer,
          .login-icon-active,
          .login-eye-icon,
          .login-password-input,
          .login-input {
            animation: none !important;
          }

          .login-card-hover,
          .login-input,
          .login-button,
          .login-logo-wrapper,
          .login-signup-link,
          .login-eye-button {
            transition: none !important;
          }
        }
      `}</style>

      {/* ============================================================
          MAIN PAGE
      ============================================================ */}

      <div className="login-page-animation relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-50">
        {/* ============================================================
            BACKGROUND PATTERN
        ============================================================ */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size:16px_16px opacity-30" />

        {/* ============================================================
            EMERALD AMBIENT ORBS
        ============================================================ */}

        <div
          className="login-orb-one pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="login-orb-two pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="login-orb-three pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/5 blur-3xl"
          aria-hidden="true"
        />

        {/* ============================================================
            LOGIN CONTAINER
        ============================================================ */}

        <div className="relative z-10 w-full max-w-md px-6">
          {/* ============================================================
              LOGIN CARD
          ============================================================ */}

          <div className="login-card-animation login-card-hover rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-10">
            {/* ========================================================
                HEADER
            ======================================================== */}

            <div className="login-header-animation mb-10 text-center">
              {/* ======================================================
                  LOGO
              ====================================================== */}

              <div className="mb-6 inline-flex">
                <div className="login-logo-wrapper login-logo-animation inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
                  <BrainCircuit
                    className="h-7 w-7 text-white"
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* ======================================================
                  TITLE
              ====================================================== */}

              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back
              </h1>

              {/* ======================================================
                  DESCRIPTION
              ====================================================== */}

              <p className="text-sm text-slate-500">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* ========================================================
                FORM
            ======================================================== */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ======================================================
                  EMAIL
              ====================================================== */}

              <div className="login-email-animation space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Email
                </label>

                <div className="relative">
                  {/* ==================================================
                      EMAIL ICON
                  ================================================== */}

                  <div
                    className={`login-icon-container pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 ${
                      focusedField === "email"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    <Mail
                      className={`login-icon h-5 w-5 ${
                        focusedField === "email" ? "login-icon-active" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </div>

                  {/* ==================================================
                      EMAIL INPUT
                  ================================================== */}

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                    required
                    disabled={loading}
                    placeholder="you@example.com"
                    className="login-input h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* ======================================================
                  PASSWORD
              ====================================================== */}

              <div className="login-password-animation space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  {/* ==================================================
                      PASSWORD LOCK ICON
                  ================================================== */}

                  <div
                    className={`login-icon-container pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 ${
                      focusedField === "password"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    <Lock
                      className={`login-icon h-5 w-5 ${
                        focusedField === "password" ? "login-icon-active" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </div>

                  {/* ==================================================
                      PASSWORD INPUT
                  ================================================== */}

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    placeholder="Password"
                    className={`login-input login-password-input h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-12 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 ${
                      showPassword ? "tracking-normal" : ""
                    }`}
                  />

                  {/* ==================================================
                      PASSWORD EYE BUTTON
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="login-eye-button absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff
                        key="eye-off"
                        className="login-eye-icon h-5 w-5"
                        strokeWidth={2}
                      />
                    ) : (
                      <Eye
                        key="eye"
                        className="login-eye-icon h-5 w-5"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* ======================================================
                  ERROR MESSAGE
              ====================================================== */}

              {error && (
                <div
                  role="alert"
                  className="login-error-animation rounded-lg border border-red-200 bg-red-50 p-3"
                >
                  <p className="text-center text-xs font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* ======================================================
                  SUBMIT BUTTON
              ====================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="login-button-animation login-button group relative h-12 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                {/* ==================================================
                    BUTTON CONTENT
                ================================================== */}

                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </>
                  )}
                </span>

                {/* ==================================================
                    BUTTON SHIMMER
                ================================================== */}

                <span className="login-shimmer pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </form>

            {/* ========================================================
                FOOTER
            ======================================================== */}

            <div className="login-footer-animation mt-8 border-t border-slate-200/60 pt-6">
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="login-signup-link font-semibold text-emerald-600"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* ==========================================================
              BOTTOM FOOTER TEXT
          ========================================================== */}

          <p className="login-footer-animation mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
