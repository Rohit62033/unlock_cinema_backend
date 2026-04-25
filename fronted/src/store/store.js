import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./search/searchSlice";
import authReducer from './auth/authSlice.js'
import uiReducer from './uiSlice.js'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    ui: uiReducer
  }
});