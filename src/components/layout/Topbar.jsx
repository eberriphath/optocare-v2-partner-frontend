import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user, logout } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "P";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">

      <div>

        <h2 className="text-lg font-semibold text-slate-900">
          Partner Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          Manage your Optocare business
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="hidden text-right sm:block">

          <p className="text-sm font-medium text-slate-900">
            {user?.name || "Partner"}
          </p>

          <p className="text-xs text-slate-500">
            Partner
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
          {initials}
        </div>

        <button
          type="button"
          onClick={logout}
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Topbar;