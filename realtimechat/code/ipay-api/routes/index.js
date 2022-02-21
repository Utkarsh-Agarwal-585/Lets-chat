var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { example: 'Node Express JS: Socket.IO Module',
                        title:  'Socket.IO Module' });
});

module.exports = router;
