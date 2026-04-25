import api from "@/config/axios"

export const loginAPI = async(credentials)=>{
  const response = await api.post('/api/auth/login',credentials)

  return response.data.user
}

export const registerAPI = async(credentials)=>{
  console.log(credentials);
  
  const response = await api.post('/api/auth/register',credentials)

  return response.data.user
}

export const fetchCurrentUserAPI = async()=>{
  const response = await api.get('/api/auth/me')

  return response.data.user
}

export const logoutAPI = async ()=>{
  const response = await api.post('/api/auth/logout')

  return response.data
}

export const verifyOtpAPI = async(email,otp)=>{
  const response = await api.post('/api/auth/verify-otp',{email,otp})
  return response.data.user
}

export const googleLoginAPI = async()=>{
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  
}