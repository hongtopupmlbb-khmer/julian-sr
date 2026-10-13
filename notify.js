module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const t = process.env.TELEGRAM_BOT_TOKEN, c = process.env.TELEGRAM_CHAT_ID;
  if (!t || !c) return res.status(500).json({ ok: false, error: 'missing env' });
  const b = req.body || {}, rows = Array.isArray(b.rows) ? b.rows.slice(0, 8) : [];
  const e = s => String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])).slice(0, 100);
  const text = '🛒 <b>បញ្ជាទិញថ្មី</b>\n' + rows.map(r => e(r[0]) + ': <b>' + e(r[1]) + '</b>').join('\n') + '\n💵 សរុប: $' + (+b.usd || 0).toFixed(2);
  const r = await fetch('https://api.telegram.org/bot' + t + '/sendMessage', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: c, text, parse_mode: 'HTML' })
  });
  res.status(r.ok ? 200 : 502).json({ ok: r.ok });
};
