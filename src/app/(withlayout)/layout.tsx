"use client";

import Header from "@/components/ui/Header";
import SideBar from "@/components/ui/Sidebar";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* sidebar  */}
      <SideBar></SideBar>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <Header></Header>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
