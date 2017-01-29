var express = require('express');
var router  = express.Router();
var db      = require('../scheduleDB.js');
var sk      = require('../scheduling.js');

function renderHomePage(err, renderData) {
  "use strict";
  var res = renderData.httpres;

  if (err) {
    res.send("query failed: " + err);
    return;
  }

  for (var i = 0; i < renderData.rows.length; i++) {
    var row = renderData.rows[i];
    row.rule = JSON.parse(row.rule);
    //console.log(row.rule);
  }
 
  res.render('index',
             {title :      "Scheduler WebIF",
             rows  :      renderData.rows,
             postStatus : renderData.postStatus});
}

/* GET home page. */
router.get('/', function (req, res, next) {
  db.getSchedules({httpres: res}, renderHomePage);
});


/* GET start jobs. */
router.get('/startJobs', function (req, res, next) {
  db.getSchedules({httpres: res}, (err, data) => {
    sk.scheduleAllJobs(data.rows);
    data.httpres.send("All is good!");
  });
});


/* POST */
router.post('/addEntry', function (req, res, next) {
  var rule;
  //console.log("HTTP POST parameters:");
  //console.log(req.body);

  // validation
  if (req.body.duration === "" || 
      !isFinite(req.body.duration)) {
    res.send("Duration must be a number");
    return;
  }
  
  if (req.body.datetime === "") {
    res.send("datetime must not be empty");
    return;
  }
  

  if (req.body.recurrent === "0") {
    var dt = new Date(req.body.date);
    rule = {year   : dt.getFullYear(),
            month  : dt.getMonth(),
            day    : dt.getDate(),
            hour   : req.body.time.split(":")[0],
            minute : req.body.time.split(":")[1]};
  } else {
    rule = {alldays : req.body.alldays, 
            day     : req.body.day,
            hour    : req.body.time.split(":")[0],
            minute  : req.body.time.split(":")[1]};
  }
  
  rule = JSON.stringify(rule);

  db.insertSchedule(
    {duration  : req.body.duration,
     active    : (req.body.active === "on") ? 1 : 0,
     recurrent : req.body.recurrent,
     rule      : rule},
    (err) => {
      if (err !== null) {
        res.send("query failed: " + err);
        return;
      }
    
      db.getSchedules({httpres: res, postStatus : 1}, renderHomePage);
    });
});


router.post('/updateEntry', function (req, res, next) {
  var id;
  var active = (req.body.active === "on") ? 1 : 0;
  var data = JSON.parse(req.body.data);
  
  var updateCompleted = (err) => {
    if (err != null) {
      httpres.send("query failed: " + err);
      return;
    }

    db.getSchedules({httpres: res, postStatus : 1}, renderHomePage);
  };
  
  if (data.action == "update") {    
    console.log("this is an update for id '" + data.id + "' active " + active); 
    db.updateSchedule(data.id, active, updateCompleted);
  }
  else if (data.action == "delete")
  {
    console.log("this is a delete for id " + data.id);
    db.deleteSchedule(data.id, updateCompleted);
  }
  else
  {
    console.log("UNDEFINED");
  }
  
});

module.exports = router;
