import crypto from 'crypto'

export const generateOAuthState = () => {
  return crypto.randomBytes(32).toString("hex")
}