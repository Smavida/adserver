const { ObjectId } = require('mongodb');
const dbController = require('../controllers/db.js');
require('dotenv').config();

exports.youtube = async (req, res) => {
    try {
        await dbController.insertBQ({
            id: new ObjectId().toString(),
            createdAt: new Date(),
            booking: req.params.booking,
            type: req.params.type
        }, "tracker_youtube");
    } catch(err) {
        console.log(err);
    }
    return req.query.url ? res.redirect(req.query.url) : res.end("ok");
};