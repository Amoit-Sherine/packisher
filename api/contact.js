// Vercel serverless function: POST /api/contact
// Sends studio-site enquiries to the inbox through Resend.
//
// Environment variables (set in Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY   required. The same Resend key ROSC uses is fine.
//   CONTACT_TO       optional, defaults to support@packisher.com
//   CONTACT_FROM     optional, defaults to "Packisher Studio Site <support@packisher.com>"
// Never commit the key itself.

const MAX = { name: 120, email: 200, message: 5000 };
const NEEDS = new Set(['Mobile app', 'Website', 'Backend', 'Product design', 'Not sure yet']);
const recent = new Map(); // light per-instance rate limit: ip -> [timestamps]

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'Email is not configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Bots fill the hidden "company" field; pretend success.
  if (body.company) return res.status(200).json({ ok: true });

  const name = String(body.name || '').trim().slice(0, MAX.name);
  const email = String(body.email || '').trim().slice(0, MAX.email);
  const message = String(body.message || '').trim().slice(0, MAX.message);
  const needs = (Array.isArray(body.needs) ? body.needs : []).filter(n => NEEDS.has(n));
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please include your name, a valid email and a message.' });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) return res.status(429).json({ error: 'Too many messages. Please try again later.' });
  recent.set(ip, [...hits, now]);

  const to = process.env.CONTACT_TO || 'support@packisher.com';
  const from = process.env.CONTACT_FROM || 'Packisher Studio Site <support@packisher.com>';
  const lookingFor = needs.length ? needs.join(', ') : 'Not specified';

  const text = `New enquiry from the Packisher studio website (packisher.com)\n\nName: ${name}\nEmail: ${email}\nLooking for: ${lookingFor}\n\n${message}\n\nReply to this email to answer ${name} directly.`;
  const html = `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1C211E">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#7A5C38">Studio website enquiry</p>
  <h2 style="margin:0 0 16px;font-size:20px">${esc(name)} wants to talk about a project</h2>
  <table style="border-collapse:collapse;margin-bottom:16px">
    <tr><td style="padding:4px 16px 4px 0;color:#6A726C">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6A726C">Looking for</td><td>${esc(lookingFor)}</td></tr>
  </table>
  <div style="padding:16px;border-radius:12px;background:#F4F1EA;white-space:pre-wrap">${esc(message)}</div>
  <p style="margin:16px 0 0;font-size:13px;color:#6A726C">Sent from the contact form on packisher.com. Reply to this email to answer ${esc(name)} directly.</p>
</div>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Studio site] New project enquiry from ${name}`,
        text,
        html,
        tags: [{ name: 'source', value: 'studio_site' }],
      }),
    });
    if (!r.ok) return res.status(502).json({ error: 'Could not send right now.' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Could not send right now.' });
  }
};
