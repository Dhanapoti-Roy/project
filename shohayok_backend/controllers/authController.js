const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const { sendOtpEmail } = require("../utils/email");
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // 6 digit
}
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} = require("../utils/token");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, password required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || "user",
      isActive: true // ✅ FIX
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account inactive" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const refreshTokenExpiresAt = new Date(
      Date.now() + msToMillis(process.env.JWT_REFRESH_EXPIRES || "7d")
    );

    await user.update({
      refreshTokenHash,
      refreshTokenExpiresAt,
      lastLoginAt: new Date()
    });

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findByPk(payload.id);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const newRefreshToken = signRefreshToken({ id: user.id });

    const refreshTokenHash = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
    const refreshTokenExpiresAt = new Date(
      Date.now() + msToMillis(process.env.JWT_REFRESH_EXPIRES || "7d")
    );

    await user.update({ refreshTokenHash, refreshTokenExpiresAt });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(500).json({ message: "Token refresh failed" });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ refreshTokenHash: null, refreshTokenExpiresAt: null });
      }
    }
    return res.json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    await user.update({
      otp,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
    });

     await sendOtpEmail(email, otp);

    // 👉 later email send করবো

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await user.update({
      passwordHash,
      otp: null,
      otpExpiresAt: null
    });

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Reset failed" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "role", "isActive", "createdAt"]
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Helper: "7d" => ms
function msToMillis(text) {
  const match = /^(\d+)([smhd])$/.exec(text);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(match[1]);
  const unit = match[2];
  const map = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  return n * map[unit];
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  verifyOtp,
  resetPassword
};