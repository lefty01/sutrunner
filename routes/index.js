
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SUT100 - Manage Runners' });
});

// router.get('/main', function(req, res, next) {
//   res.render('main', { title: 'SUT100 - Manage Runners' });
// });


module.exports = router;
