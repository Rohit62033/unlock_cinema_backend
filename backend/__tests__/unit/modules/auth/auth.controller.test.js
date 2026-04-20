import { jest } from '@jest/globals'

/* ================= MOCK SETUP ================= */

const mockServices = {
  registerService: jest.fn(),
  loginService: jest.fn(),
  verifyOtpService: jest.fn(),
  refreshService: jest.fn(),
  otpResendService: jest.fn(),
  logoutService: jest.fn(),
  logoutAllService: jest.fn(),
  getMeService: jest.fn(),
  setPasswordService: jest.fn(),
  changePasswordService: jest.fn(),
  forgotPasswordService: jest.fn(),
  resetPasswordService: jest.fn(),
  googleCallbackService: jest.fn()
}

const mockCookies = {
  setAuthCookies: jest.fn(),
  clearAuthCookies: jest.fn()
}

const mockTokenService = {
  tokenService: {
    generateTokens: jest.fn()
  }
}

const mockPassport = {
  default: {
    authenticate: jest.fn()
  }
}

/* ============ APPLY MOCKS BEFORE IMPORT ============ */

await jest.unstable_mockModule(
  '../../../../src/modules/auth/auth.service.js',
  () => mockServices
)

await jest.unstable_mockModule(
  '../../../../src/modules/auth/utils/cookies.js',
  () => mockCookies
)
await jest.unstable_mockModule(
  '../../../../src/modules/auth/utils/TokenService.js',
  () => mockTokenService
)


await jest.unstable_mockModule('passport', () => mockPassport)

/* ================= IMPORT AFTER MOCK ================= */

const {
  register,
  login,
  verifyOtp,
  refreshToken,
  otpResend,
  logout,
  logoutAll,
  getMe,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback
} = await import('../../../../src/modules/auth/auth.controller.js')

import { HTTP_STATUS } from '../../../../src/constants/httpStatus.js'

/* ================= UTIL ================= */


beforeEach(() => {
  jest.clearAllMocks()
})

/* ================= TESTS ================= */


