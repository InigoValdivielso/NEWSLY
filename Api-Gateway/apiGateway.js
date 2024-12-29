const http = require('http');
const httpProxy = require('http-proxy');

const port = 2000;
const proxy = httpProxy.createProxyServer({});

// Mapa de rutas y destinos
const routeMap = {
    '/api/python': 'http://127.0.0.1:8000', // API en Python
    '/api/express': 'http://localhost:3000', // API en Express
};

// Crear el servidor HTTP
const server = http.createServer((req, res) => {
    // Buscar el destino correspondiente
    const route = Object.keys(routeMap).find(r => req.url.startsWith(r));
    if (route) {
        req.url = req.url.replace(route, '');
        proxy.web(req, res, { target: routeMap[route] });
        console.log(`Request to ${req.url} proxied to ${routeMap[route]}`);
    } else {
        res.statusCode = 404;
        res.end('Route not found');
    }
});

// Manejo de errores del proxy
proxy.on('error', (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal server error');
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`API Gateway listening on http://localhost:${port}`);
});
