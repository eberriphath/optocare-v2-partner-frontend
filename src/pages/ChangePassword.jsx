import { useState } from "react";
import api from "../api/api";

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const togglePassword = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.current_password) {
      setError("Please enter your current password.");
      return;
    }

    if (!formData.new_password) {
      setError("Please enter a new password.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("The new passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await api.patch("/partner/password", {
        current_password: formData.current_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setSuccess(
        "Your password has been changed successfully."
      );
    } catch (error) {
      console.error("Failed to change password:", error);

      setError(
        error.response?.data?.error ||
          "Unable to change your password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Change Password
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the password you use to access your partner account.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Update Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose a password that you don't use on another account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* Current password */}
          <div>
            <label
              htmlFor="current_password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Current Password
            </label>

            <div className="relative">
              <input
                id="current_password"
                name="current_password"
                type={
                  showPasswords.current
                    ? "text"
                    : "password"
                }
                value={formData.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("current")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={
                  showPasswords.current
                    ? "Hide current password"
                    : "Show current password"
                }
              >
                {showPasswords.current ? "◉" : "○"}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label
              htmlFor="new_password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="new_password"
                name="new_password"
                type={
                  showPasswords.new
                    ? "text"
                    : "password"
                }
                value={formData.new_password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("new")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={
                  showPasswords.new
                    ? "Hide new password"
                    : "Show new password"
                }
              >
                {showPasswords.new ? "◉" : "○"}
              </button>
            </div>

            <p className="mt-1.5 text-xs text-slate-400">
              Password must be at least 8 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirm_password"
                name="confirm_password"
                type={
                  showPasswords.confirm
                    ? "text"
                    : "password"
                }
                value={formData.confirm_password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 pr-12 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword("confirm")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label={
                  showPasswords.confirm
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
              >
                {showPasswords.confirm ? "◉" : "○"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;