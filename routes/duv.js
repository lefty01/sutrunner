
const request = require('request');
const cheerio = require('cheerio');

const express = require('express');
const router  = express.Router();

const duvdbg = require('debug')('sutrunners:duv');

/*
 * GET duv info.
 */
router.get('/getrunner/:id', function(req, res) {
  if (! (req.session.loggedIn && req.session.isAdmin)) {
    duvdbg('not logged in');
    return res.render('login');
  }

  var duvId = req.params.id.trim().match(/(\d+)/)[1];
  if (! duvId) {
    res.json({error: "none or invalid duvId"});
  }
  console.log("getrunner/id=" + duvId);
  //var data = {};
  getRunner(duvId, function(err, data) {
    //console.log("getRunner data=" + data);
    if (err === null) {
      res.json(data);
    }
    else {
      console.log("getRunner ERROR: " + err);
    }
  });

});


function getRunner(id, callback) {
  const duv_url = "https://statistik.d-u-v.org/getresultperson.php?Language=EN&runner=" + id;
  duvdbg("this is getRunner(), duv_url=" + duv_url);

  request(duv_url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var runnerTable;
      duvdbg(html);

      $('table').each(function(i, table){
	if (2 == i) {
	  runnerTable = table;
	  return false;
	}
	return true;
      });

      var name = [];
      var club;
      var residence;
      var yearofbirth, dateofbirth;
      var catGer, catInt;
      var nationality;
      var homepage;

      $(runnerTable).children("tbody").children("tr").each(function(n, child) {

	var key = $(child).children().eq(0).text().trim();
	var val = $(child).children().eq(1).text().trim();
	duvdbg("key=" + key + ", val=" + val);

	if (val !== "") { // validate via regex eg. /\w+, \w+/
	  if (key === "Name:") {
	    name = val.split(", ");
	    if (typeof name[0] === 'undefined') { return callback("invalid duv entry (no name)", null); }
	    if (typeof name[1] === 'undefined') { return callback("invalid duv entry (no name)", null); }
	    name[0].trim();
	    name[1].trim();
	    duvdbg("lastname=" + name[0] + ", name=" + name[1]);
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
      duvdbg("runnerData returned from DUV: %j", runnerData);
      callback(null, runnerData);
    }
    else {
      console.log("error: could not load data from url");
      callback("could not load data from url", null);
    }
  });
};


module.exports = router;
