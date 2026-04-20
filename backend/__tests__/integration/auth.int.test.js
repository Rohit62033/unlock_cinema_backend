import request from 'supertest'
import { jest } from '@jest/globals'
import { createuser, loginUser, registerAndVerify } from './utils/authHelper.js'
import { es } from 'zod/locales'

//  disable rate limiter
jest.unstable_mockModule('../../src/middlewares/rateLimitters/otpLimiter.js', () => ({
  otpLimiter: (req, res, next) => next()
}))

//  mock OTP
jest.unstable_mockModule('../../src/modules/auth/utils/genreateOtp.js', () => ({
  generateOtp: () => '123456'
}))

//  mock email sender (HIGH LEVEL)
jest.unstable_mockModule('../../src/modules/auth/utils/sendOtpEmail.js', () => ({
  sendOtpEmail: jest.fn().mockResolvedValue(true)
}))

//  mock actual email transport (LOW LEVEL) IMPORTANT
jest.unstable_mockModule('../../src/utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(true)
}))


const { default: app } = await import('../../app.js')
app

describe('post /register', () => {
  test('should fail validation', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({})

    expect(res.statusCode).toBe(400)
  })

  test('should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'jest',
        password: 'password',
        email: 'test1@example.com'
      })

    expect(res.statusCode).toBe(200)
  })
})

describe('post /verify-otp', () => {
  test('should create user after verifcation', async () => {
    const agent = request.agent(app)

    const user = {
      username: `username${Date.now()}`,
      password: 'password',
      email: `test_${Date.now()}@example.com`
    }

    await agent.post('/api/auth/register').send(user)


    const res = await agent.post('/api/auth/verify-otp').send({
      email: user.email,
      otp: '123456'
    })

    if (res.statusCode === 500) {
      console.error('VERIFY OTP 500 ERROR:', res.body || res.text);
    }

    expect(res.statusCode).toBe(201)
  })
})

test('should login user', async () => {
  const agent = request.agent(app)

  const user = createuser()
  await registerAndVerify(agent, user)

  console.log(user.email);


  const res = await agent.post('/api/auth/login').send({
    email: user.email,
    password: user.password
  })


  expect(res.body.success).toBe(true)
  expect(res.body).toHaveProperty('user')

})

describe('GET /api/auth/me (protect middleware)', () => {
  test('should block without auth ', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.statusCode).toBe(401)
  })

  test('should allow with auth', async () => {
    const agent = request.agent(app)

    const user = await createuser()
    await registerAndVerify(agent, user)
    await loginUser(agent, user)

    const res = await agent.get('/api/auth/me')


    console.log('ME RESPONSE:', res.statusCode)

    expect(res.body).toHaveProperty('user')
    expect(res.statusCode).toBe(200)
  })
})

describe('GET /api/auth/refresh-token', () => {
  test('should block without auth', async () => {
    const agent = request.agent(app)

    const res = await agent.post('/api/auth/refresh-token')

    expect(res.statusCode).toBe(401)
  })

  test('should rotate refresh token if auth already done', async () => {
    const agent = request.agent(app)

    const user = createuser()

    await registerAndVerify(agent, user)
    await loginUser(agent, user)

    const res = await agent.post('/api/auth/refresh-token')

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
  })
})