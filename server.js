const http = require('http');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  let filePath =
    url.pathname === '/b'
      ? path.join(__dirname, 'preview.html')
      : path.join(__dirname, 'index.html');

  if (url.pathname.startsWith('/dist/')) {
    filePath = path.join(distDir, url.pathname.slice('/dist/'.length));

    if (!filePath.startsWith(`${distDir}${path.sep}`)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const contentType = filePath.endsWith('.js')
      ? 'text/javascript'
      : 'text/html';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(3000, () => {
  console.log('http://localhost:3000/a');
  console.log('http://localhost:3000/b');
});
