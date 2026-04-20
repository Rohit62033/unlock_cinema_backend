import { jest } from "@jest/globals";

/* ---------------- MOCK DEFINITIONS ---------------- */

const mockErrorFactory = {
  auth: {
    otpResendLimitExceeded: jest.fn(),
    userNotFound: jest.fn(),
    invalidCredentials: jest.fn(),
    otpInvalid: jest.fn(),
    otpAttemptsExceeded: jest.fn(),
    otpExpired: jest.fn(),
    unauthorized: jest.fn(),
    invalidOAuthState: jest.fn(),
  },
};

const mockOtpHasher = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const mockPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockTempUserRepo = {
  findTempUserByEmail: jest.fn(),
  saveTempUser: jest.fn(),
  createTempUser: jest.fn(),
  deleteTempUser: jest.fn(),
  findTempUserAndUpdate: jest.fn(),
};

const mockUserRepo = {
  findUserByEmail: jest.fn(),
  findByEmailWithPassword: jest.fn(),
  findUserById: jest.fn(),
  findUserByIdWithPassword: jest.fn(),
  createUser: jest.fn(),
  saveUser: jest.fn(),
  findUserAndUpdate: jest.fn(),
};

const mockSessionRepo = {
  createSession: jest.fn(),
  findSessionByRefreshToken: jest.fn(),
  invalidate: jest.fn(),
  invalidateAll: jest.fn(),
};

const mockTokenService = {
  generateTokens: jest.fn(),
  verifyRefreshToken: jest.fn(),
};

const mockPasswordResetRepo = {
  findPasswordResetByEmail: jest.fn(),
  savePasswordReset: jest.fn(),
  createPasswordResetUser: jest.fn(),
  deletePasswordResetByEmail: jest.fn(),
};

const mockGenerateOtp = jest.fn();
const mockSendOtpEmail = jest.fn();

/* ---------------- MODULE MOCKING ---------------- */

await jest.unstable_mockModule(
  "../../../../src/errors/errorFactory.js",
  () => ({
    errorFactory: mockErrorFactory,
  }),
);

await jest.unstable_mockModule("../../../../src/utils/generateHash.js", () => ({
  otpHasher: mockOtpHasher,
  passwordHasher: mockPasswordHasher,
}));

await jest.unstable_mockModule(
  "../../../../src/modules/users/repo/tempUser.repo.js",
  () => ({
    tempUserRepository: mockTempUserRepo,
  }),
);

await jest.unstable_mockModule(
  "../../../../src/modules/users/repo/user.repo.js",
  () => ({
    userRepository: mockUserRepo,
  }),
);

await jest.unstable_mockModule(
  "../../../../src/modules/auth/repo/session.repo.js",
  () => ({
    sessionRepository: mockSessionRepo,
  }),
);

await jest.unstable_mockModule(
  "../../../../src/modules/auth/utils/genreateOtp.js",
  () => ({
    generateOtp: mockGenerateOtp,
  }),
);

await jest.unstable_mockModule("../../../../src/utils/sendEmail.js", () => ({
  default: mockSendOtpEmail,
}));

await jest.unstable_mockModule(
  "../../../../src/modules/auth/utils/TokenService.js",
  () => ({
    tokenService: mockTokenService,
  }),
);

await jest.unstable_mockModule(
  "../../../../src/modules/users/repo/passwordReset.repo.js",
  () => ({
    PasswordResetRepository: mockPasswordResetRepo,
  }),
);


/* ---------------- IMPORT SERVICE AFTER MOCK ---------------- */

const {
  verifyOtpService,
  registerService,
  loginService,
  otpResendService,
  refreshService,
  getMeService,
  setPasswordService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
  logoutAllService,
  googleCallbackService,
} = await import("../../../../src/modules/auth/auth.service.js");

/* ---------------- RESET ---------------- */

beforeEach(() => {
  jest.clearAllMocks();
});

/* =========================================================
   ===================== TESTS ===============================
   ========================================================= */
