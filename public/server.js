const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/api',createProxyMiddleware({ target: 'https://oj.mozix.ebg.tw', changeOrigin: true , secure: false}));
app.use('/public',createProxyMiddleware({ target: 'https://oj.mozix.ebg.tw', changeOrigin: true , secure: false}));
var port = 8080;
app.listen(port);