import { PaypalProvider } from "../gateways/paypal.provider.js";
import { RazorpayProvider } from "../gateways/razorpay.provider.js";

const providers = {
  RAZORPAY: new RazorpayProvider(),
  PAYPAL: new PaypalProvider()
}

export const getProvider = (gateway) => {
  const provider = providers[gateway]

  if (!provider) {
    throw new Error("Unsupported payment gateway")
  }

  return provider
}