describe("verifyOtpService", () => {
  const baseTempUser = {
    username: "rohit",
    email: "test@example.com",
    password: "hashed-pass",
    otp: "hashed-otp",
    otpExpiresAt: new Date(Date.now() + 10000),
    otpAttempts: 0,
  };

  test("should throw if temp user not found", async () => {
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(null);
    const error = new Error("invalid otp");

      mockErrorFactory.auth.otpInvalid.mockImplementation(() => {
      throw error;
    });

    await expect(
      verifyOtpService({ email: "test@example.com", otp: "123456" }),
    ).rejects.toThrow("invalid otp");

    expect(mockTempUserRepo.findTempUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });

  test("should throw if attempts exceeded", async () => {
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue({
      ...baseTempUser,
      otpAttempts: 5,
    });
    const error = new Error("attempts exceeded");
      mockErrorFactory.auth.otpAttemptsExceeded.mockImplementation(() => {
      throw error;
    });

    await expect(
      verifyOtpService({ email: "test@example.com", otp: "123" }),
    ).rejects.toThrow(error);
  });

  test("sholud throw if otp expired", async () => {
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue({
      ...baseTempUser,
      otpExpiresAt: new Date(Date.now() - 1000),
    });
    const error = new Error("expired");
    mockErrorFactory.auth.otpExpired.mockImplementation(() => {
      throw error;
    });
    await expect(
      verifyOtpService({ email: "test@example.com", otp: "123" }),
    ).rejects.toThrow(error);
  });

  test("should increment attempts and throw if otp invalid", async () => {
    const tempUser = { ...baseTempUser };
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(tempUser);
    mockOtpHasher.verify.mockReturnValue(false);

    const error = new Error("invalid otp");
     mockErrorFactory.auth.otpInvalid.mockImplementation(() => {
      throw error;
    });

    await expect(
      verifyOtpService({ email: "test@example.com", otp: "wrong" }),
    ).rejects.toThrow(error);

    expect(tempUser.otpAttempts).toBe(1);

    expect(mockTempUserRepo.saveTempUser).toHaveBeenCalledWith(tempUser);
  });
  test("should create user, session and return tokens", async () => {
    const tempUser = { ...baseTempUser };
    const createdUser = {
      _id: "1",
      role: "user",
      username: tempUser.username,
      email: tempUser.email,
    };
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(tempUser);
    mockOtpHasher.verify.mockReturnValue(true);
    mockUserRepo.createUser.mockResolvedValue(createdUser);
    mockTokenService.generateTokens.mockReturnValue({
      accessToken: "access",
      refreshToken: "refresh",
    });

    const result = await verifyOtpService({
      email: tempUser.email,
      otp: "123456",
      ip: "127.0.0.1",
      userAgent: "jest",
    });

    expect(mockUserRepo.createUser).toHaveBeenCalledWith({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      authProviders: ["local"],
      isPasswordSet: true,
    });
    expect(mockSessionRepo.createSession).toHaveBeenCalledWith({
      user: createdUser._id,
      refreshToken: "refresh",
      ip: "127.0.0.1",
    });

    expect(mockTempUserRepo.deleteTempUser).toHaveBeenCalledWith(
      tempUser.email,
    );

    expect(result).toEqual({
      user: createdUser,
      accessToken: "access",
      refreshToken: "refresh",
    });
  });
});

describe("registerservice", () => {
  const user = {
    username: "jest",
    email: "test@example.com",
    password: "jest",
  };

  test("should throw if user already exists", async () => {
    mockUserRepo.findUserByEmail.mockResolvedValue(user);
    const error = new Error("user already exists");
    mockErrorFactory.auth.userAlreadyExists = jest.fn(() => error);
    await expect(
      registerService({
        username: "jest",
        email: "test@example.com",
        password: "jest",
      }),
    ).rejects.toThrow(error);

    expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });

  test("should create temp user if not exists", async () => {
    mockUserRepo.findUserByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue("hashedPassword");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");
    mockGenerateOtp.mockReturnValue("123456");
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(null);

    await registerService({
      username: "jest",
      email: "test@example.com",
      password: "123456",
    });

    expect(mockTempUserRepo.createTempUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        username: "jest",
        password: "hashedPassword",
        otp: "hashedOtp",
      }),
    );
    expect(mockUserRepo.findUserByEmail).toHaveBeenCalled();
  });

  test("should throw temp user if exists", async () => {
    mockUserRepo.findUserByEmail.mockResolvedValue(null);
    mockPasswordHasher.hash.mockResolvedValue("hashedPassword");

    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");
    const tempUser = { email: "test@example.com" };
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(tempUser);

    await registerService({
      username: "jest",
      email: "test@example.com",
      password: "123456",
    });
    expect(mockTempUserRepo.saveTempUser).toHaveBeenCalledWith(tempUser);
    expect(tempUser.otp).toBe("hashedOtp");
    expect(tempUser.otpAttempts).toBe(0);
    expect(tempUser.otpResendCount).toBe(0);
  });

  test("should send OTP email", async () => {
    mockUserRepo.findUserByEmail.mockResolvedValue(null);

    mockPasswordHasher.hash.mockResolvedValue("hashedPassword");
    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(null);
    await registerService({
      username: "rohit",
      email: "test@example.com",
      password: "123",
    });
    expect(mockSendOtpEmail).toHaveBeenCalledWith("test@example.com", "123456");
  });
});

