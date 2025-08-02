const CACHE_NAME = 'ceiling-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/main.js',
    '/styles.css',
];

// Установка SW и кеширование
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
        )
    );
    self.clients.claim();
});

// Fetch: сначала сеть, потом fallback из кэша
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') return caches.match('/');
                });
            })
    );
});

// Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-rooms') {
        event.waitUntil(syncUnsyncedRooms());
    }
});

// Синхронизация несинхронизированных данных
async function syncUnsyncedRooms() {
    try {
        const db = await openDB();

        const rooms = await getAllFromStore(db, 'rooms', 'synced', false);
        const images = await getAllFromStore(db, 'images', 'synced', false);

        for (const room of rooms) {
            try {
                const res = await fetch('/api/sync-room', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(room),
                });
                if (res.ok) await updateStore(db, 'rooms', room.id, { synced: true });
            } catch (e) {
                console.error('Sync room failed', room.id, e);
            }
        }

        for (const image of images) {
            try {
                const form = new FormData();
                form.append('image', image.imageBlob);
                form.append('roomId', image.roomId.toString());
                const res = await fetch('/api/sync-image', {
                    method: 'POST',
                    body: form,
                });
                if (res.ok) await updateStore(db, 'images', image.id, { synced: true });
            } catch (e) {
                console.error('Sync image failed', image.id, e);
            }
        }
    } catch (e) {
        console.error('syncUnsyncedRooms failed', e);
    }
}

// Открыть IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('CeilingDatabase', 2);

        req.onerror = () => reject(req.error);
        req.onsuccess = () => resolve(req.result);

        req.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('rooms')) {
                const store = db.createObjectStore('rooms', { keyPath: 'id', autoIncrement: true });
                store.createIndex('synced', 'synced', { unique: false });
            }
            if (!db.objectStoreNames.contains('images')) {
                const store = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                store.createIndex('synced', 'synced', { unique: false });
            }
        };
    });
}

// Получить все записи с определённым индексом
function getAllFromStore(db, storeName, indexName, value) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const index = store.index(indexName);
            const req = index.getAll(value);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        } catch (err) {
            console.error(`getAllFromStore error: ${storeName}.${indexName}`, err);
            reject(err);
        }
    });
}

// Обновление записи
function updateStore(db, storeName, id, changes) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            if (!data) return resolve();
            const updated = { ...data, ...changes };
            const putRequest = store.put(updated);

            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
        };

        getRequest.onerror = () => reject(getRequest.error);
    });
}
