
var request = require('request');
var cheerio = require('cheerio');

var express = require('express');
var router  = express.Router();

/*
 * GET duv info.
 */
router.get('/getrunner/:id', function(req, res) {
    var duvId = req.params.id.trim().match(/(\d+)/)[1];
    if (! duvId) {
	res.json({error: "none or invalid duvId"});
    }
    console.log("getrunner/id=" + duvId);
    //var data = {};
    getRunner(duvId, function(err, data) {
	//console.log("getRunner err=" + err);
	//console.log("getRunner data=" + data);
	if (err === null) {
	    res.json(data);
	}
    });
    

    //res.json(data);
	// if (err === null) {
	//     //res.json(res);
	//     console.log("duv.js:/getrunner/:id route, res=" + res);
	// }
        // else {
	//     res.json({error: err});
	// }
    //});
    
});


function getRunner(id, callback) {

    var duv_url = "http://statistik.d-u-v.org/getresultperson.php?Language=EN&runner=" + id;
    //var runnerData = {};
    console.log("this is getRunner(), duv_url=" + duv_url);
    request(duv_url, function (error, response, html) {
	if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    var runnerTable;
	    //console.log(html);
	    $('table').each(function(i, table){
		if (2 == i) {
		    runnerTable = table;
		    return false;
		}
		return true;
	    });

	    var name;
	    var club;
	    var residence;
	    var yearofbirth, dateofbirth;
	    var catGer, catInt;
	    var nationality;
	    var homepage;
	    
	    $(runnerTable).children().each(function(n, child) {
		var key = $(child).children().eq(0).text().trim();
		var val = $(child).children().eq(1).text().trim();

		if (val !== "") {
		    if (key === "Name:") {
			name = val.split(", ");
			name[0].trim();
			name[1].trim();
		    }
		    if (key === "Club:") club = val.trim();
		    if (key === "Residence:") residence = val.trim();
		    if (key === "Year of birth:") {
			yearofbirth = val.trim();
			var reg1 = /^\(Cat. german: (.+)\)$/;
			catGer = $(child).children().last().text().trim().match(reg1)[1];
		    }
		    if (key === "Date of birth:") {
			var reg2 = /^\(Cat. internat.: (.+)\)$/;
			dateofbirth = val;
			catInt = $(child).children().last().text().trim().match(reg2)[1];
		    }
		    if (key === "Nationality:") nationality = val.trim();
		    if (key === "Homepage:") homepage = val.trim();
		}
	    });
	    if ("" === name[0]) {
		//return null;
		callback("invalid duv entry", null);
	    }
	    var runnerData = {
		'duvid': id,
		'name' : name[0],
		'firstname' : name[1],
		'club' : club,
		'residence' : residence,
		'yearofbirth' : yearofbirth,
		'dateofbirth' : dateofbirth,
		'catger' : catGer,
		'catint' : catInt,
		'nationality' : nationality,
		'homepage' : homepage
	    };
	    console.log("runnerData returned from DUV:" + runnerData);
	    callback(null, runnerData);
	}
	else {
	    console.log("error: could not load data from url");
	    callback("could not load data from url", null);
	}
    });
    //console.log("duv/getrunner calling callback with data=" + runnerData);
    
    //return runnerData;
};


module.exports = router;

