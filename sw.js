const CACHE_NAME = 'recipes-v4';
const FILES_TO_CACHE = [
    './index.html',
    './recipe.html',
    './sauces.html',
    './bread.html',
    './chicken.html',
    './fish.html',
    './oil.html',
    './style.css',
    './recipes-app.js',
    './img.jpg',
    './background.jpg'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
