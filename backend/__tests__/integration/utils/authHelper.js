// tests/utils/authHelper.js

import request from 'supertest'
import { email } from 'zod'

export const registerAndVerify = async (agent, user) => {
  await agent.post('/api/auth/register').send(user)

  await agent.post('/api/auth/verify-otp').send({
    email: user.email,
    otp: '123456'
  })

}

export const loginUser = async (agent, user) => {
const loginRes =  await agent.post('/api/auth/login').send({
    email: user.email,
    password: user.password
  })

  
}

export const createuser = () => ({
  username: `user_${Date.now()}`,
  password: 'password',
  email: `email_${Date.now()}@gmail.com`
})