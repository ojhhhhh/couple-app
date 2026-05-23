const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb', strict: false }));

const DATA = path.join(__dirname, 'server-data');

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return null; }
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data), 'utf8');
}

// ── Users ──
// Full user data (no subpath)
app.get('/api/users/:uid', (req, res) => {
  const dir = path.join(DATA, 'users', req.params.uid);
  const result = {};
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => {
      if (f.endsWith('.json')) result[f.replace('.json', '')] = readJSON(path.join(dir, f));
    });
  }
  res.json(result);
});

// User subpath operations
app.get('/api/users/:uid/:subpath(*)', (req, res) => {
  const file = path.join(DATA, 'users', req.params.uid, req.params.subpath + '.json');
  res.json(readJSON(file));
});

app.put('/api/users/:uid/:subpath(*)', (req, res) => {
  writeJSON(path.join(DATA, 'users', req.params.uid, req.params.subpath + '.json'), req.body);
  res.json({ ok: true });
});

app.delete('/api/users/:uid/:subpath(*)', (req, res) => {
  try { fs.unlinkSync(path.join(DATA, 'users', req.params.uid, req.params.subpath + '.json')); } catch {}
  res.json({ ok: true });
});

// ── Pairs ──
app.get('/api/pairs/:code', (req, res) => {
  res.json(readJSON(path.join(DATA, 'pairs', req.params.code + '.json')));
});

app.put('/api/pairs/:code', (req, res) => {
  const file = path.join(DATA, 'pairs', req.params.code + '.json');
  const existing = readJSON(file) || {};
  Object.assign(existing, req.body);
  writeJSON(file, existing);
  res.json({ ok: true });
});

// ── Public ──
app.get('/api/public', (req, res) => {
  const dir = path.join(DATA, 'public');
  const result = {};
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => {
      if (f.endsWith('.json')) result[f.replace('.json', '')] = readJSON(path.join(dir, f));
    });
  }
  res.json(result);
});

app.get('/api/public/:subpath(*)', (req, res) => {
  const sub = req.params.subpath;
  if (!sub) {
    // Return all public data
    const dir = path.join(DATA, 'public');
    const result = {};
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(f => {
        if (f.endsWith('.json')) result[f.replace('.json', '')] = readJSON(path.join(dir, f));
      });
    }
    return res.json(result);
  }
  const file = path.join(DATA, 'public', sub + '.json');
  const data = readJSON(file);
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    let entries = Object.entries(data).map(([k, v]) => ({ key: k, ...v }));
    const { orderBy, uid } = req.query;
    if (uid) entries = entries.filter(e => e.uid === uid);
    if (orderBy) entries.sort((a, b) => (a[orderBy] || 0) - (b[orderBy] || 0));
    const limit = parseInt(req.query.limit) || entries.length;
    entries = entries.slice(-limit);
    return res.json({ _entries: entries, val: entries });
  }
  res.json(data);
});

app.post('/api/public/:subpath(*)', (req, res) => {
  const sub = req.params.subpath;
  const file = path.join(DATA, 'public', sub + '.json');
  const data = readJSON(file) || {};
  const id = 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  data[id] = req.body;
  writeJSON(file, data);
  res.json({ key: id });
});

app.put('/api/public/:subpath(*)', (req, res) => {
  const sub = req.params.subpath;
  writeJSON(path.join(DATA, 'public', sub + '.json'), req.body);
  res.json({ ok: true });
});

app.delete('/api/public/:subpath(*)', (req, res) => {
  const sub = req.params.subpath;
  const parts = sub.split('/');
  const key = parts.pop();
  const parentPath = parts.join('/');
  const file = path.join(DATA, 'public', parentPath + '.json');
  const data = readJSON(file) || {};
  delete data[key];
  writeJSON(file, data);
  res.json({ ok: true });
});

// Serve static frontend files
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log('Couple server running on http://localhost:' + PORT);
});
