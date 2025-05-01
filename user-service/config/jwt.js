module.exports = {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m'
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d'
    },
    verificationToken: {
      expiresIn: '1h'
    },
    resetToken: {
      expiresIn: '30m'
    }
  };