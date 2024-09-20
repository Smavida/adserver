const g = require('./global.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const compression = require('compression');
const hbs = require('hbs');
require('dotenv').config({});
const routes = require('./routes/index.js');
const port = process.env.PORT || 8080;
process.on('unhandledRejection', function(reason, p) {
    console.log("Unhandled Rejection:", reason.stack);
});
var app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(compression());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
const partialDir = __dirname + '/views/partials';
hbs.registerPartials(partialDir);
app.use(routes);


/**
 *	Listening
 */

 var db = mongoose.connection;

 db.on('connecting', function () {
     // console.log('connecting to MongoDB...');
 });
 
 db.on('error', function (error) {
     // console.error('Error in MongoDb connection: ' + error);
     mongoose.disconnect();
 });
 
 db.on('connected', function () {
     // console.log('MongoDB connected!');
 });
 
 db.once('open', function () {
     // console.log('MongoDB connection opened!');
 });
 
 db.on('reconnected', function () {
     // console.log('MongoDB reconnected!');
 });
 
 db.on('disconnected', function () {
     // console.log('MongoDB disconnected!');
     mongoose.connect(process.env.MONGODB_URI);
 });
 
 //Listen to port 8080 or heroku environmental port variable
 mongoose
     .connect(process.env.MONGODB_URI)
     .then(() => {
         g.server = app.listen(port);
         console.log('Server started on http://localhost:' + port + ' at ' + new Date());
     })
     .catch((err) => console.log("MongoDB connection error in index.js"));

