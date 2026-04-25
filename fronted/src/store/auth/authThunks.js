import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentUserAPI, googleLoginAPI, loginAPI, logoutAPI, registerAPI, verifyOtpAPI } from "./authAPI";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCurrentUserAPI()

      return response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
)

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginAPI({ email, password })
      return response
    } catch (error) {
      const message = error.response?.data?.error?.message || "login falied"
      console.log(message);

      return rejectWithValue(message);
    }
  }
)
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await registerAPI(credentials)
      return response
    } catch (error) {
      const message = error.response?.data?.error?.message || "Registration falied"

      return rejectWithValue(message);
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutAPI()
      return response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
)

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await verifyOtpAPI(email, otp)
      return response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }

)

export const googleLoginUser = createAsyncThunk(
  'auth/googleLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await googleLoginAPI()
      return response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
)