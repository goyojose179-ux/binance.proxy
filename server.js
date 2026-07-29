const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Proxy de Binance activo y funcionando correctamente.');
});

app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://api.binance.com',
        changeOrigin: true,
        pathRewrite: {
            '^/api': '',
        },
    })
);

app.listen(PORT, () => {
    console.log(`Proxy corriendo en el puerto ${PORT}`);
});
