// Google OAuth callback handler
// This route handles /api/callback/google and proxies to NextAuth's handler
// This is needed because Google OAuth is configured to use /api/callback/google
// but NextAuth expects /api/auth/callback/google

export default async function handler(req, res) {
  // Dynamically import NextAuth handler to avoid circular dependencies
  const nextAuthModule = await import('../auth/[...nextauth]');
  const nextAuthHandler = nextAuthModule.default;
  
  // Modify the request URL to match NextAuth's expected path
  const originalUrl = req.url || req.originalUrl || '';
  
  // Replace /api/callback/google with /api/auth/callback/google
  const modifiedUrl = originalUrl.replace('/api/callback/google', '/api/auth/callback/google');
  
  // Update the request object
  req.url = modifiedUrl;
  if (req.originalUrl) {
    req.originalUrl = modifiedUrl;
  }
  
  // Call NextAuth's handler directly with the modified request
  return nextAuthHandler(req, res);
}

