const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/tracker.js');
const youtubeController = require('../controllers/youtube.js');

router.get('/favicon.ico', (req, res) => {
    return res.status(200).end();
});

router.get('/_ah/health', (req, res) => {
    return res.status(200).end();
});

router.get('/_ah/warmup', (req, res) => {
    return res.status(200).end();
});

router.get('/youtubeUpload', youtubeController.youtubeUpload);

router.get('/trk/youtube/:booking/:type', trackerController.youtube);

router.get('/', (req, res) => {
    return res.render('index.hbs', {
        content: 'I am the content',
    });
});

router.get('*', (req, res) => {
    return res.end('404 - Page not found');
});

module.exports = router;
