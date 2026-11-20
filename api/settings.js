// Vercel Serverless Function: /api/settings

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Session-ID'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionId = req.headers['x-session-id'] || 'default-session';

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Settings retrieved',
      session_id: sessionId,
      settings: null,
    });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    return res.status(200).json({
      status: 'ok',
      message: 'Settings saved successfully',
      session_id: sessionId,
      settings: body.settings || body,
    });
  }

  return res.status(405).json({ detail: `Method ${req.method} not allowed` });
}
