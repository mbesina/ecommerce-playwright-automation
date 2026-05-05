import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 4173);

const users = new Map([
  [
    'maybuyer@example.com',
    {
      email: 'maybuyer@example.com',
      password: 'Password123!',
      firstName: 'May',
      lastName: 'Buyer'
    }
  ]
]);

const products = [
  { id: 'penguin-key-chain', name: 'Penguin key chain', price: 12 },
  { id: 'penguin-eco-bag', name: 'Penguin eco bag', price: 18 },
  { id: 'penguin-medium-plush-toy', name: 'Penguin medium plush toy', price: 34 },
  { id: 'penguin-travel-neck-pillow', name: 'Penguin Travel Neck Pillow', price: 42 }
];

function sendJson(response, status, data = {}) {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(status === 204 ? undefined : JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('error', reject);
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });
  });
}

function serveStatic(request, response) {
  const requestPath = request.url === '/' ? '/products.html' : request.url;
  const filePath = path.join(__dirname, decodeURIComponent(requestPath.split('?')[0]));

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403);
    response.end();
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const extension = path.extname(filePath);
    const contentType =
      {
        '.css': 'text/css',
        '.html': 'text/html',
        '.js': 'text/javascript'
      }[extension] ?? 'application/octet-stream';
    response.writeHead(200, { 'content-type': contentType });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  try {
    if (url.pathname === '/health' && request.method === 'GET') {
      sendJson(response, 200, { status: 'ok', productCount: products.length });
      return;
    }

    if (url.pathname === '/api/products' && request.method === 'GET') {
      sendJson(response, 200, products);
      return;
    }

    if (url.pathname === '/api/login' && request.method === 'POST') {
      const body = await readBody(request);
      const user = users.get(body.email);
      if (!user || user.password !== body.password) {
        sendJson(response, 401, { message: 'Invalid email or password' });
        return;
      }
      sendJson(response, 200, { email: user.email, firstName: user.firstName, lastName: user.lastName });
      return;
    }

    if (url.pathname === '/api/users' && request.method === 'POST') {
      const body = await readBody(request);
      users.set(body.email, body);
      sendJson(response, 201, { ok: true });
      return;
    }

    if (url.pathname.startsWith('/api/users/') && request.method === 'DELETE') {
      users.delete(decodeURIComponent(url.pathname.replace('/api/users/', '')));
      sendJson(response, 204);
      return;
    }

    if (url.pathname === '/api/orders' && request.method === 'POST') {
      const body = await readBody(request);
      if (!body.items?.length || !body.shipping) {
        sendJson(response, 400, { message: 'Cart and shipping address are required' });
        return;
      }
      sendJson(response, 201, { orderId: `ORD-${Date.now()}` });
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    sendJson(response, 400, { message: error instanceof Error ? error.message : 'Bad request' });
  }
});

server.listen(port, host, () => {
  console.warn(`Mock ecommerce app listening on http://${host}:${port}`);
});
