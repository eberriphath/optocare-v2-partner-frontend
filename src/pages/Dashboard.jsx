import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/partner/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError(
          error.response?.data?.error ||
            "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-sm font-semibold text-red-800">
          Unable to load dashboard
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  const partner = dashboard?.partner;
  const statistics = dashboard?.statistics;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {dashboard?.user?.name || "Partner"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's an overview of your Optocare business.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Services */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Services
          </p>

          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {statistics?.total_services ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Services you've added
          </p>
        </div>

        {/* Active Services */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Services
          </p>

          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {statistics?.active_services ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Currently visible to customers
          </p>
        </div>

        {/* Total Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Products
          </p>

          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {statistics?.total_products ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Products you've added
          </p>
        </div>

        {/* Available Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Available Products
          </p>

          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {statistics?.available_products ?? 0}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Currently available to customers
          </p>
        </div>
      </div>

      {/* Business overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Business information */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Business Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your business information on Optocare.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Company Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {partner?.company_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Partner Type
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                {partner?.partner_type || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {partner?.location || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Specialty
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {partner?.specialty || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Account Status
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your current Optocare partner status.
          </p>

          <div className="mt-6">
            {partner?.is_verified ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                    <span className="text-green-700">
                      ✓
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Verified Partner
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      Your business has been verified by Optocare.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                    <span className="text-amber-700">
                      !
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Verification Pending
                    </p>

                    <p className="mt-1 text-xs text-amber-700">
                      Your account is awaiting verification.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Information associated with your partner account.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Name
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {dashboard?.user?.name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {dashboard?.user?.email || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;