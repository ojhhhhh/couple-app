/* ========== REST API Adapter (replaces Firebase) ========== */
const API_BASE = 'http://localhost:3456';

// Simple UID generator (no auth needed)
const _uidKey = '_couple_uid';
let myUid = localStorage.getItem(_uidKey);
if (!myUid) { myUid = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); localStorage.setItem(_uidKey, myUid); }

async function apiGET(path) {
  const r = await fetch(API_BASE + path);
  if (!r.ok) throw new Error('API error: ' + r.status);
  return r.json();
}
async function apiPUT(path, body) {
  await fetch(API_BASE + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
async function apiPOST(path, body) {
  const r = await fetch(API_BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return r.json();
}
async function apiDELETE(path) {
  await fetch(API_BASE + path, { method: 'DELETE' });
}

/* ── Firebase-compatible DB object ── */
const db = {
  _watchers: {},
  _pollIntervals: {},

  ref(path) {
    const self = this;
    const parts = path.split('/');
    return {
      path,
      _orderBy: null, _limit: null, _equalTo: null,

      orderByChild(field) { this._orderBy = field; return this; },
      limitToLast(n) { this._limit = n; return this; },
      equalTo(val) { this._equalTo = val; return this; },

      async set(data) {
        try { await apiPUT('/api' + formatPath(path), data); } catch (e) { console.warn('API set fail:', e.message); }
      },
      async update(data) {
        // For simplicity, do a GET, merge, PUT
        try {
          const cur = (await self.ref(path).get()).val() || {};
          Object.assign(cur, data);
          await apiPUT('/api' + formatPath(path), cur);
        } catch (e) { console.warn('API update fail:', e.message); }
      },
      async once(event) { return this.get(); },  // Firebase compat: once('value') === get()
      async get() {
        try {
          let url = '/api' + formatPath(path);
          if (this._orderBy) {
            const params = new URLSearchParams();
            params.set('orderBy', this._orderBy);
            if (this._limit) params.set('limit', this._limit);
            if (this._equalTo) params.set('uid', this._equalTo);
            url += '?' + params.toString();
          }
          const data = await apiGET(url);
          // Wrap in Firebase-like snapshot
          return {
            val() {
              if (data && data._entries) {
                // Convert array back to object
                const obj = {};
                data._entries.forEach(e => { const { key, ...rest } = e; obj[key] = rest; });
                return obj;
              }
              if (data && data.val) return data.val; // our custom format
              return data;
            },
            forEach(fn) {
              if (data && data._entries) {
                data._entries.forEach(e => {
                  fn({
                    key: e.key,
                    val() { const { key, ...rest } = e; return rest; },
                    ref: self.ref(path + '/' + e.key)
                  });
                });
              }
            }
          };
        } catch (e) { console.warn('API get fail:', e.message); return { val() { return null; }, forEach() {} }; }
      },
      async push(data) {
        try { return await apiPOST('/api' + formatPath(path), data); } catch (e) { console.warn('API push fail:', e.message); return { key: null }; }
      },
      async remove() {
        try { await apiDELETE('/api' + formatPath(path)); } catch (e) { console.warn('API remove fail:', e.message); }
      },

      on(event, callback) {
        if (event !== 'value') return;
        const key = path;
        self._watchers[key] = self._watchers[key] || [];
        self._watchers[key].push(callback);
        // Poll every 2 seconds
        if (!self._pollIntervals[key]) {
          // Fire initial
          self.ref(path).get().then(snap => {
            (self._watchers[key] || []).forEach(cb => cb(snap));
          });
          self._pollIntervals[key] = setInterval(async () => {
            const snap = await self.ref(path).get();
            (self._watchers[key] || []).forEach(cb => cb(snap));
          }, 2000);
        }
      },
      onDisconnect() {
        return { set() { /* no-op for simple server */ } };
      }
    };
  }
};

function formatPath(p) {
  // Convert Firebase path to API path
  return '/' + p.split('/').filter(Boolean).join('/');
}

/* ── Shimming window.firebase ── */
window.firebase = {
  database() { return db; }
};

/* ── safeFB wrappers (updated for API) ── */
function safeFB(fn, fallback) {
  try { return fn(); }
  catch (e) { console.warn('safeFB fail:', e.message); return typeof fallback === 'function' ? fallback() : fallback; }
}
async function safeFBAsync(fn, fallback) {
  try { return await fn(); }
  catch (e) { console.warn('safeFBAsync fail:', e.message); return typeof fallback === 'function' ? await fallback() : fallback; }
}

/* ── Update initFirebase to not require Firebase SDK ── */
function initFirebase() {
  try {
    if (typeof firebase !== 'undefined' && db) { console.log('API backend ready'); return true; }
    console.warn('API backend not available, using offline mode');
    return false;
  } catch (e) {
    console.warn('Backend init failed, offline mode:', e.message);
    return false;
  }
}
