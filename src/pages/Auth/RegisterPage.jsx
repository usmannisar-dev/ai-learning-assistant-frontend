import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  ArrowRight,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import authService from "../../services/authService.js";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // REMOVE PREVIOUS ERROR
    setError("");

    // 1. REQUIRED FIELDS VALIDATION
    if (!username.trim() || !email.trim() || !password.trim()) {
      const message = "Username, email, and password are required.";

      setError(message);
      toast.error(message);
      return;
    }

    // 2. PASSWORD VALIDATION
    if (password.length < 6) {
      const message = "Password must be at least 6 characters long.";

      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const response = await authService.register(
        username.trim(),
        email.trim(),
        password,
      );

      console.log("REGISTER RESPONSE:", response);

      toast.success("Registered successfully! Please login.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const message =
        error?.message ||
        error?.error ||
        "Failed to register. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* =========================================
           REGISTER PAGE ANIMATIONS
        ========================================= */

        @keyframes registerPageEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerCardEnter {
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

        @keyframes registerLogoFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-5px) rotate(1deg);
          }
        }

        @keyframes registerLogoGlow {
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

        @keyframes registerOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(35px, -25px, 0) scale(1.08);
          }
        }

        @keyframes registerOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, 25px, 0) scale(1.10);
          }
        }

        @keyframes registerOrbThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(20px, 35px, 0);
          }
        }

        @keyframes registerHeaderEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerUsernameEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerEmailEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerPasswordEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerHelperEnter {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerErrorEnter {
          0% {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes registerButtonEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerButtonGlow {
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

        @keyframes registerShimmer {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(120%);
          }
        }

        @keyframes registerFooterEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes registerIconPulse {
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

        @keyframes registerInputGlow {
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

        @keyframes registerEyePop {
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

        /* =========================================
           PAGE / CARD ANIMATION
        ========================================= */

        .register-page-animation {
          animation: registerPageEnter 0.7s ease-out both;
        }

        .register-card-animation {
          animation:
            registerCardEnter
            0.85s
            cubic-bezier(0.22, 1, 0.36, 1)
            0.05s
            both;
        }

        .register-header-animation {
          animation: registerHeaderEnter 0.65s ease-out 0.35s both;
        }

        .register-username-animation {
          animation: registerUsernameEnter 0.55s ease-out 0.45s both;
        }

        .register-email-animation {
          animation: registerEmailEnter 0.55s ease-out 0.55s both;
        }

        .register-password-animation {
          animation: registerPasswordEnter 0.55s ease-out 0.65s both;
        }

        .register-helper-animation {
          animation: registerHelperEnter 0.45s ease-out 0.72s both;
        }

        .register-error-animation {
          animation: registerErrorEnter 0.3s ease-out both;
        }

        .register-button-animation {
          animation:
            registerButtonEnter 0.55s ease-out 0.78s both,
            registerButtonGlow 3.5s ease-in-out 1.4s infinite;
        }

        .register-footer-animation {
          animation: registerFooterEnter 0.55s ease-out 0.95s both;
        }

        /* =========================================
           AMBIENT BACKGROUND
        ========================================= */

        .register-orb-one {
          animation: registerOrbOne 8s ease-in-out infinite;
        }

        .register-orb-two {
          animation: registerOrbTwo 10s ease-in-out infinite;
        }

        .register-orb-three {
          animation: registerOrbThree 7s ease-in-out infinite;
        }

        /* =========================================
           CARD HOVER
        ========================================= */

        .register-card-hover {
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.45s ease,
            border-color 0.35s ease;
        }

        .register-card-hover:hover {
          transform: translateY(-4px);

          box-shadow:
            0 25px 60px rgba(15, 23, 42, 0.10),
            0 0 45px rgba(16, 185, 129, 0.06);

          border-color: rgba(16, 185, 129, 0.20);
        }

        /* =========================================
           LOGO
        ========================================= */

        .register-logo-animation {
          animation:
            registerLogoFloat 4s ease-in-out infinite,
            registerLogoGlow 3s ease-in-out infinite;
        }

        .register-logo-wrapper {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .register-logo-wrapper:hover {
          transform: translateY(-4px) scale(1.04);

          box-shadow:
            0 15px 35px rgba(16, 185, 129, 0.30),
            0 0 45px rgba(16, 185, 129, 0.14);
        }

        /* =========================================
           INPUTS
        ========================================= */

        .register-input {
          transition:
            border-color 0.25s ease,
            background-color 0.25s ease,
            box-shadow 0.3s ease,
            transform 0.25s ease;
        }

        .register-input:hover:not(:disabled) {
          border-color: rgba(16, 185, 129, 0.35);

          box-shadow:
            0 4px 15px rgba(16, 185, 129, 0.05);
        }

        .register-input:focus {
          transform: translateY(-1px);

          animation:
            registerInputGlow
            2.4s
            ease-in-out
            infinite;

          outline: none;
        }

        /* =========================================
           INPUT ICONS
        ========================================= */

        .register-icon-container {
          transition:
            transform 0.3s ease,
            color 0.25s ease;
        }

        .register-icon-container:hover {
          transform: translateX(1px);
        }

        .register-icon {
          transition:
            transform 0.3s ease,
            color 0.25s ease,
            filter 0.3s ease;
        }

        .register-icon-active {
          animation: registerIconPulse 0.35s ease-out both;

          transform: scale(1.06);

          filter:
            drop-shadow(0 0 5px rgba(16, 185, 129, 0.30))
            drop-shadow(0 0 10px rgba(16, 185, 129, 0.12));
        }

        /* =========================================
           PASSWORD
        ========================================= */

        .register-password-input {
          letter-spacing: 0.12em;
          font-size: 14px;
          font-weight: 500;
        }

        /* VISIBLE PASSWORD MATCHES EMAIL SIZE */
        .register-password-input[type="text"] {
          letter-spacing: normal;
          font-size: 14px;
          font-weight: 500;
          text-shadow: none;
        }

        /* PASSWORD DOTS */
        .register-password-input[type="password"] {
          letter-spacing: 0.12em;
          font-size: 14px;
          font-weight: 500;
        }

        /* =========================================
           PASSWORD EYE BUTTON
        ========================================= */

        .register-eye-button {
          transition:
            color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.3s ease;
        }

        .register-eye-button:hover:not(:disabled) {
          color: rgb(16, 185, 129);

          background-color: rgba(16, 185, 129, 0.08);

          transform: scale(1.08);

          box-shadow:
            0 0 15px rgba(16, 185, 129, 0.10);
        }

        .register-eye-button:active:not(:disabled) {
          transform: scale(0.92);
        }

        .register-eye-button:focus-visible {
          outline: none;

          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.16);
        }

        .register-eye-icon {
          animation: registerEyePop 0.25s ease-out both;

          transition:
            transform 0.25s ease,
            filter 0.25s ease;
        }

        .register-eye-button:hover .register-eye-icon {
          transform: scale(1.08);

          filter:
            drop-shadow(0 0 5px rgba(16, 185, 129, 0.35));
        }

        /* =========================================
           BUTTON
        ========================================= */

        .register-button {
          transition:
            transform 0.25s ease,
            box-shadow 0.3s ease,
            filter 0.3s ease;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);

          filter: brightness(1.03);

          box-shadow:
            0 14px 30px rgba(16, 185, 129, 0.28),
            0 0 35px rgba(16, 185, 129, 0.12);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .register-shimmer {
          animation:
            registerShimmer
            2.8s
            ease-in-out
            infinite;
        }

        /* =========================================
           FOOTER LINK
        ========================================= */

        .register-signin-link {
          position: relative;

          transition:
            color 0.25s ease,
            text-shadow 0.25s ease;
        }

        .register-signin-link::after {
          content: "";

          position: absolute;

          left: 0;
          bottom: -2px;

          width: 100%;
          height: 1px;

          background: currentColor;

          transform: scaleX(0);
          transform-origin: right;

          transition:
            transform 0.3s ease;
        }

        .register-signin-link:hover {
          text-shadow:
            0 0 12px rgba(16, 185, 129, 0.25);
        }

        .register-signin-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        /* =========================================
           REDUCED MOTION ACCESSIBILITY
        ========================================= */

        @media (prefers-reduced-motion: reduce) {
          .register-page-animation,
          .register-card-animation,
          .register-header-animation,
          .register-username-animation,
          .register-email-animation,
          .register-password-animation,
          .register-helper-animation,
          .register-error-animation,
          .register-button-animation,
          .register-footer-animation,
          .register-orb-one,
          .register-orb-two,
          .register-orb-three,
          .register-logo-animation,
          .register-shimmer,
          .register-icon-active,
          .register-eye-icon,
          .register-input {
            animation: none !important;
          }

          .register-card-hover,
          .register-input,
          .register-button,
          .register-logo-wrapper,
          .register-signin-link,
          .register-icon-container,
          .register-icon,
          .register-eye-button {
            transition: none !important;
          }
        }
      `}</style>

      <div className="register-page-animation relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-50">
        {/* BACKGROUND PATTERN */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] background-size:16px_16px opacity-30" />

        {/* AMBIENT EMERALD ORB */}
        <div
          className="register-orb-one pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl"
          aria-hidden="true"
        />

        {/* AMBIENT TEAL ORB */}
        <div
          className="register-orb-two pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden="true"
        />

        {/* CENTER AMBIENT ORB */}
        <div
          className="register-orb-three pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/5 blur-3xl"
          aria-hidden="true"
        />

        {/* REGISTER CONTAINER */}
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="register-card-animation register-card-hover rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-10">
            {/* HEADER */}
            <div className="register-header-animation mb-10 text-center">
              <div className="mb-6 inline-flex">
                <div className="register-logo-wrapper register-logo-animation inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
                  <BrainCircuit
                    className="h-7 w-7 text-white"
                    strokeWidth={2}
                  />
                </div>
              </div>

              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
                Create an account
              </h1>

              <p className="text-sm text-slate-500">
                Start your AI-powered learning experience
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* USERNAME */}
              <div className="register-username-animation space-y-2">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Username
                </label>

                <div className="relative">
                  <div
                    className={`register-icon-container pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 ${
                      focusedField === "username"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    <User
                      className={`register-icon h-5 w-5 ${
                        focusedField === "username"
                          ? "register-icon-active"
                          : ""
                      }`}
                      strokeWidth={2}
                    />
                  </div>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    autoComplete="username"
                    placeholder="yourusername"
                    required
                    className="register-input h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="register-email-animation space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Email
                </label>

                <div className="relative">
                  <div
                    className={`register-icon-container pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 ${
                      focusedField === "email"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    <Mail
                      className={`register-icon h-5 w-5 ${
                        focusedField === "email" ? "register-icon-active" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </div>

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
                    disabled={loading}
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="register-input h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="register-password-animation space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <div
                    className={`register-icon-container pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4 ${
                      focusedField === "password"
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`}
                  >
                    <Lock
                      className={`register-icon h-5 w-5 ${
                        focusedField === "password"
                          ? "register-icon-active"
                          : ""
                      }`}
                      strokeWidth={2}
                    />
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    autoComplete="new-password"
                    placeholder="********"
                    required
                    className="register-input register-password-input h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {/* PASSWORD SHOW / HIDE BUTTON */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="register-eye-button absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff
                        key="eye-off"
                        className="register-eye-icon h-5 w-5"
                        strokeWidth={2}
                      />
                    ) : (
                      <Eye
                        key="eye"
                        className="register-eye-icon h-5 w-5"
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </div>

                <p className="register-helper-animation text-xs text-slate-400">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="register-error-animation rounded-lg border border-red-200 bg-red-50 p-3"
                >
                  <p className="text-center text-xs font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="register-button-animation register-button group relative h-12 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </>
                  )}
                </span>

                {/* BUTTON SHIMMER */}
                <span className="register-shimmer pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </form>

            {/* FOOTER */}
            <div className="register-footer-animation mt-8 border-t border-slate-200/60 pt-6">
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="register-signin-link font-semibold text-emerald-600"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* TERMS */}
            <p className="register-footer-animation mt-6 text-center text-xs text-slate-400">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
