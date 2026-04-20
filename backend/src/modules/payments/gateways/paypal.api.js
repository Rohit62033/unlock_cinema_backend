// gateways/paypal.api.js

import axios from "axios";
import { getPaypalAccessToken } from "./paypal.auth.js";

export const createPaypalOrder = async (amount) => {
  const accessToken = await getPaypalAccessToken(); // 🔥 dynamic

  const response = await axios.post(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export const capturePaypalOrder = async (orderId) => {
  const accessToken = await getPaypalAccessToken();

  const response = await axios.post(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};