const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const API_BACKEND = "https://oj.ebg.tw"
//const API_BACKEND = "http://163.18.23.118"

const app = express();
app.use('/api',createProxyMiddleware({ target: API_BACKEND, changeOrigin: true, headers: {referer: API_BACKEND}}));
app.use('/public',createProxyMiddleware({ target: API_BACKEND, changeOrigin: true, headers: {referer: API_BACKEND}}));
var port = 55688;
app.listen(port);