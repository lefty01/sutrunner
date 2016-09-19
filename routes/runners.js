var express = require('express');
var assert = require('assert');
var router = express.Router();

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({}, {}, function(err, docs) {
        res.json(docs);
    });
});

// >db.userdetails.find({"education":"M.C.A."},{"user_id" : 1,"password":1,"date_of_join":1}).pretty();

router.get('/starterlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');

    collection.find({}, {fields: { _id: 0,                         
                                   duvid : 1,
                                   firstname : 1,
                                   lastname : 1,
                                   nationality : 1,
                                   residence : 1,
                                   club : 1,
                                   catger : 1
                                 }
                        }, function(err, docs) {
                            console.log(docs);
                            res.json(docs);
    });
});

router.get('/starter_html', function(req, res) {
    //var db = req.db;
    //var collection = db.get('userlist');

});


/*
 * GET single user.
 */
router.get('/getuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    console.log("runners document id: " + req.params.id);
    collection.findOne({_id: req.params.id}, function(err, docs) {
	if (err === null) {
	    res.json(docs);
	}
        else {
	    res.json({msg: 'error: ' + err});
	}
    });
});



/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
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
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT / update runner info
 */
/* put or patch !?! FIXME */
router.put('/update/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var runnerToUpdate = req.params.id;

    console.log("Update runner: ID=" + runnerToUpdate);
        
    //collection.findOneAndUpdate({ '_id' : runnerToUpdate }, function(err, data) {
    //});

    collection.update({ _id: runnerToUpdate}, req.body, function(err, cnt, stat){
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
        console.log("update  count=" + cnt);
        console.log("update status=" + stat);
    });
    
});


module.exports = router;
