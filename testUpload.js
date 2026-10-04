const http = require('http');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const postData = 
`--${boundary}\r
Content-Disposition: form-data; name="id"\r
\r
1\r
--${boundary}\r
Content-Disposition: form-data; name="name"\r
\r
vip test\r
--${boundary}\r
Content-Disposition: form-data; name="image"; filename="test.jpg"\r
Content-Type: image/jpeg\r
\r
fake image content\r
--${boundary}--`;

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/admin/resources/update',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => console.log(d.toString()));
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();
