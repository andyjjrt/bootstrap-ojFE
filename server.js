const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_BACKEND = ""

const app = express();
app.use('/api',createProxyMiddleware({ target: API_BACKEND, changeOrigin: true, headers: {referer: API_BACKEND}}));
app.use('/public',createProxyMiddleware({ target: API_BACKEND, changeOrigin: true, headers: {referer: API_BACKEND}}));
var port = 55688;
app.listen(port);