const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const BINANCE_HOSTS = {
"/api/": "api.binance.com",
"/sapi/": "api.binance.com",
"/bapi/": "p2p.binance.com",
"/wapi/": "api.binance.com",
};

app.all("/*", async (req, res) => {
const path = req.path;

if (path === "/" || path === "/health") {
return res.json({ status: "ok", service: "binance-proxy", time: Date.now() });
}

let targetHost = "api.binance.com";
for (const [prefix, host] of Object.entries(BINANCE_HOSTS)) {
if (path.startsWith(prefix)) {
targetHost = host;
break;
}
}

const targetUrl = `https://${targetHost}${path}${
Object.keys(req.query).length > 0
? "?" + new URLSearchParams(req.query).toString()
: ""
}`;

const headers = {
"Content-Type": req.headers["content-type"] || "application/json",
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
Accept: "*/*",
"Accept-Language": "en-US,en;q=0.9",
Origin: "https://www.binance.com",
Referer: "https://www.binance.com/",
lang: "en",
clientType: "web",
};

if (req.headers["x-mbx-apikey"]) {
headers["X-MBX-APIKEY"] = req.headers["x-mbx-apikey"];
}

const options = { method: req.method, headers };

if (req.method === "POST" || req.method === "PUT") {
if (typeof req.body === "object") {
options.body = JSON.stringify(req.body);
} else if (typeof req.body === "string") {
options.body = req.body;
}
}

try {
const response = await fetch(targetUrl, options);
const text = await response.text();
res.status(response.status).send(text);
} catch (error) {
res.status(502).json({ error: error.message });
}
});

app.listen(PORT, () => {
console.log(`Binance proxy running on port ${PORT}`);
});
