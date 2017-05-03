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
    res.sendFile(__dirname + '/index.html');
});

/* Setting up database configuration */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/owapi';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
        db = databaseConnection;
});
var collection_name = "player_data";

var player_stats = {
        top_heroes     : {
                names : [],
                times : []
        },
        featured_stats : {}
};

/* Main GET route for the RESTful API */
app.get('/query', function(req, res) {
        var username = req.query.username.replace(/[^\w\s]/gi, '');
        var platform = req.query.platform.replace(/[^\w\s]/gi, '');
        var url      = 'https://playoverwatch.com/en-us/career/' + platform + '/' + username;

        request(url, function(error, response, html) {
                if (!error) {
                        // Cheerio.js module, loads HTML
                        var $ = cheerio.load(html);

                        // Load in 'Featured Stats'
                        get_ft_stats($);

                        // Load in 'Top Heroes'
                        get_top_heroes($);

                        // Send player_stats as response
                        res.send(player_stats);
                } else {
                        res.send("Error");
                }
        });
});

/*
 * get_top_heroes
 * Loads top_heroes member of player_stats
 */
function get_top_heroes($)
{
        $('div.bar-text div.title').each(function(i, element) {
                if (i < 5) {
                        player_stats.top_heroes.names.push(element.children[0].data);
                }
        });
        $('div.bar-text div.description').each(function(i, element) {
                if (i < 5) {
                        player_stats.top_heroes.times.push(element.children[0].data);
                }
        });
}

/*
 * get_ft_stats
 * Loads featured_stats member of player_stats; wrapper function
 */
function get_ft_stats($)
{
        $('h3.card-heading').each(function(i, element) {
                load_ft_stats(i, element);
        });
}

/*
 * load_ft_stats
 * Loads appropriate values into featured_stats member of player_stats
 */
function load_ft_stats(i, element)
{
        if (i == 0) {
                player_stats.featured_stats.eliminations = element.children[0].data;
        } else if (i == 1) {
                player_stats.featured_stats.damage_done = element.children[0].data;
        } else if (i == 2) {
                player_stats.featured_stats.deaths = element.children[0].data;
        } else if (i == 3) {
                player_stats.featured_stats.final_blows = element.children[0].data;
        } else if (i == 4) {
                player_stats.featured_stats.healing = element.children[0].data;
        } else if (i == 5) {
                player_stats.featured_stats.obj_kills = element.children[0].data;
        } else if (i == 6) {
                player_stats.featured_stats.obj_time = element.children[0].data;
        } else if (i == 7) {
                player_stats.featured_stats.solo_kills = element.children[0].data;
        }
}


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on port:3000');
});