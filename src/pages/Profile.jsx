import { useEffect, useState } from "react";
import api from "../api/api";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    specialty: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/partner/profile");

      const data = response.data.partner || response.data;

      setProfile(data);

      setFormData({
        location: data.location || "",
        specialty: data.specialty || "",
        description: data.description || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError(
        error.response?.data?.error ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        location: formData.location.trim(),
        specialty: formData.specialty.trim(),
        description: formData.description.trim(),
      };

      const response = await api.patch(
        "/partner/profile",
        payload
      );

      const updatedProfile =
        response.data.partner || response.data;

      setProfile(updatedProfile);

      setFormData({
        location: updatedProfile.location || "",
        specialty: updatedProfile.specialty || "",
        description: updatedProfile.description || "",
      });

      setSuccess(
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error.response?.data?.error ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-sm font-semibold text-red-800">
          Unable to load profile
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchProfile}
          className="mt-4 text-sm font-medium text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage the business information displayed on your Optocare profile.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* Business information */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Business Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Some information is controlled by Optocare administrators and cannot be changed here.
          </p>
        </div>

        <div className="space-y-6 p-6">
          {/* Company name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Company Name
            </label>

            <input
              type="text"
              value={profile?.company_name || ""}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Company name can only be changed by an Optocare administrator.
            </p>
          </div>

          {/* Partner type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Partner Type
            </label>

            <input
              type="text"
              value={profile?.partner_type || ""}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm capitalize text-slate-500"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Partner type is managed by Optocare.
            </p>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Nairobi, Kenya"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Specialty */}
          <div>
            <label
              htmlFor="specialty"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Specialty
            </label>

            <input
              id="specialty"
              name="specialty"
              type="text"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="e.g. Prescription Eyewear"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Business Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your business..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Verification */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Verification
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current verification status with Optocare.
          </p>
        </div>

        <div className="p-6">
          {profile?.is_verified ? (
            <div className="flex items-start gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                <span className="font-semibold text-green-700">
                  ✓
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Verified Partner
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Your business has been verified by Optocare.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <span className="font-semibold text-amber-700">
                  !
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Verification Pending
                </p>

                <p className="mt-1 text-sm text-amber-700">
                  Your business has not yet been verified by Optocare.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;