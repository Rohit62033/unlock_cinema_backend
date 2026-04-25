import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar.jsx";
import Footer from "./Footer.jsx";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-dvh">

      {/* Top Navigation */}
      

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        <Outlet />
      </main>
 
      {/* Footer */}
      <Footer />

    </div>
  );
};

export default MainLayout;