import React, { useState } from "react";
import {
  User,
  Lock,
  Palette,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { auth } from "../api/firebase/config";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? "S");

  const handleProfileSave = async () => {
    if (!user) return;
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      await updateProfile(user, { displayName: displayName.trim() || null });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to update profile",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update password";
      setPasswordError(
        msg.includes("wrong-password") || msg.includes("invalid-credential")
          ? "Current password is incorrect."
          : msg,
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user.email) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        deletePassword,
      );
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      navigate("/login");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete account";
      setDeleteError(
        msg.includes("wrong-password") || msg.includes("invalid-credential")
          ? "Password is incorrect."
          : msg,
      );
      setDeleting(false);
    }
  };

  const isEmailProvider = user?.providerData?.some(
    (p) => p.providerId === "password",
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">
          Account Settings
        </h2>
        <p className="text-muted-slate mt-1">
          Manage your profile, security, and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2 font-semibold text-surface-900 dark:text-white">
          <User className="w-5 h-5 text-brand-primary" />
          <span>Profile</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-xl flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-surface-900 dark:text-white truncate">
              {user?.displayName || "No name set"}
            </p>
            <p className="text-sm text-muted-slate truncate">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold block">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            className="input-field"
          />
          <p className="text-xs text-muted-slate">
            Your email address cannot be changed here.
          </p>
        </div>

        {profileError && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-xl">
            {profileError}
          </p>
        )}

        <button
          onClick={handleProfileSave}
          disabled={
            profileSaving ||
            displayName.trim() === (user?.displayName ?? "")
          }
          className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 disabled:hover:scale-100"
        >
          {profileSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : profileSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {profileSuccess ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Password Section */}
      {isEmailProvider && (
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 font-semibold text-surface-900 dark:text-white">
            <Lock className="w-5 h-5 text-brand-primary" />
            <span>Change Password</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-surface-900 dark:hover:text-white"
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold block">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-surface-900 dark:hover:text-white"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-surface-900 dark:hover:text-white"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 rounded-xl">
              {passwordError}
            </p>
          )}

          <button
            onClick={handlePasswordChange}
            disabled={
              passwordSaving ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword
            }
            className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50 disabled:hover:scale-100"
          >
            {passwordSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : passwordSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {passwordSuccess ? "Password Updated!" : "Update Password"}
          </button>
        </div>
      )}

      {/* Appearance Section */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-surface-900 dark:text-white">
          <Palette className="w-5 h-5 text-brand-primary" />
          <span>Appearance</span>
        </div>
        <p className="text-sm text-muted-slate">
          Toggle between dark and light mode using the{" "}
          <span className="font-semibold text-surface-900 dark:text-white">
            sun / moon button
          </span>{" "}
          in the top-right corner of the header bar. Your preference is saved
          automatically.
        </p>
      </div>

      {/* Danger Zone */}
      {isEmailProvider && (
        <div className="glass-card p-6 space-y-5 border border-red-200 dark:border-red-500/30">
          <div className="flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Danger Zone</span>
          </div>
          <p className="text-sm text-muted-slate">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 border border-red-300 dark:border-red-500/40 rounded-premium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-500/10 rounded-premium border border-red-200 dark:border-red-500/20">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Enter your password to confirm permanent deletion:
              </p>
              <div className="relative">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-surface-900 dark:hover:text-white"
                >
                  {showDeletePassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {deleteError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={!deletePassword || deleting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-premium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-muted-slate hover:text-surface-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
