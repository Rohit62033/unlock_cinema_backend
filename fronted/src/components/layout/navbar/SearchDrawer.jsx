import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSearchDrawer, setQuery, setCategory } from "@/store/search/searchSlice";
import { fetchSearchResults, fetchTrendingSearches } from "@/store/search/searchThunk";
import useDebounce from "@/hooks/useDebouce";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchDrawer = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const navigate = useNavigate()
  const { isDrawerOpen, query, results, loading, activeCategory,cache } = useSelector(
    (state) => state.search
  );

  const debouncedQuery = useDebounce(query, 500);

  const categories = [
    "Movies",
    "Stream",
    "Events",
    "Plays",
    "Sports",
    "Activities",
    "Venues",
    "Offers",
    "Others",
  ];

  useEffect(() => {
    if (isDrawerOpen) inputRef.current?.focus();
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    dispatch(fetchTrendingSearches())
  }, [isDrawerOpen, dispatch])


  //  Trigger API via thunk
  useEffect(() => {
    if (!isDrawerOpen) return;
    if (!debouncedQuery) return;
    dispatch(fetchSearchResults(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary-bg  z-50 w-full h-100vh max-w-8xl ">
      <div className=" relative flex flex-col items-center w-full mx-auto max-w-8xl  ">
        <div className="bg-white/99 flex items-center justify-center  w-full h-[12vh] max-w-8xl">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            type="text"
            placeholder="Search for Movies, Events, Plays, Sports and Activities"
            className="max-w-xl w-75 md:w-100 lg:w-125 bg-gray-100  border p-2 rounded-full py- px-6"
          />
          <button onClick={() => dispatch(closeSearchDrawer())}>
            <X className="absolute right-2 md:right-8 top-7 text-slate-500" />
          </button>
        </div>
        <div className="max-w-xl w-full bg-white py-2 rounded-b-lg px-5">
          <div className="flex  overflow-x-auto no-scrollbar space-x-2 ">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  dispatch(setCategory(c));
                  dispatch(setQuery(c)); // optional: prefill query
                }}
                className={`px-3 py-1.5 text-sm border rounded-full cursor-pointer transition
      ${activeCategory === c
                    ? "bg-primary text-white border-primary"
                    : "text-primary border-gray-200 hover:bg-gray-200"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 max-w-3xl w-full px-5  md:w-xl  overflow-y-auto h-[60vh] no-scrollbar ">
          <h2 className="font-semibold tracking-tight text-gray-600 mb-1">Trending search</h2>



          <div className=" bg-white rounded-2xl mt-2">

            {loading && <p>Loading...</p>}

            <div className="  ">

              {!loading && (
                results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      dispatch(closeSearchDrawer())
                      navigate(`/movie/${item.id}`)
                    }}
                    className="w-full text-gray-500 flex pl-8 py-3 border-b  hover:bg-gray-200 cursor-pointer">
                    {item.title}
                  </button>)

                )
              )}
            </div>
          </div>
        </div>
      </div>


    </div >
  );
};

export default SearchDrawer;
