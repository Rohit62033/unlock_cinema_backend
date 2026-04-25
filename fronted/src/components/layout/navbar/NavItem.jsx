import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavItem = ({ label, badge, small, path }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === path;

  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-1 transition-colors w-full md:w-auto py-2 md:py-0 whitespace-nowrap
        ${isActive ? "text-[#DC3548] font-bold border-b-2 border-[#DC3548] pb-1" : ""}
        ${!isActive ? "text-slate-600 hover:text-[#DC3548]" : ""}
        ${small ? "text-[11px]" : "text-sm"}
      `}
    >
      <span>{label}</span>

      {badge && (
        <span className="bg-red-500 text-[8px] text-white px-1 rounded uppercase font-black">
          {badge}
        </span>
      )}
    </button>
  );
};

export default NavItem;