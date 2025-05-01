module.exports = {
    // Password policy
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumber: true,
      requireSpecialChar: true
    },
    
    // Rate limiting
    rateLimits: {
      login: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxAttempts: 5
      },
      register: {
        windowMs: 60 * 60 * 1000, // 1 hour
        maxAttempts: 3
      }
    },
    
    // Session security
    session: {
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    }
  };