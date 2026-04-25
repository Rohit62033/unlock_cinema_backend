import React from "react";

import LocationSelector from "./LocationSelector";
import UserMenu from "./UserMenu";
import MobileMenuButton from "./MobileMenuButton";
import SearchBar from "./SearchBar";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSearchDrawer } from "@/store/search/searchSlice";

const Topbar = () => {

  const dispatch = useDispatch()
  return (
    <div className="flex flex-col w-full py-3 gap-4 px-3 md:px-6 lg:px-8   ">
      <div className="flex items-center justify-between gap-8 w-full mx-auto  max-w-7xl ">

        {/* Left */}
        <div className="flex  items-center gap-8 flex-1">
          <a className="md:text-xl whitespace-nowrap font-black tracking-tighter text-[#DC3548] uppercase">
            unlock cinema
          </a>
          <SearchBar />
        </div>

        {/* Right */}
        <div className="flex items-center  gap-6">
          <button className="md:hidden"
         onClick={() => dispatch(openSearchDrawer())}
          >
            <Search className="text-slate-400 w-4 h-4" />
          </button>
          <LocationSelector />
          <UserMenu />
          <MobileMenuButton />
        </div>

      </div>
    </div>
  );
};

export default Topbar;