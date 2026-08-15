const http = require('http');

const data = JSON.stringify({
  email: 'manum66466@gmail.com',
  password: 'Manumanoj$14'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('SET-COOKIE:', res.headers['set-cookie']);
    console.log('BODY:', body);
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
