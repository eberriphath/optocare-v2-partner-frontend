import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Overview of your Optocare business",
    },
    "/services": {
      title: "Services",
      subtitle: "Manage the services offered by your business",
    },
    "/products": {
      title: "Products",
      subtitle: "Manage the products offered by your business",
    },
    "/profile": {
      title: "My Profile",
      subtitle: "Manage your business information",
    },
    "/change-password": {
      title: "Change Password",
      subtitle: "Update your partner account password",
    },
  };

  const currentPage =
    pageTitles[location.pathname] || {
      title: "Partner Dashboard",
      subtitle: "Manage your Optocare business",
    };

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

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Open navigation menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              {currentPage.title}
            </h1>

            <p className="hidden truncate text-sm text-slate-500 sm:block">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="max-w-48 truncate text-sm font-semibold text-slate-900">
              {user?.name || "Partner"}
            </p>

            <p className="text-xs text-slate-400">
              Partner account
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {getInitials()}
          </div>

          <button
            type="button"
            onClick={logout}
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;