const CACHE_NAME = 'recipes-v1';
const FILES_TO_CACHE = [
    './index.html',
    './mainsite.html',
    './pizza.html',
    './style.css',
    './img.jpg',
    './background.jpg'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
