const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/add',
        createProxyMiddleware({
            target: 'http://localhost:10000',
            changeOrigin: true,
        })
    );
    app.use(
        '/fetch',
        createProxyMiddleware({
            target: 'http://localhost:10000',
            changeOrigin: true,
        })
    );
};
