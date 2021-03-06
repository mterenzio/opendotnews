var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var cheerio = require('cheerio');

router.get('/', function(req, res) {
    res.render('index', { title: 'home' });
});

router.get('/c/s/:domain/:path*', function(req, res) {
    var domain = req.params.domain,
	headpath = req.params.path,
	tailpath = req.params[0];
    var options = {
	host: domain,
	path:'/' +  headpath + tailpath,
	port: 443,
	followAllRedirects: true
    };
    var req = https.get(options, function(ampres) {
	console.log('DOMAIN: ' + domain);
	console.log('PATH: ' + headpath + tailpath);
	console.log('STATUS: ' + ampres.statusCode);
	console.log('HEADERS: ' + JSON.stringify(ampres.headers));
	var body = '';
	ampres.on('data', function(chunk) {
	    body += chunk;
	}).on('end', function() {
		$ = cheerio.load(body);
		if ($('html').attr('amp') == "" || $('html').attr('⚡') == "") {
			res.send(body);
		} else {
			var err = new Error('Not Found');
			err.status = 404;
			res.render('error', {
				message: err.message,
				error: err
			});
		}
	})
    });
    req.on('error', function(e) {
	console.log('ERROR: ' + e.message);
    });
});

router.get('/c/:domain/:path*', function(req, res) {
	var domain = req.params.domain,
			headpath = req.params.path,
			tailpath = req.params[0];
	var options = {
		host: domain,
		path:'/' +  headpath + tailpath,
		port: 80,
		followAllRedirects: true
	};
	var req = http.get(options, function(ampres) {
		console.log('DOMAIN: ' + domain);
		console.log('PATH: ' + headpath + tailpath);
		console.log('STATUS: ' + ampres.statusCode);
		console.log('HEADERS: ' + JSON.stringify(ampres.headers));
		var body = '';
		ampres.on('data', function(chunk) {
			body += chunk;
		}).on('end', function() {
			res.send(body);
		})
	});
	req.on('error', function(e) {
		console.log('ERROR: ' + e.message);
	});
});

module.exports = router;
