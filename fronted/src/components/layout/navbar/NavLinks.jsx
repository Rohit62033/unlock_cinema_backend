import React from "react";
import NavItem from "./NavItem";

const NavLinks = () => {
  return (
    <div className="flex flex-col   py-2 px-3 md:px-6 lg:px-8  ">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <nav className="flex flex-row max-w-full items-center gap-6 overflow-x-auto no-scrollbar">
          <NavItem label="Movies" path="/movies" />
          <NavItem label="Stream" path="/stream" />
          <NavItem label="Events" path="/events" />
          <NavItem label="Plays" path="/plays" />
          <NavItem label="Sports" path="/sports" />
          <NavItem label="Activities" path="/activities" />
          <NavItem label="TATA IPL 2026" badge="New" path="/ipl" />
        </nav>

        <div className="hidden lg:flex items-center gap-5 text-[11px] text-slate-500">
          <NavItem label="ListYourShow" small />
          <NavItem label="Corporates" small />
          <NavItem label="Offers" small />
          <NavItem label="Gift Cards" small />
        </div>
      </div>
    </div>
  );
};

export default NavLinks;
