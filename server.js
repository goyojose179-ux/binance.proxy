const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta de salud solicitada por el bot
app.get('/health', (req, res) => {
    res.json({ status: "ok", message: "Proxy de Binance activo y funcionando" });
});

app.get('/', (req, res) => {
    res.send('Proxy de Binance activo.');
});

// Proxy para /api, /sapi y /bapi con soporte de headers y ruta completa
app.use(
    ['/api', '/sapi', '/bapi'],
    createProxyMiddleware({
        target: 'https://api.binance.com',
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            // Agrega el header de idioma si es necesario
            proxyReq.setHeader('lang', 'en');
        }
    })
);

app.listen(PORT, () => {
    console.log(`Proxy corriendo en el puerto ${PORT}`);
});
