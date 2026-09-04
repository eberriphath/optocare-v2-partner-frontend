import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
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

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    if (!formData.new_password) {
      setError("Please enter a new password.");
      return;
    }

    if (formData.new_password.length < 8) {
      setError(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (!formData.confirm_password) {
      setError("Please confirm your new password.");
      return;
    }

    if (
      formData.new_password !==
      formData.confirm_password
    ) {
      setError("The new passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }
      );

      setSuccess(
        response.data?.message ||
          "Your password has been reset successfully."
      );

      setFormData({
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(
        "Failed to reset password:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to reset your password. The link may have expired or is no longer valid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Reset Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create a new password for your Optocare partner
              account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm leading-6 text-red-700">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm leading-6 text-green-700">
                {success}
              </p>
            </div>
          )}

          {/* Invalid token */}
          {!token ? (
            <div className="mt-6">
              <Link
                to="/forgot-password"
                className="block w-full rounded-lg bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Request a New Reset Link
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
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
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
            >
              ← Back to Partner Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;