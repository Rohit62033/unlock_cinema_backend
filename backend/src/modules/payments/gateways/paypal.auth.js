import axios from "axios";

export const getPaypalAccessToken = async () => {
  const response = await axios.post("https://api-m.sandbox.paypal.com/v1/oauth2/token",
    "grant_type=client_credentials", 
    {
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  },
)
return response.data.access_token
}