import { jest } from '@jest/globals'

export const mockUserRepository = {
  findUserByEmail: jest.fn(),
  findByEmailWithPassword: jest.fn(),
  findUserById: jest.fn(),
  findUserByIdWithPassword: jest.fn(),
  createUser: jest.fn(),
  saveUser: jest.fn(),
  getUserBooking: jest.fn(),
  findUserAndUpdate: jest.fn()
}

export const mockTempUserRepository = {
  findTempUserByEmail: jest.fn(),
  createTempUser: jest.fn(),
  saveTempUser: jest.fn(),
  deleteTempUser: jest.fn(),
  findTempUserAndUpdate: jest.fn()
}

export const mockSessionRepository = {
  createSession: jest.fn(),
  findSessionByRefreshToken: jest.fn(),
  invalidate: jest.fn(),
  invalidateAll: jest.fn()
}

export const mockPasswordResetRepository = {
  createPasswordResetUser: jest.fn(),
  savePasswordReset: jest.fn(),
  findPasswordResetByEmail: jest.fn(),
  deletePasswordResetByEmail: jest.fn()
}