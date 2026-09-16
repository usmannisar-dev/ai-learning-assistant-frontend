import { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";

// ==========================================================
// PROFILE PAGE
// ==========================================================

const ProfilePage = () => {
  // ========================================================
  // STATE
  // ========================================================

  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ========================================================
  // PASSWORD VISIBILITY STATE
  // ========================================================

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // ========================================================
  // FETCH PROFILE
  // ========================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();

        console.log("=================================");
        console.log("PROFILE RESPONSE");
        console.log("=================================");
        console.log(response);
        console.log("response.data:", response?.data);

        // HANDLE DIFFERENT POSSIBLE API RESPONSE STRUCTURES

        const responseData = response?.data ?? response;

        const user = responseData?.user ?? responseData?.data ?? responseData;

        console.log("PROFILE USER:", user);

        setUsername(user?.username ?? "");
        setEmail(user?.email ?? "");
      } catch (error) {
        console.error("FETCH PROFILE ERROR:", error);

        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch profile data.";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ========================================================
  // CHANGE PASSWORD
  // ========================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!currentPassword.trim()) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (!confirmNewPassword.trim()) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    // ======================================================
    // CHANGE PASSWORD
    // ======================================================

    setPasswordLoading(true);

    try {
      console.log("Changing password...");

      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      console.log("CHANGE PASSWORD RESPONSE:", response);

      toast.success("Password changed successfully!");

      // CLEAR PASSWORD FIELDS

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      // RESET PASSWORD VISIBILITY

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    } catch (error) {
      console.error("=================================");
      console.error("CHANGE PASSWORD ERROR");
      console.error("=================================");
      console.error("Full error:", error);
      console.error("Response:", error?.response);
      console.error("Response data:", error?.response?.data);
      console.error("Message:", error?.message);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to change password.";

      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  // ========================================================
  // LOADING STATE
  // ========================================================

  if (loading) {
    return <Spinner />;
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="w-full profile-page-animation">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="profile-header-animation">
        <PageHeader title="Profile Settings" />
      </div>

      {/* ==================================================
          PROFILE CONTENT
      ================================================== */}

      <div className="w-full space-y-8">
        {/* ==================================================
            USER INFORMATION
        ================================================== */}

        <div className="w-full bg-white border border-neutral-200 rounded-lg p-6 profile-card-animation">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 profile-section-title">
            User Information
          </h3>

          <div className="space-y-4">
            {/* USERNAME */}

            <div className="profile-field-animation">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Username
              </label>

              <div className="relative profile-input-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 profile-icon-container">
                  <User className="h-4 w-4 text-neutral-400 profile-icon" />
                </div>

                <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 profile-display-field">
                  {username || "Not available"}
                </p>
              </div>
            </div>

            {/* EMAIL */}

            <div className="profile-field-animation">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Email Address
              </label>

              <div className="relative profile-input-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 profile-icon-container">
                  <Mail className="h-4 w-4 text-neutral-400 profile-icon" />
                </div>

                <p className="w-full h-9 pl-9 pr-3 pt-2 border border-neutral-200 rounded-lg bg-neutral-50 text-sm text-neutral-900 profile-display-field">
                  {email || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            CHANGE PASSWORD
        ================================================== */}

        <div className="w-full bg-white border border-neutral-200 rounded-lg p-6 profile-card-animation profile-password-card">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 profile-section-title">
            Change Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* CURRENT PASSWORD */}

            <div className="profile-field-animation">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Current Password
              </label>

              <div className="relative profile-input-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 profile-icon-container">
                  <Lock className="h-4 w-4 text-neutral-400 profile-icon" />
                </div>

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full h-9 pl-9 pr-11 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent profile-password-input"
                />

                {/* EYE BUTTON */}

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-[#00d492] transition-all duration-200 profile-eye-button"
                  aria-label={
                    showCurrentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 profile-eye-icon" />
                  ) : (
                    <Eye className="h-4 w-4 profile-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}

            <div className="profile-field-animation">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                New Password
              </label>

              <div className="relative profile-input-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 profile-icon-container">
                  <Lock className="h-4 w-4 text-neutral-400 profile-icon" />
                </div>

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full h-9 pl-9 pr-11 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent profile-password-input"
                />

                {/* EYE BUTTON */}

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-[#00d492] transition-all duration-200 profile-eye-button"
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 profile-eye-icon" />
                  ) : (
                    <Eye className="h-4 w-4 profile-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div className="profile-field-animation">
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Confirm New Password
              </label>

              <div className="relative profile-input-wrapper">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 profile-icon-container">
                  <Lock className="h-4 w-4 text-neutral-400 profile-icon" />
                </div>

                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full h-9 pl-9 pr-11 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent profile-password-input"
                />

                {/* EYE BUTTON */}

                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-[#00d492] transition-all duration-200 profile-eye-button"
                  aria-label={
                    showConfirmNewPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmNewPassword ? (
                    <EyeOff className="h-4 w-4 profile-eye-icon" />
                  ) : (
                    <Eye className="h-4 w-4 profile-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}

            <div className="flex justify-end profile-button-animation">
              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ==================================================
          PROFILE PAGE ANIMATIONS
      ================================================== */}

      <style>{`
        /* ==================================================
           PAGE ENTRANCE
        ================================================== */

        .profile-page-animation {
          animation: profilePageEnter 0.6s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes profilePageEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==================================================
           HEADER ENTRANCE
        ================================================== */

        .profile-header-animation {
          animation: profileHeaderEnter 0.65s
            cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;
        }

        @keyframes profileHeaderEnter {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==================================================
           CARD ENTRANCE
        ================================================== */

        .profile-card-animation {
          animation: profileCardEnter 0.65s
            cubic-bezier(0.22, 1, 0.36, 1) both;

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .profile-card-animation:nth-child(1) {
          animation-delay: 0.12s;
        }

        .profile-card-animation:nth-child(2) {
          animation-delay: 0.2s;
        }

        @keyframes profileCardEnter {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ==================================================
           CARD HOVER
        ================================================== */

        .profile-card-animation:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(15, 23, 42, 0.06),
            0 0 18px rgba(16, 185, 129, 0.05);
        }

        /* ==================================================
           SECTION TITLE
        ================================================== */

        .profile-section-title {
          transition:
            color 0.25s ease,
            transform 0.25s ease;
        }

        .profile-card-animation:hover .profile-section-title {
          color: rgb(5, 150, 105);
          transform: translateX(2px);
        }

        /* ==================================================
           FIELD ENTRANCE
        ================================================== */

        .profile-field-animation {
          animation: profileFieldEnter 0.55s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .profile-field-animation:nth-child(1) {
          animation-delay: 0.25s;
        }

        .profile-field-animation:nth-child(2) {
          animation-delay: 0.32s;
        }

        .profile-field-animation:nth-child(3) {
          animation-delay: 0.39s;
        }

        @keyframes profileFieldEnter {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ==================================================
           INPUT WRAPPER
        ================================================== */

        .profile-input-wrapper {
          transition: transform 0.2s ease;
        }

        .profile-input-wrapper:focus-within {
          transform: translateY(-1px);
        }

        /* ==================================================
           LEFT ICON
        ================================================== */

        .profile-icon {
          transition:
            color 0.25s ease,
            transform 0.25s ease,
            filter 0.25s ease;
        }

        .profile-input-wrapper:focus-within .profile-icon {
          color: rgb(16, 185, 129);
          transform: scale(1.08);
          filter: drop-shadow(
            0 0 5px rgba(16, 185, 129, 0.25)
          );
        }

        /* ==================================================
           DISPLAY FIELDS
        ================================================== */

        .profile-display-field {
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            background-color 0.25s ease;
        }

        .profile-display-field:hover {
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04),
            0 0 10px rgba(16, 185, 129, 0.04);
        }

        /* ==================================================
           PASSWORD INPUT
        ================================================== */

        .profile-password-input {
          letter-spacing: 0.12em;
          font-size: 14px;
          font-weight: 500;

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.2s ease;
        }

        .profile-password-input[type="text"] {
          letter-spacing: normal;
          font-size: 14px;
          font-weight: 500;
          text-shadow: none;
        }

        .profile-password-input[type="password"] {
          letter-spacing: 0.12em;
          font-size: 14px;
          font-weight: 500;
        }

        .profile-password-input:focus {
          transform: translateY(-1px);
          box-shadow:
            0 0 0 2px rgba(16, 185, 129, 0.12),
            0 5px 16px rgba(16, 185, 129, 0.06);
        }

        /* ==================================================
           EYE BUTTON
        ================================================== */

        .profile-eye-button {
          transition:
            color 0.25s ease,
            background-color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .profile-eye-button:hover {
          color: rgb(16, 185, 129);
          background-color: rgba(16, 185, 129, 0.07);
          transform: scale(1.05);
          box-shadow:
            0 0 12px rgba(16, 185, 129, 0.08);
        }

        .profile-eye-button:active {
          transform: scale(0.92);
        }

        .profile-eye-button:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.14);
        }

        /* ==================================================
           EYE ICON ANIMATION
        ================================================== */

        .profile-eye-icon {
          animation: profileEyePop 0.22s
            cubic-bezier(0.22, 1, 0.36, 1) both;

          transition:
            transform 0.2s ease,
            filter 0.2s ease;
        }

        .profile-eye-button:hover .profile-eye-icon {
          transform: scale(1.08);
          filter:
            drop-shadow(
              0 0 5px rgba(16, 185, 129, 0.3)
            );
        }

        @keyframes profileEyePop {
          from {
            opacity: 0;
            transform: scale(0.7);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* ==================================================
           BUTTON ENTRANCE
        ================================================== */

        .profile-button-animation {
          animation: profileButtonEnter 0.55s
            cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
        }

        @keyframes profileButtonEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ==================================================
           REDUCED MOTION
        ================================================== */

        @media (prefers-reduced-motion: reduce) {
          .profile-page-animation,
          .profile-header-animation,
          .profile-card-animation,
          .profile-field-animation,
          .profile-button-animation,
          .profile-eye-icon {
            animation: none !important;
            transition: none !important;
          }

          .profile-card-animation:hover,
          .profile-input-wrapper:focus-within,
          .profile-password-input:focus,
          .profile-eye-button:hover,
          .profile-eye-button:active {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
