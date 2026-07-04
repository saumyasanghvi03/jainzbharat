import { createServer } from 'node:http';
const server = createServer((_, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end('<h1>JainZBharat development server</h1>'); });
server.listen(3000, () => console.log('dev server running at http://localhost:3000'));
