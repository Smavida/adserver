const express = require('express');
const router = express.Router();

router.get('/favicon.ico', (req, res) => {
    return res.end();
});

router.get('/_ah/health', (req, res) => {
    return res.end();
});

router.get('/_ah/warmup', (req, res) => {
    return res.end();
});

router.get('/', (req, res) => {
    return res.render("index.hbs", {
        content: "I am the content"
    });
});

router.get('*', (req, res) => {
    return res.end("404 - Page not found");
});

module.exports = router;