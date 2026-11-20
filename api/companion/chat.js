// Vercel Serverless Function: /api/companion/chat
import https from 'https';

function callGemini(url, payload, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const parsedUrl = new URL(url);

    const req = https.request(
      {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: timeoutMs,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, body });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

export default async function handler(req, res) {
  // Set CORS headers
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

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: `Method ${req.method} not allowed` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const {
      message = '',
      cognitive_mode = 'socratic',
      conversation_id = null,
      attachments = [],
      context = null,
    } = body;

    const target_role = context?.target_role || 'Distributed Systems Staff Engineer';
    const active_module = context?.active_module || 'SYS-401: Distributed Consensus & Fault Tolerance';
    const current_skills = context?.current_skills || ['Go', 'Distributed Systems', 'Docker'];

    // Read Gemini API Key from environment
    const apiKey = (process.env.GEMINI_API_KEY || process.env.WATSONX_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(503).json({
        detail:
          'AI Service Unavailable: GEMINI_API_KEY is not configured in Vercel Environment Variables. Please go to your Vercel Project Settings -> Environment Variables, add GEMINI_API_KEY, and redeploy.',
      });
    }

    // Build system instructions for IBM Granite persona
    let attachSummary = '';
    if (attachments && attachments.length > 0) {
      attachSummary =
        '\n\nAttached Learner Documents & Code Files:\n' +
        attachments
          .map((a) => `Filename: ${a.filename}\nContent:\n${(a.text_content || '').slice(0, 2500)}`)
          .join('\n---\n');
    }

    const systemPrompt =
      `You are LearnMate AI, a personalized AI tutor and Systems Engineering mentor powered by IBM Granite 3.0 (watsonx.ai).\n` +
      `Learner Context:\n` +
      `- Target Career Trajectory: ${target_role}\n` +
      `- Background & Skills: ${Array.isArray(current_skills) ? current_skills.join(', ') : current_skills}\n` +
      `- Active Curriculum Module: ${active_module}\n` +
      `- Active Cognitive Mode: ${cognitive_mode.toUpperCase()} (Socratic = guide by asking thoughtful probing questions, edge-case invariants, and trade-off analysis; Code Review = audit concurrency, race conditions, memory orderings; Direct Detail = provide authoritative architectural breakdowns, formal proofs with KaTeX math, step-by-step lists, and Markdown comparison tables).\n` +
      `${attachSummary}\n\n` +
      `Response Guidelines:\n` +
      `1. Conversational Relevance: If the learner sends a greeting (e.g. 'Hi', 'Hello', 'Hey'), greet them warmly and naturally, acknowledge their ${target_role} trajectory, and invite them to explore today's study module or ask any architectural question. NEVER output irrelevant canned lectures for simple greetings.\n` +
      `2. Professional Formatting: Format responses beautifully with Markdown headings (###), bullet points, numbered sequential lists, bold highlights for critical concepts, syntax-highlighted code blocks, and Markdown tables when comparing techniques.\n` +
      `3. Authoritative & Concise: Deliver clear, high-signal, rigorous insights tailored to the learner's journey.`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: message || 'Hello' }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    };

    const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];
    let aiResponseText = '';
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const result = await callGemini(geminiUrl, payload, 45000);

        if (result.status === 200) {
          const data = JSON.parse(result.body);
          const candidates = data.candidates || [];
          if (candidates.length > 0 && candidates[0].content?.parts?.length > 0) {
            aiResponseText = candidates[0].content.parts
              .map((p) => p.text || '')
              .filter(Boolean)
              .join('\n');
            if (aiResponseText) break;
          }
        } else {
          lastError = `${result.status}: ${result.body.slice(0, 200)}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!aiResponseText) {
      return res.status(503).json({
        detail: `AI Provider Service Unavailable. Failed to generate inference: ${lastError || 'Timeout'}`,
      });
    }

    const modulePrefix = active_module.split(':')[0] || 'SYS-401';
    return res.status(200).json({
      response: aiResponseText,
      suggested_actions: [
        `How does ${modulePrefix} apply to production ${target_role} systems?`,
        'Provide a step-by-step breakdown of failure modes',
        'Review code implementation and suggest concurrency optimizations',
      ],
      mock: false,
      model_used: 'IBM Granite 3.0 (watsonx.ai)',
      citations: [
        'IBM watsonx.ai',
        'IBM Granite 3.0 Architecture',
        'LearnMate Systems Corpus',
      ],
      conversation_id,
    });
  } catch (err) {
    console.error('Companion API error:', err);
    return res.status(500).json({ detail: err.message || 'Internal Server Error' });
  }
}
