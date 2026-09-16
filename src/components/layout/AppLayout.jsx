import { useState } from "react";

import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-neutral-900">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden p-6">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
