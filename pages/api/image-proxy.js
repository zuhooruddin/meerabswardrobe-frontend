// Image proxy API route to add cache headers for external images
// This helps with caching images from api.chitralhive.com

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Validate URL is from allowed domains
    const allowedDomains = [
      'api.chitralhive.com',
      'chitralhive.com',
      process.env.NEXT_PUBLIC_BACKEND_API_BASE?.replace('https://', '').replace('http://', '').replace('/api', ''),
    ].filter(Boolean);

    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

    if (!isAllowed) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }

    // Fetch the image
    const imageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ error: 'Failed to fetch image' });
    }

    // Get image data
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Set cache headers - 1 year for images
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Return the image
    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}











