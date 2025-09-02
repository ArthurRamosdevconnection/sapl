const CACHE_NAME = 'sapl-v1';
const STATIC_CACHE = 'sapl-static-v1';

// URLs essenciais para cachear imediatamente
const ESSENTIAL_URLS = [
    '/',
];

// Função para descobrir todos os arquivos estáticos
async function cacheAllStaticFiles() {
    try {
        const cache = await caches.open(STATIC_CACHE);

        // Lista de extensões de arquivos estáticos comuns
        const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];

        // Vamos cachear arquivos conforme eles são solicitados
        console.log('Cache de arquivos estáticos configurado para interceptar requisições');

    } catch (error) {
        console.log('Erro ao configurar cache estático:', error);
    }
}

self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');


    event.waitUntil(
        Promise.all([
            // Cacheia URLs essenciais
            caches.open(CACHE_NAME)
                .then(cache => cache.addAll(ESSENTIAL_URLS))
                .catch(err => {
                    console.log('Erro ao cachear URLs essenciais:', err);
                    return Promise.resolve();
                }),

            // Configura cache para arquivos estáticos
            cacheAllStaticFiles(),

            // Força ativação imediata
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    event.waitUntil(
        Promise.all([
            // Limpa caches antigos
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
                            console.log('Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),

            // Toma controle imediato
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    // Se é um arquivo estático (/static/), cacheia automaticamente
    if (url.pathname.startsWith('/static/')) {
        event.respondWith(
            caches.open(STATIC_CACHE).then(cache => {
                return cache.match(request).then(response => {
                    if (response) {
                        console.log('Servindo do cache estático:', url.pathname);
                        return response;
                    }

                    // Se não está no cache, busca e adiciona ao cache
                    return fetch(request).then(fetchResponse => {
                        if (fetchResponse && fetchResponse.status === 200) {
                            console.log('Cacheando arquivo estático:', url.pathname);
                            cache.put(request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    }).catch(err => {
                        console.log('Erro ao buscar arquivo estático:', url.pathname, err);
                        return new Response('Arquivo não encontrado', { status: 404 });
                    });
                });
            })
        );
        return;
    }

    // Para outras requisições (páginas HTML, APIs, etc)
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(request).then(response => {
                if (response) {
                    console.log('Servindo do cache:', url.pathname);
                    return response;
                }

                return fetch(request).then(fetchResponse => {
                    // Cacheia páginas HTML e APIs que funcionaram
                    if (fetchResponse && fetchResponse.status === 200 &&
                        (request.method === 'GET') &&
                        (request.headers.get('accept').includes('text/html') ||
                            url.pathname.startsWith('/api/'))) {
                        console.log('Cacheando página/API:', url.pathname);
                        cache.put(request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        }).catch(err => {
            console.log('Erro no service worker:', err);
            return fetch(request);
        })
    );
});

// Limpa cache quando necessário (opcional)
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            }).then(() => {
                console.log('Todos os caches foram limpos');
                event.ports[0].postMessage({ success: true });
            })
        );
    }
});