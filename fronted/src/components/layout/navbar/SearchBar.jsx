import React from "react";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSearchDrawer } from "@/store/search/searchSlice.js";

const SearchBar = () => {

  const dispatch = useDispatch();


  return (

    <div
      onClick={() => dispatch(openSearchDrawer())}
      className="hidden md:flex items-center gap-1 cursor-pointer w-full max-w-xl border rounded px-4 py-2 text-slate-400 f"
    >
      <Search className="text-slate-400 w-4 h-4" />
      <span>Search for Movies, Events, Plays, Sports and Activities</span>
    </div>

  );
};

export default SearchBar; 
