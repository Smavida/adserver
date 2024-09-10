const express = require('express');
const hbs = require('hbs');
require('dotenv').config({});
const routes = require('./routes/index.js');
const port = process.env.PORT || 8080;
process.on('unhandledRejection', function(reason, p) {
    console.log("Unhandled Rejection:", reason.stack);
});
var app = express();
app.set('trust proxy', true);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
const partialDir = __dirname + '/views/partials';
hbs.registerPartials(partialDir);
app.use(routes);
app.listen(port);
console.log(`Server started at ${new Date()} on http://localhost:${port}`);

