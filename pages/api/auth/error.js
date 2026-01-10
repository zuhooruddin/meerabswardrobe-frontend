// This is a fallback error handler for NextAuth
// The catch-all route [...nextauth].js should handle this, but this ensures it works in production
// This route will be used if the catch-all route doesn't work properly in production
export default async function handler(req, res) {
  // Only handle GET requests (NextAuth error page is accessed via GET)
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the error from query parameters
  const { error } = req.query;
  
  // Get the base URL from environment or request headers
  let baseUrl = process.env.NEXTAUTH_URL;
  
  // Remove trailing slash if present
  if (baseUrl && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  
  if (!baseUrl) {
    // Try to get from referer header
    if (req.headers.referer) {
      try {
        baseUrl = new URL(req.headers.referer).origin;
      } catch (e) {
        // Ignore error
      }
    }
    
    // Fallback to host header
    if (!baseUrl && req.headers.host) {
      const protocol = req.headers['x-forwarded-proto'] || 
                      (req.headers['x-forwarded-ssl'] === 'on' ? 'https' : 'http');
      baseUrl = `${protocol}://${req.headers.host}`;
    }
    
    // Final fallback
    if (!baseUrl) {
      baseUrl = 'https://chitralhive.com';
    }
  }
  
  // Build login URL with error parameter if present
  const loginUrl = `${baseUrl}/login${error ? `?error=${encodeURIComponent(error)}` : ''}`;
  
  // Return a redirect response (302 temporary redirect)
  res.redirect(302, loginUrl);
}

