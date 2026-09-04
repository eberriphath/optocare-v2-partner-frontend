import { useEffect, useState } from "react";
import api from "../api/api";

function ServicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M12 3 4 7.5 12 12l8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-5" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4.5 7.5 7.5 4 7.5-4" />
      <path d="M12 12v9" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/partner/dashboard"
        );

        setDashboard(response.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );

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
      <div className="space-y-8">
        <div>
          <div className="h-7 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-sm font-semibold text-red-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const partner = dashboard?.partner;
  const statistics = dashboard?.statistics;
  const user = dashboard?.user;

  const getInitials = () => {
    if (!user?.name) {
      return "P";
    }

    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const statisticCards = [
    {
      title: "Total Services",
      value: statistics?.total_services ?? 0,
      description: "Services you've added",
      icon: ServicesIcon,
    },
    {
      title: "Active Services",
      value: statistics?.active_services ?? 0,
      description: "Currently visible to customers",
      icon: CheckCircleIcon,
    },
    {
      title: "Total Products",
      value: statistics?.total_products ?? 0,
      description: "Products you've added",
      icon: ProductsIcon,
    },
    {
      title: "Available Products",
      value: statistics?.available_products ?? 0,
      description: "Currently available to customers",
      icon: EyeIcon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Partner overview
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user?.name || "Partner"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Here's an overview of your business activity
              on Optocare.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {getInitials()}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {partner?.company_name || "Your Business"}
              </p>

              <p className="text-xs text-slate-400">
                {partner?.partner_type || "Partner"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statisticCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                      {card.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                    <Icon />
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Business + Verification */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Business overview */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <UserIcon />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Business Overview
                </h2>

                <p className="mt-0.5 text-sm text-slate-500">
                  Your business information on Optocare.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Company Name
              </p>

              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {partner?.company_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Partner Type
              </p>

              <p className="mt-1.5 text-sm font-semibold capitalize text-slate-900">
                {partner?.partner_type || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Location
              </p>

              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {partner?.location || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Specialty
              </p>

              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {partner?.specialty || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Account Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your current verification status.
            </p>
          </div>

          <div className="p-6">
            {partner?.is_verified ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <CheckCircleIcon />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-green-800">
                  Verified Partner
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-green-700">
                  Your business has been verified by
                  Optocare and can appear as a verified
                  partner.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <span className="text-lg font-semibold">
                    !
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-semibold text-amber-800">
                  Verification Pending
                </h3>

                <p className="mt-1.5 text-sm leading-6 text-amber-700">
                  Your account is currently awaiting
                  verification by Optocare.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Account information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Information associated with your Optocare
            partner account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account Name
            </p>

            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {user?.name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </p>

            <p className="mt-1.5 break-all text-sm font-semibold text-slate-900">
              {user?.email || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Account Type
            </p>

            <p className="mt-1.5 text-sm font-semibold capitalize text-slate-900">
              {user?.role || "Partner"}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Verification
            </p>

            <div className="mt-1.5">
              {partner?.is_verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;