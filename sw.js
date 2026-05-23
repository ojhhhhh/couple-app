const CACHE = 'puppy-v5';
const FILES = [
  '.',
  'index.html',
  'css/style.css',
  'js/storage.js',
  'js/weather.js',
  'js/greeting.js',
  'js/messages.js',
  'js/schedule.js',
  'js/period.js',
  'js/puppy.js',
  'js/fortune.js',
  'js/exam.js',
  'js/notify.js',
  'js/diary.js',
  'js/sos.js',
  'js/photos.js',
  'js/app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
