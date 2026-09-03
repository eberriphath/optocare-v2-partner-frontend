import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function PartnerLayout() {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <div className="lg:pl-64">

        <Topbar />

        <main className="p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default PartnerLayout;