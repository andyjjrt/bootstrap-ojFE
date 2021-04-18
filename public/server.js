var express = require('express');
var proxy = require('http-proxy-middleware');
var path = require('path');
var serveStatic = require('serve-static');
app = express();
app.use(serveStatic(__dirname));
app.use(
  '/api',
  proxy({ target: 'https://oj.mozix.ebg.tw', changeOrigin: true ,secure: false})
);
app.use(
    '/public',
    proxy({ target: 'https://oj.mozix.ebg.tw', changeOrigin: true ,secure: false})
  );
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);