describe("loginService", () => {
  let user = { email: "test@example.com", password: "hashedPassword" };

  test("should throw if user not found", async () => {
    mockUserRepo.findByEmailWithPassword.mockResolvedValue(null);

    const error = new Error("user not found");
    mockErrorFactory.auth.userNotFound = jest.fn(() => error);

    await expect(
      loginService({ email: "test@example.com", password: "123456" }),
    ).rejects.toThrow(error);
  });

  test("should throw if failed login attempts more than 3", async () => {
    user = { ...user, failedLoginAttempts: 4 };

    mockUserRepo.findByEmailWithPassword.mockResolvedValue(user);

    await expect(
      loginService({ email: "test@example.com", password: "123" }),
    ).rejects.toThrow("User is locked for 24 hours");
  });

  test("should throw if password doesn't matches", async () => {
    user = { password: "hashedPassword", failedLoginAttempts: 1 };

    mockUserRepo.findByEmailWithPassword.mockResolvedValue(user);

    mockPasswordHasher.compare.mockResolvedValue(false);

    const error = new Error("invalid credentials");

    mockErrorFactory.auth.invalidCredentials = jest.fn(() => error);

    await expect(loginService({ password: "wrong" })).rejects.toThrow(error);

    expect(user.failedLoginAttempts).toBe(2);

    expect(mockUserRepo.saveUser).toHaveBeenCalledWith(user);
  });

  test("should reset failed attempts, create session and return tokens", async () => {
    user = { _id: "1", role: "user", failedLoginAttempts: 2 };

    mockUserRepo.findByEmailWithPassword.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(true);

    mockTokenService.generateTokens.mockReturnValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });

    await mockSessionRepo.createSession.mockResolvedValue();

    const result = await loginService({
      email: "test@example.com",
      password: "correct",
    });

    expect(mockUserRepo.findByEmailWithPassword).toHaveBeenCalledWith(
      "test@example.com",
    );

    expect(mockTokenService.generateTokens).toHaveBeenCalledWith("1", "user");

    expect(mockSessionRepo.createSession).toHaveBeenCalledWith({
      user: "1",
      refreshToken: "refreshToken",
    });

    expect(user.failedLoginAttempts).toBe(0);
    expect(result).toEqual({
      user,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });

    expect(mockUserRepo.saveUser).toHaveBeenCalledWith(user);
  });

  test("should not save user if failedLoginAttempt is 0", async () => {
    user = { _id: "1", role: "user", failedLoginAttempts: 0 };

    mockUserRepo.findByEmailWithPassword.mockResolvedValue(user);

    mockPasswordHasher.compare.mockResolvedValue(true);

    mockTokenService.generateTokens.mockReturnValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });
    const result = await loginService({
      email: "test@example.com",
      password: "hashedPassword",
    });

    expect(mockUserRepo.saveUser).not.toHaveBeenCalled();

    expect(mockUserRepo.findByEmailWithPassword).toHaveBeenCalledWith(
      "test@example.com",
    );

    expect(mockTokenService.generateTokens).toHaveBeenCalledWith("1", "user");

    expect(mockSessionRepo.createSession).toHaveBeenCalled();

    expect(result).toEqual({
      user,
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    });

    expect(user.failedLoginAttempts).toBe(0);
  });
});

