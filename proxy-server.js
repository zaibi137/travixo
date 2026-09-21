const httpProxy = require('http-proxy');
const http = require('http');
const bodyParser = require('body-parser');

const proxy = httpProxy.createProxyServer({
  target: 'https://TravelAPI.SIDDEV.Online',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/api': '/api'
  }
});

proxy.on('proxyReq', (proxyReq, req, res) => {
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
    console.log('[PROXY] Request:', req.method, req.url);
    console.log('[PROXY] Body:', bodyData);
  }
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  console.log('[PROXY] Response:', proxyRes.statusCode);
});

module.exports = (req, res) => {
  proxy.web(req, res);
};
