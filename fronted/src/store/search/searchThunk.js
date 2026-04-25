import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/config/axios'

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (query, { getState, signal, rejectWithValue }) => {
    try {

      const { search } = getState()

      if (search.cache[query]) {
        return {
          data: search.cache[query],
          fromCache: true
        }
      }

      const res = await api.get(`/api/movie/search?q=${query}`, { signal })

      return {
        data: res.data,
        query, fromCache: false
      }
    } catch (error) {
      if (error.code === "ERR_CANCELED") console.log('request aborted')
      return rejectWithValue(error.response?.data || 'Error')
    }
  }
)

export const fetchTrendingSearches = createAsyncThunk(
  "search/trendingSearch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/movie/trending-search')
      console.log(res.data);
      return res.data.trendingSearch

    } catch (error) {
      return rejectWithValue(error.res?.data || "Error while fetching trending search")
    }
  }
)