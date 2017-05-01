var request = require('request');
var cheerio = require('cheerio');
var app       = require('express')();
var http      = require('http').Server(app);
var path      = require('path');
var fs        = require('fs');
var express     = require('express');
var bodyParser  = require('body-parser');
var validator   = require('validator');

/* Setting app properties */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express').static(__dirname+'/public'));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

/* Setting up database configuration */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/owapi';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
        db = databaseConnection;
});
var collection_name = "player_data";

var ft_stats = [];
var featured_stats = {};

app.post('/submit', function(req, res) {
        var username = req.body.username.replace(/[^\w\s]/gi, '');
        var platform = req.body.platform.replace(/[^\w\s]/gi, '');
        var url      = 'https://playoverwatch.com/en-us/career/' + platform + '/' + username;

        request(url, function(error, response, html) {
                if (!error) {
                        var $ = cheerio.load(html);
                        $('h3.card-heading').each(function(i, element) {
                                ft_stats[i] = (element.children[0].data);
                        });
                        get_ft_stats();
                        res.send(featured_stats);
                        console.log("Hi there");
                } else {
                        // TODO: Send error response
                }
        });
});

/*
 * get_ft_stats
 * Populates featured_stats object with scraped data
 */
function get_ft_stats() {
        featured_stats.eliminations = ft_stats[0];
        featured_stats.damage_done  = ft_stats[1];
        featured_stats.deaths       = ft_stats[2];
        featured_stats.final_blows  = ft_stats[3];
        featured_stats.healing      = ft_stats[4];
        featured_stats.obj_kills    = ft_stats[5];
        featured_stats.obj_time     = ft_stats[6];
        featured_stats.solo_kills   = ft_stats[7];
}

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on port:3000');
});