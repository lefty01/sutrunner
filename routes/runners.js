const express = require('express');
const assert = require('assert');
const router = express.Router();
const debug_app = require('debug')('sutrunners:runners');

/*
 * GET runnerlist.
 */
router.get('/runnerlist', function(req, res) {
    var db = req.db;
    var collection = db.get('runnerlist');
    collection.find({}, { fields: {}, sort : {startnum : 1} }, function(err, docs) {
        return res.json(docs);
    });
});

// >db.userdetails.find({"education":"M.C.A."},{"user_id" : 1,"password":1,"date_of_join":1}).pretty();

router.get('/starterlist', function(req, res) {
    var db = req.db;
    var collection = db.get('runnerlist');

    collection.find({}, {fields: { _id: 0,
				   startnum : 1,
                                   duvid : 1,
                                   firstname : 1,
                                   lastname : 1,
                                   nationality : 1,
                                   residence : 1,
                                   club : 1,
                                   catger : 1
                                 }, sort : {startnum : 1}
                        }, function(err, docs) {
                            console.log(docs);
                            return res.json(docs);
    });
});

router.get('/starter_html', function(req, res) {
    //var db = req.db;
    //var collection = db.get('runnerlist');

});


/*
 * GET single user.
 */
router.get('/getuser/:id', function(req, res) {
  if (! (req.session.loggedIn && req.session.isAdmin)) {
    debug_app('not logged in');
    return res.render('login');
  }

  var db = req.db;
  var collection = db.get('runnerlist');
  console.log("runners document id: " + req.params.id);
  collection.findOne({_id: req.params.id}, function(err, docs) {
    if (err === null) {
      return res.json(docs);
    }
    else {
      return res.json({msg: 'error: ' + err});
    }
  });
});



/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  if (! (req.session.loggedIn && req.session.isAdmin)) {
    debug_app('not logged in');
    return res.render('login');
  }

  var db = req.db;
  var collection = db.get('runnerlist');

  req.body.startnum = parseInt(req.body.startnum);
  console.log("/runners/adduser: startnum=" + req.body.startnum);

  collection.insert(req.body, function(err, result) {
    assert.equal(err, null);
        
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
  if (! (req.session.loggedIn && req.session.isAdmin)) {
    debug_app('not logged in');
    return res.render('login');
  }

  var db = req.db;
  var collection = db.get('runnerlist');
  var runnerToDelete = req.params.id;
  collection.remove({ '_id' : runnerToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/*
 * PUT / update runner info
 */
router.put('/update/:id', function(req, res) {
  if (! (req.session.loggedIn && req.session.isAdmin)) {
    debug_app('not logged in');
    return res.render('login');
  }

  var db = req.db;
  var collection = db.get('runnerlist');
  var runnerToUpdate = req.params.id;

  console.log("Update runner: ID=" + runnerToUpdate);
  //console.log("/runners/update: typeof startnum: " + (typeof req.body.startnum));
  console.log(JSON.stringify(req.body));

  req.body.startnum = parseInt(req.body.startnum);
  //var newvalues = { $set: req.body };

  collection.update({ _id: runnerToUpdate}, req.body, {replaceOne: true}, function(err, result) {
    console.log("error: " + err);
    console.log(JSON.stringify(result));
    // {"n":1,"nModified":1,"ok":1}
    //if (result.nModified === 1)
    return res.send((err === null) ? { msg: 'modified: ' + result.nModified } : { msg:'error: ' + err });
  });
});


module.exports = router;
