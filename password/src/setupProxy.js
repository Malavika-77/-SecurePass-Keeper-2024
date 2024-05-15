const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/addpassword',
        createProxyMiddleware({
            target: 'https://securepass-keeper-2024-1.onrender.com',
            changeOrigin: true,
        })
    );
    app.use(
        '/fetchdata',
        createProxyMiddleware({
            target: 'https://securepass-keeper-2024-1.onrender.com',
            changeOrigin: true,
        })
    );
};
