const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/add',
        createProxyMiddleware({
            target: 'https://securepass-keeper-2024-1.onrender.com',
            changeOrigin: true,
        })
    );
    app.use(
        '/fetch',
        createProxyMiddleware({
            target: 'https://securepass-keeper-2024-1.onrender.com',
            changeOrigin: true,
        })
    );
};
