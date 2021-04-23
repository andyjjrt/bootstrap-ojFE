const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/api',createProxyMiddleware({ target: 'https://oj.ebg.tw/', changeOrigin: true, headers: {referer: 'https://oj.ebg.tw/'}}));
app.use('/public',createProxyMiddleware({ target: 'https://oj.ebg.tw/', changeOrigin: true, headers: {referer: 'https://oj.ebg.tw/'}}));
var port = 3000;
app.listen(port);