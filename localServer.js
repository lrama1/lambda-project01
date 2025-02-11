const http = require('http');
const { handler } = require('./index');

const server = http.createServer(async (req, res) => {
  // Handle preflight (OPTIONS) requests right away
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    });
    res.end();
    return;
  } else if (req.method === 'POST') {
    let body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', async () => {
      body = Buffer.concat(body).toString();

      const event = {
        // Mimic API Gateway event properties
        httpMethod: req.method,
        headers: req.headers,
        body
      };

      try {
        const result = await handler(event);
        res.writeHead(result.statusCode, {
          ...result.headers,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        });
        res.end(result.body);
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end(JSON.stringify({ message: 'Error invoking Lambda', error: error.message }));
      }
    });
  } else {
    res.writeHead(405, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Local server running at http://localhost:3000');
});
