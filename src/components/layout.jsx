import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-16 px-4 ">
        {/* mt-16 = header height (64px) */}
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
