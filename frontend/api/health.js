// Vercel Serverless Function: /api/health

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ status: 'ok', runtime: 'Vercel Serverless Node.js' });
}