describe('register controller', () => {

  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should return sucess response', async () => {
    const req = {
      validatedBody: {
        username: 'user',
        email: 'test@example.com',
        password: "12345678"
      }
    }

    const res = mockResponse()
    const next = jest.fn()

    mockServices.registerService.mockResolvedValue()

    await register(req, res, next)

    expect(mockServices.registerService).toHaveBeenCalledWith(req.validatedBody)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP sent"
    })
  })

  test('should forward error to next()', async () => {
    const req = { validatedBody: {} }
    const res = mockResponse()
    const next = jest.fn()

    const error = new Error('fail')

    mockServices.registerService.mockRejectedValue(error)

    await register(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})

describe('login controller', () => {
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }
  const next = jest.fn()


  test('should login successfully and return user data', async () => {
    const req = {
      validatedBody: {
        email: "test@example.user",
        password: "12345678"
      }
    }

    const res = mockResponse()
    const mockData = {
      user: {
        username: "rohit",
        email: 'test@example.user',
        _id: '12',
        role: 'user',
        avatar: 'avatar.png',
      },
      accessToken: "access-token",
      refreshToken: 'refresh-token'
    }

    mockServices.loginService.mockResolvedValue(mockData)

    await login(req, res, next)

    expect(mockServices.loginService).toHaveBeenLastCalledWith(req.validatedBody)

    expect(mockCookies.setAuthCookies).toHaveBeenCalledWith(
      res,
      mockData.accessToken,
      mockData.refreshToken
    )

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: {
        username: "rohit",
        email: 'test@example.user',
        userId: '12',
        role: 'user',
        avatar: 'avatar.png',
      },
    })
  })

  test('should forward error to next() while login failed', async () => {
    const req = { validatedBody: {} }
    const res = mockResponse()

    const error = new Error('login failed')

    mockServices.loginService.mockRejectedValue(error)

    await login(req, res, next)

    expect(next).toHaveBeenCalledWith(error)

    //Optional
    expect(mockCookies.setAuthCookies).not.toHaveBeenCalled()

    expect(res.json).not.toHaveBeenCalled()

  })
})
describe('verifyOtp controller', () => {
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  const next = jest.fn()

  test('should verify otp, set cookies and sends response ', async () => {

    const req = {
      validatedBody: {
        email: "test@example.com",
        otp: "123456"
      },
      ip: '',
      headers: {
        "user-agent": "jest-test-agent"
      }
    }
    const userAgent = req.headers?.["user-agent"] || ''

    const res = mockResponse()

    const mockData = {
      user: {
        username: 'rohit',
        email: "test@example.com",
        _id: "123",
        role: "user"

      },
      accessToken: "access-token",
      refreshToken: "refresh-token"
    }

    mockServices.verifyOtpService.mockResolvedValue(mockData)

    await verifyOtp(req, res, next)


    expect(mockServices.verifyOtpService).toHaveBeenCalledWith({ email: req.validatedBody.email, otp: req.validatedBody.otp, ip: req.ip, userAgent })

    expect(mockCookies.setAuthCookies).toHaveBeenCalledWith(res, mockData.accessToken, mockData.refreshToken)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user: {
        username: 'rohit',
        email: "test@example.com",
        userId: "123",
        role: "user"
      },
    })

  })

  test('should forward to next()', async () => {
    const req = {
      validatedBody: {},
      ip: '',
      headers: {
        "user-agent": "jest-test-agent"
      }
    }
    const res = mockResponse()


    const error = new Error('verify otp failed')

    mockServices.verifyOtpService.mockRejectedValue(error)

    await verifyOtp(req, res, next)

    expect(next).toHaveBeenCalledWith(error)


    expect(mockServices.verifyOtpService).toHaveBeenCalledWith({
      email: undefined,
      otp: undefined,
      ip: '',
      userAgent: "jest-test-agent"
    })
    expect(mockCookies.setAuthCookies).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})


describe('refreshToken controller ', () => {

  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  const next = jest.fn()

  test('should call refresh token service and set cookies', async () => {
    const req = {
      cookies: {
        accessToken: "accessToken",
        refreshToken: "refreshToken"
      }
    }

    const mockData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken'
    }

    const res = mockResponse()

    mockServices.refreshService.mockResolvedValue(mockData)

    await refreshToken(req, res, next)

    expect(mockCookies.setAuthCookies).toHaveBeenCalledWith(res,
      mockData.accessToken,
      mockData.refreshToken)

    expect(mockServices.refreshService).toHaveBeenCalledWith(req.cookies.refreshToken)

    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)

    expect(res.json).toHaveBeenCalledWith({
      success: true
    })
  })


  test('should foward next on error', async () => {
    const req = {
      cookies: {
        accessToken: "accessToken",
        refreshToken: "refreshToken"
      }
    }

    const res = mockResponse()

    const error = new Error("failed to refresh refreshToken")

    mockServices.refreshService.mockRejectedValue(error)

    await refreshToken(req, res, next)

    expect(next).toHaveBeenCalledWith(error)

    expect(mockServices.refreshService).toHaveBeenCalledWith(req.cookies.refreshToken)

    expect(mockCookies.setAuthCookies).not.toHaveBeenCalled()

    expect(res.status).not.toHaveBeenCalled()

    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('otp resend controller', () => {

  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should send otp successfully', async () => {
    const req = {
      validatedBody: {}
    }

    const next = jest.fn()

    const res = mockResponse()

    mockServices.otpResendService.mockResolvedValue(null)

    await otpResend(req, res, next)

    expect(mockServices.otpResendService).toHaveBeenCalledWith(req.validatedBody)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP resend successfully"
    })
  })

  test('should forward next on error', async () => {
    const req = {
      validatedBody: {}
    }

    const res = mockResponse()


    const error = new Error('failed to resend otp')
    const next = jest.fn()

    mockServices.otpResendService.mockRejectedValue(error)
    await otpResend(req, res, next)

    expect(next).toHaveBeenCalledWith(error)

    expect(mockServices.otpResendService).toHaveBeenCalledWith(req.validatedBody)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()

  })
})

