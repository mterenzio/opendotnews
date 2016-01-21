var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/c/(s/)+/+', function(req, res, next) {
  res.render('index', { title: 'AMP!' });
});

module.exports = router;
