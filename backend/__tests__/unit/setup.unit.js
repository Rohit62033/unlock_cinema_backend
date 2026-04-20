import { jest } from '@jest/globals'

import {
  mockUserRepository,
  mockTempUserRepository,
  mockSessionRepository,
  mockPasswordResetRepository
} from '../mocks/repositories.js'

import { errorFactory } from '../../src/errors/errorFactory.js'




/* ========= GLOBAL MODULE MOCKING ========= */

await jest.unstable_mockModule(
  '../../src/modules/users/repo/user.repo.js',
  () => ({ userRepository: mockUserRepository })
)


await jest.unstable_mockModule(
  '../../src/modules/users/repo/tempUser.repo.js',
  () => ({ tempUserRepository: mockTempUserRepository })
)



await jest.unstable_mockModule(
  '../../src/modules/auth/repo/session.repo.js',
  () => ({ sessionRepository: mockSessionRepository })
)


await jest.unstable_mockModule(
  '../../src/modules/users/repo/passwordReset.repo.js',
  () => ({ PasswordResetRepository: mockPasswordResetRepository })
)

/* ========= GLOBAL ERROR FACTORY ========= */

beforeEach(() => {
  jest.clearAllMocks()

  errorFactory.auth = {
    userNotFound: jest.fn(() => new Error('user not found')),
    invalidCredentials: jest.fn(() => new Error('invalid credentials')),
    otpInvalid: jest.fn(() => new Error('invalid otp')),
    otpExpired: jest.fn(() => new Error('otp expired')),
    otpAttemptsExceeded: jest.fn(() => new Error('attempts exceeded')),
    otpResendLimitExceeded: jest.fn(() => new Error('otp resend exceeded')),
    unauthorzied: jest.fn(() => new Error('unauthorized')),
    invalidOAuthState: jest.fn(() => new Error('Invalid OAuth state')),
    userAlreadyExists: jest.fn(() => new Error('user already exists'))
  }

  errorFactory.database = {
    passwordResetError: jest.fn(() => new Error('database error'))
  }
})