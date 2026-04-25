import React from "react";

import NavLinks from "./NavLinks";
import Topbar from "./Topbar";

const Navbar = () => {
  return (
    <header className="backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] text-sm font-medium w-full max-w-8xl ">

      <Topbar />

      {/* <div className="bg-slate-100 h-[1px] opacity-10">
        
      </div> */}

      <NavLinks />

    </header>
  );
};

export default Navbar;