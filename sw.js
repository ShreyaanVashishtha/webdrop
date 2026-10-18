// WebDrop Service Worker with PWA Web Share Target support
const CACHE_NAME = 'webdrop-cache-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// IndexedDB Helper for Storing Shared Data in Service Worker
function openShareDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('webdrop_pwa_share', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('shared_items')) {
                db.createObjectStore('shared_items', { keyPath: 'id', autoIncrement: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function storeSharedPayload(item) {
    const db = await openShareDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('shared_items', 'readwrite');
        const store = tx.objectStore('shared_items');
        store.add(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Intercept Web Share Target POST requests
    if (event.request.method === 'POST' && url.searchParams.has('share-target')) {
        event.respondWith((async () => {
            try {
                const formData = await event.request.formData();
                const files = formData.getAll('files') || [];
                const title = formData.get('title') || '';
                const text = formData.get('text') || '';
                const shareUrl = formData.get('url') || '';

                await storeSharedPayload({
                    title,
                    text,
                    url: shareUrl,
                    files,
                    timestamp: Date.now()
                });
            } catch (err) {
                console.error('[WebDrop SW] Failed to process share target formData:', err);
            }

            // Redirect back to main WebDrop interface with query param
            return Response.redirect('/?shared=true', 303);
        })());
        return;
    }

    // Default network-first caching strategy
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
