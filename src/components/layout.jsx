import React from "react";
import { Outlet } from "react-router-dom"; // Outlet is the placeholder for your pages
import Header from "./header";

const Layout = () => {
  return (
    <div>
      <Header />
      <main className="p-4 pt-25">
        <Outlet /> {/* Your pages will be rendered here */}
      </main>
      {/* You can add a <Footer /> component here later */}
    </div>
  );
};
export default Layout;