describe('logout contoller', () => {
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should logout successfully', async () => {
    const req = {
      cookies: { refreshToken: 'refresh-token' }
    }

    const res = mockResponse()
    const next = jest.fn()

    mockServices.logoutService.mockResolvedValue(null)

    await logout(req, res, next)


    expect(mockServices.logoutService).toHaveBeenCalledWith(req.cookies.refreshToken)
    expect(mockCookies.clearAuthCookies).toHaveBeenCalledWith(res)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Logged out successfully"
    })
  })

  test('should forward on logout error', async () => {
    const req = {
      cookies: { refreshToken: 'refresh-token' }
    }
    const res = mockResponse()
    const error = new Error('failed to logout')
    const next = jest.fn()

    mockServices.logoutService.mockRejectedValue(error)

    await logout(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(mockServices.logoutService).toHaveBeenCalledWith(req.cookies.refreshToken)
    expect(mockCookies.clearAuthCookies).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()


  })
})

describe('logout all controller', () => {
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should logout all successfully', async () => {
    const req = {
      user: {
        _id: "1"
      }
    }

    const res = mockResponse()
    const next = jest.fn()
    const mockData = { message: "All devices logout successfully" }

    mockServices.logoutAllService.mockResolvedValue(mockData)

    await logoutAll(req, res, next)

    expect(mockServices.logoutAllService).toHaveBeenCalledWith(req.user._id)
    expect(mockCookies.clearAuthCookies).toHaveBeenCalledWith(res)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: mockData.message
    })
  })

  test('should forward error on logout all controller', async () => {
    const req = {
      user: {
        _id: "1"
      }
    }
    const res = mockResponse()
    const next = jest.fn()
    const error = new Error("failed to logout all")

    mockServices.logoutAllService.mockRejectedValue(error)

    await logoutAll(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(mockServices.logoutAllService).toHaveBeenCalledWith(req.user._id)
    expect(mockCookies.clearAuthCookies).not.toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('getMe controller', () => {
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should call get me service and send response', async () => {
    const req = {
      user: {
        email: 'test@example'
      }
    }
    const res = mockResponse()

    const next = jest.fn()

    const mockData = {
      user: {
        username: 'test',
        email: "test@gamil.com",
        _id: '1',
        role: 'user',
        avatar: "avatar.png"
      }
    }
    mockServices.getMeService.mockResolvedValue(mockData.user)

    await getMe(req, res, next)

    expect(mockServices.getMeService).toHaveBeenCalledWith(req.user)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      username: mockData.user.username,
      email: mockData.user.email,
      userId: mockData.user._id,
      role: mockData.user.role,
      avatar: mockData.user.avatar
    })

  })

  test('should forward error to next on getMe error ', async () => {

    const req = { user: {} }
    const res = mockResponse()
    const next = jest.fn()
    const error = new Error('cannot get user details')

    mockServices.getMeService.mockRejectedValue(error)

    await getMe(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(mockServices.getMeService).toHaveBeenCalledWith(req.user)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})

describe('set password controller', () => {

  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  test('should set password and return response with current user', async () => {

    const req = {
      user: { _id: '1' },
      validatedBody: { newPassword: "87654321" }
    }

    const res = mockResponse()
    const next = jest.fn()

    const user = {}

    mockServices.setPasswordService.mockResolvedValue(user)

    await setPassword(req, res, next)

    expect(mockServices.setPasswordService).toHaveBeenCalledWith(req.user._id, req.validatedBody.newPassword)
    expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Password set successfully",
      user
    })
  })

  test('should forward error to next on set password error', async () => {
    const req = {
      user: { _id: '1' },
      validatedBody: { newPassword: "87654321" }
    }

    const res = mockResponse()
    const next = jest.fn()

    const error = new Error('password set failed')

    mockServices.setPasswordService.mockRejectedValue(error)

    await setPassword(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(mockServices.setPasswordService).toHaveBeenCalledWith(req.user._id, req.validatedBody.newPassword)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()

  })
})


describe('Password Controllers', () => {
  let res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('changePassword', () => {
    test('should change password successfully', async () => {
      const req = {
        user: { _id: '123' },
        validatedBody: { oldPassword: 'old', newPassword: 'new' }
      };
      mockServices.changePasswordService.mockResolvedValue("Password changed successfully");

      await changePassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Password changed successfully" });
    });

    test('should forward error if changePasswordService fails', async () => {
      const error = new Error("Invalid current password");
      mockServices.changePasswordService.mockRejectedValue(error);

      await changePassword({ user: {}, validatedBody: {} }, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('forgotPassword', () => {
    test('should send OTP successfully', async () => {
      const req = { validatedBody: { email: 'test@example.com' } };
      mockServices.forgotPasswordService.mockResolvedValue();

      await forgotPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "OTP sent to your email address"
      });
    });

    test('should forward error if forgotPasswordService fails', async () => {
      const error = new Error("User not found");
      mockServices.forgotPasswordService.mockRejectedValue(error);

      await forgotPassword({ validatedBody: {} }, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('resetPassword', () => {
    test('should reset password successfully', async () => {
      const req = { validatedBody: { token: 'abc', newPassword: '123' } };
      mockServices.resetPasswordService.mockResolvedValue("Password reset successful");

      await resetPassword(req, res, next);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Password reset successful" });
    });

    test('should forward error if resetPasswordService fails', async () => {
      const error = new Error("Token expired");
      mockServices.resetPasswordService.mockRejectedValue(error);

      await resetPassword({ validatedBody: {} }, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe('Google OAuth controllers', () => {

  let req, res, next

  beforeEach(() => {
    req = {
      cookies: {},
      query: {},
      user: { _id: '123', role: 'user' }
    }
    res = {
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
    process.env.CLIENT_URL = 'http://localhost:3000';
  })

  describe('googleAuth', () => {
    test('should set oauth_state cookie and call passport authenticate', () => {
      const authenticateMock = jest.fn()

      mockPassport.default.authenticate.mockReturnValue(authenticateMock)

      googleAuth(req, res, next)

      expect(res.cookie).toHaveBeenCalledWith('oauth_state', expect.any(String), expect.any(Object))

      expect(mockPassport.default.authenticate).toHaveBeenCalledWith('google', expect.objectContaining({
        scope: ['profile', 'email'],
        state: expect.any(String)
      }))

      expect(authenticateMock).toHaveBeenCalledWith(req, res, next)
    })

  })

  describe('googleCallback', () => {
    test('should set auth cookie and redirects to client url', async () => {
      req.cookies.oauth_state = 'state123'
      req.query.state = "state123"

      mockTokenService.tokenService.generateTokens.mockReturnValue({
        accessToken: 'access',
        refreshToken: 'refresh'
      })

      await googleCallback(req, res, next)
      expect(mockServices.googleCallbackService).toHaveBeenCalledWith('state123', 'state123');
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access', expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh', expect.any(Object));
      expect(res.clearCookie).toHaveBeenCalledWith('oauth_state');
      expect(res.redirect).toHaveBeenCalledWith(process.env.CLIENT_URL);
    });

    test('should forward error to next if state mismatch or service fails', async () => {
      const error = new Error('Invalid State');
      mockServices.googleCallbackService.mockImplementation(() => { throw error; });

      await googleCallback(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });
}); 