describe("otpResendService", () => {
  beforeEach(() => {
    let user = {};
  });

  test("should throw if user not found", async () => {
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(null);

    const error = new Error("user not found");

    mockErrorFactory.auth.userNotFound = jest.fn(() => error);

    await expect(
      otpResendService({ email: "test@example.com" }),
    ).rejects.toThrow(error);
    expect(mockTempUserRepo.findTempUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });
  test("should throw if otp resend count is equal or more than 3", async () => {
    user = { email: "test@example.com", otpResendCount: 4 };
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(user);
    const error = new Error("otp resend count exceeds");
    mockErrorFactory.auth.otpResendLimitExceeded = jest.fn(() => error);

    await expect(
      otpResendService({ email: "test@example.com" }),
    ).rejects.toThrow("otp resend count exceeds");
    expect(mockTempUserRepo.findTempUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
  });

  test("should generate otp, save temp user and update and sends otp email", async () => {
    user = { email: "test@example.com", otpResendCount: 0 };
    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(user);

    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");
    await otpResendService({ email: "test@example.com" });
    expect(mockTempUserRepo.findTempUserAndUpdate).toHaveBeenCalledWith(
      { email: "test@example.com" },
      {
        $set: { otp: "hashedOtp", otpExpiresAt: expect.any(Date) },
        $inc: { otpResendCount: 1 },
      },
    );

    expect(mockTempUserRepo.findTempUserByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(mockGenerateOtp).toHaveBeenCalled();

    expect(mockOtpHasher.hash).toHaveBeenCalledWith("123456");

    expect(mockSendOtpEmail).toHaveBeenCalledTimes(1);
  });

  test("should throw if temp user repo failed to find and update ", async () => {
    user = { email: "test@example.com" };

    mockTempUserRepo.findTempUserByEmail.mockResolvedValue(user);

    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");

    const error = new Error("fialed to find and update temp user");
    mockTempUserRepo.findTempUserAndUpdate.mockRejectedValue(error);
    await expect(
      otpResendService({ email: "test@example.com" }),
    ).rejects.toThrow(error);

    expect(mockSendOtpEmail).not.toHaveBeenCalled();
  });
});

describe("refreshService", () => {
  test("should throw if refresh token not available", async () => {
    const error = new Error("refresh token not found");
    mockErrorFactory.auth.unauthorized = jest.fn(() => error);

    await expect(refreshService(null)).rejects.toThrow(
      "refresh token not found",
    );
  });

  test("should throw if session not found or invalid", async () => {
    mockSessionRepo.findSessionByRefreshToken.mockResolvedValue(null);

    const error = new Error("unauthorized");
    mockErrorFactory.auth.unauthorized = jest.fn(() => error);
    await expect(refreshService("refreshToken")).rejects.toThrow(
      "unauthorized",
    );
    expect(mockSessionRepo.findSessionByRefreshToken).toHaveBeenCalledWith(
      "refreshToken",
    );
  });
  test("should decode refreshToken, generate new tokens and return it", async () => {
    const session = { refreshToken: "refreshToken", isValid: true };
    mockSessionRepo.findSessionByRefreshToken.mockResolvedValue(session);
    const decoded = { userId: "1", role: "user" };
    mockTokenService.verifyRefreshToken.mockReturnValue(decoded);
    mockTokenService.generateTokens.mockReturnValue({
      accessToken: "accessToken",
      refreshToken: "newRefreshToken",
    });
    const result = await refreshService("refreshToken");
    expect(mockSessionRepo.findSessionByRefreshToken).toHaveBeenCalledWith(
      "refreshToken",
    );
    expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
      "refreshToken",
    );
    expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
      decoded.userId,
      decoded.role,
    );
    expect(result).toEqual({
      accessToken: "accessToken",
      refreshToken: "newRefreshToken",
    });
  });
});
describe("get me service", () => {
  test("should throw if user is not found ", async () => {
    mockUserRepo.findUserById.mockResolvedValue(null);
    const error = new Error("user not found");
    mockErrorFactory.auth.unauthorized.mockImplementation(() => {
      throw error;
    });
    await expect(getMeService({ _id: "1" })).rejects.toThrow("user not found");

    expect(mockUserRepo.findUserById).toHaveBeenCalled();
  });
  test("should find user and return it", async () => {
    const user = { email: "test@example.com" };
    mockUserRepo.findUserById.mockResolvedValue(user);
    const result = await getMeService({ _id: "1" });
    expect(result).toEqual(user);
    expect(mockUserRepo.findUserById).toHaveBeenCalled();
  });
});

describe("setPasswordService", () => {
  beforeEach(() => {
    let user = { email: "test@example.com", username: "test" };
  });

  test("should throw if user is not found", async () => {
    mockUserRepo.findUserById.mockResolvedValue(null);
    const error = new Error("user not found");
    mockErrorFactory.auth.userNotFound.mockImplementation(() => {
      throw error;
    });
    await expect(setPasswordService("1", "newPassword")).rejects.toThrow(
      "user not found",
    );
    expect(mockUserRepo.findUserById).toHaveBeenCalledWith("1");
  });
  test("should throw if password is already set ", async () => {
    user = { isPasswordSet: true };
    mockUserRepo.findUserById.mockResolvedValue(user);
    const error = new Error("Password already set");
    await expect(setPasswordService("1", "newPassword")).rejects.toThrow(
      "Password already set",
    );
  });

  test("should hash password, push local to authProvider, save user and return", async () => {
    user = { isPasswordSet: false, authProviders: [] };

    mockUserRepo.findUserById.mockResolvedValue(user);
    mockPasswordHasher.hash.mockResolvedValue("hashedNewPassword");

    const result = await setPasswordService("1", "newPassword");

    expect(mockUserRepo.saveUser).toHaveBeenCalledWith({
      ...user,
      isPasswordSet: true,
      authProviders: ["local"],
    });

    expect(result).toEqual(result);
  });
  test("should hash password, not push local if already set, save user and return it", async () => {
    user = { isPasswordSet: false, authProviders: ["local"] };
    mockUserRepo.findUserById.mockResolvedValue(user);
    mockPasswordHasher.hash.mockResolvedValue("hashedNewPassword");
    const result = await setPasswordService("1", "newPassword");
    expect(mockUserRepo.saveUser).toHaveBeenCalledWith({
      ...user,
      isPasswordSet: true,
    });
    expect(mockUserRepo.saveUser).toHaveBeenCalledWith({
      ...user,
      isPasswordSet: true,
    });
    expect(user.authProviders).toContain("local");
    expect(result).toEqual(result);
  });
});

describe("changePasswordService", () => {
  beforeEach(() => {
    let user = { email: "test@example.com", username: "test" };
  });

  test("should throw if user is not found", async () => {
    mockUserRepo.findUserByIdWithPassword.mockResolvedValue(null);
    const error = new Error("user not found");
    mockErrorFactory.auth.userNotFound.mockImplementation(() => {
      throw error;
    });

    await expect(changePasswordService("1", "newPassword")).rejects.toThrow(
      "user not found",
    );

    expect(mockUserRepo.findUserByIdWithPassword).toHaveBeenCalledWith("1");
  });

  test("should throw if password is not set", async () => {
    user = { isPasswordSet: false };
    mockUserRepo.findUserByIdWithPassword.mockResolvedValue(user);
    await expect(changePasswordService("1", "newPassword")).rejects.toThrow(
      "Password not set",
    );
  });
  test("should throw if confirm password and new password doesnot match", async () => {
    const user = { isPasswordSet: true, password: "hashed-password" };
    mockUserRepo.findUserByIdWithPassword.mockResolvedValue(user);
    await expect(
      changePasswordService("1", {
        currentPassword: "samePass",
        newPassword: "samePass",
      }),
    ).rejects.toThrow("Same password cann't be change");
  });
  test("should throw if password is invalid", async () => {
    const user = { isPasswordSet: true, password: "hashed-password" };
    mockUserRepo.findUserByIdWithPassword.mockResolvedValue(user);
    mockPasswordHasher.compare.mockResolvedValue(false);
    const error = new Error("Invalid credentails");
    mockErrorFactory.auth.invalidCredentials.mockImplementation(() => {
      throw error;
    });
    await expect(
      changePasswordService("1", {
        currentPassword: "samePass",
        newPassword: "newPass",
      }),
    ).rejects.toThrow("Invalid credentails");
  });
  test("should hash password,save user and return successful message", async () => {
    const user = { isPasswordSet: true, password: "hashed-password" };
    mockUserRepo.findUserByIdWithPassword.mockResolvedValue(user);

    mockPasswordHasher.compare.mockResolvedValue(true);
    mockPasswordHasher.hash.mockResolvedValue("true");

    const result = await changePasswordService("1", {
      currentPassword: "samePass",
      newPassword: "newPass",
    });

    expect(mockUserRepo.saveUser).toHaveBeenCalledWith(user);

    expect(result).toEqual({ message: "Password changed successfully" });
  });
});
describe("forgotPasswordService", () => {
  test("should throw if user not found", async () => {
    mockUserRepo.findUserByEmail.mockResolvedValue(null);

    const error = new Error("user not found");
    mockErrorFactory.auth.userNotFound.mockImplementation(() => {
      throw error;
    });
    await expect(forgotPasswordService("email")).rejects.toThrow(
      "user not found",
    );
    expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith("email");
  });
  test("should hash otp, increase otp count to 1 if forget password already attempts and save to the repo", async () => {
    const user = { isPasswordSet: true, email: "test@example.com" };
    mockUserRepo.findUserByEmail.mockResolvedValue(user);

    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");
    const forgotUser = { otp: "hashedOtp", otpCount: 1 };

    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(
      forgotUser,
    );
    await forgotPasswordService("email");

    expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith("email");
    expect(mockGenerateOtp).toHaveBeenCalled();
    expect(mockOtpHasher.hash).toHaveBeenCalledWith("123456");
    expect(mockSendOtpEmail).toHaveBeenCalledWith("email", "123456");
    expect(mockPasswordResetRepo.savePasswordReset).toHaveBeenCalledWith(
      forgotUser,
    );
    expect(forgotUser.otpCount).not.toBe(1);
  });

  test("should hash otp, set otp count to 1 if forget password user not attempts and save to the repo", async () => {
    const user = { isPasswordSet: true, email: "test@example.com" };
    mockUserRepo.findUserByEmail.mockResolvedValue(user);

    mockGenerateOtp.mockReturnValue("123456");
    mockOtpHasher.hash.mockReturnValue("hashedOtp");

    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(null);

    await forgotPasswordService("email");
    expect(mockUserRepo.findUserByEmail).toHaveBeenCalledWith("email");

    expect(mockGenerateOtp).toHaveBeenCalled();
    expect(mockOtpHasher.hash).toHaveBeenCalledWith("123456");
    expect(mockSendOtpEmail).toHaveBeenCalledWith("email", "123456");

    expect(
      mockPasswordResetRepo.createPasswordResetUser,
    ).toHaveBeenCalledWith({ otp: "hashedOtp", otpCount: 1, email: "email" });
  });
});

describe("resetPasswordService", () => {
  test("should throw if user not found", async () => {
    await expect(
      resetPasswordService({
        newPassword: "newPass",
        confirmPassword: "confirmPass",
      }),
    ).rejects.toThrow("Confirm password doesn't match");
  });
  test("should throw if password reset user not found", async () => {
    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(null);
    await expect(
      resetPasswordService({
        email: "email",
        newPassword: "newPass",
        confirmPassword: "newPass",
      }),
    ).rejects.toThrow("Invalid request");
    expect(
      mockPasswordResetRepo.findPasswordResetByEmail,
    ).toHaveBeenCalledWith("email");
  });
  test("should throw if otp expired", async () => {
    const restUser = { expiresAt: new Date(Date.now() - 1000) };
    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(
      restUser,
    );
    await expect(
      resetPasswordService({
        email: "email",
        newPassword: "newPass",
        confirmPassword: "newPass",
      }),
    ).rejects.toThrow("OTP expires");
    expect(
      mockPasswordResetRepo.findPasswordResetByEmail,
    ).toHaveBeenCalledWith("email");
  });

  test("should throw if otp is invalid", async () => {
    const resetUser = {
      expiresAt: new Date(Date.now() + 10000),
      otp: "123456",
    };
    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(
      resetUser,
    );
    mockOtpHasher.verify.mockReturnValue(false);
    const error = new Error("OTP is invalid");
    mockErrorFactory.auth.otpInvalid.mockImplementation(() => {
      throw error;
    });
    await expect(
      resetPasswordService({
        email: "email",
        newPassword: "newPass",
        confirmPassword: "newPass",
        otp: "123457",
      }),
    ).rejects.toThrow("OTP is invalid");
    expect(mockOtpHasher.verify).toHaveBeenCalledWith("123457", "123456");
    expect(
      mockPasswordResetRepo.findPasswordResetByEmail,
    ).toHaveBeenCalledWith("email");
  });

  test("should hash password, update user to user repo, invalidates all session, delete password reset repo and return successful message", async () => {
    const resetUser = { expiresAt: new Date(Date.now() + 100000000) };
    const user = { _id: 1, email: "email" };
    mockPasswordResetRepo.findPasswordResetByEmail.mockResolvedValue(
      resetUser,
    );
    mockOtpHasher.verify.mockReturnValue(true);
    mockPasswordHasher.hash.mockResolvedValue("hashedPassword");
    mockUserRepo.findUserAndUpdate.mockResolvedValue(user);
    const message = await resetPasswordService({
      email: "email",
      newPassword: "newPass",
      confirmPassword: "newPass",
    });
    expect(mockUserRepo.findUserAndUpdate).toHaveBeenCalledWith(
      { email: "email" },
      { $set: { password: "hashedPassword", isPasswordSet: true } },
    );
    expect(mockSessionRepo.invalidateAll).toHaveBeenCalledWith(user._id);
    expect(
      mockPasswordResetRepo.deletePasswordResetByEmail,
    ).toHaveBeenCalledWith({ email: "email" });
    expect(message).toEqual(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });
});

describe("logout service", () => {
  test("should throw if not of refresh token", async () => {
    const error = new Error("Unauthorized");
    mockErrorFactory.auth.unauthorized.mockImplementation(() => {
      throw error;
    });
    await expect(logoutService(null)).rejects.toThrow("Unauthorized");
  });
  test("should invalidate refresh token", async () => {
    await logoutService("refreshToken");
    expect(mockSessionRepo.invalidate).toHaveBeenCalledWith("refreshToken");
  });
});

describe("logoutAllService", () => {
  test("should invalidate all session and return success message", async () => {
    await logoutAllService("refreshToken");

    expect(mockSessionRepo.invalidateAll).toHaveBeenCalledWith(
      "refreshToken",
    );
  });
});

describe("googleCallbackService", () => {

  test("should throw if stored state and returned state not matched", async () => {

    const error = new Error("Invalid OAuth state");
    mockErrorFactory.auth.invalidOAuthState.mockImplementation(() => {
      throw error
    });

    await expect(
      googleCallbackService("returnedState", "state"),
    ).rejects.toThrow("Invalid OAuth state");
  });
});
