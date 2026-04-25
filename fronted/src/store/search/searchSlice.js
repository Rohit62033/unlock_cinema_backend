import { createSlice } from '@reduxjs/toolkit'
import { fetchSearchResults, fetchTrendingSearches } from './searchThunk';


const initialState = {
  query: "",
  results: [],
  loading: false,
  isDrawerOpen: false,
  activeCategory: "",
  cache: {},
  error: null
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {

    setQuery: (state, action) => {
      state.query = action.payload;
    },

    openSearchDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeSearchDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    setResults: (state, action) => {
      state.results = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCategory: (state, action) => {
      state.activeCategory = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false
        const { data, query, fromCache } = action.payload;

        state.results = data;

        // Store in cache only if API call
        if (!fromCache && query) {
          state.cache[query] = data;
        }
      })

      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchTrendingSearches.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchTrendingSearches.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
      })

      .addCase(fetchTrendingSearches.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload

      })
  }


});

export const {
  closeSearchDrawer,
  openSearchDrawer,
  setQuery,
  clearQuery,
  setResults,
  setLoading,
  setCategory,
} = searchSlice.actions;

export default searchSlice.reducer;