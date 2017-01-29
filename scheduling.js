var schedule = require('node-schedule');

var allJobs = [];


exports.stopAll = () => {
  
  console.log("Active jobs to stop: " + allJobs.length);
  
  while(allJobs.length > 0)
  {
    j = allJobs.pop();
        
    if (j != null)  j.cancel();
  }
}


exports.startSingle = (id, callback, callBackData, rule) => {
  var date = new Date(rule.year, 
                      rule.month, 
                      rule.day, 
                      rule.hour, 
                      rule.minute,
                      0);
  console.log("ID " + id + " will fire at: " + date);
  var j = schedule.scheduleJob(id.toString(), date, () => {
    callback(callBackData);
  });
  
  if (j == null) {
    console.log("JOB was not created, why? (is it in the past??)");
  }
  else {
    allJobs.push(j);
  }
}


exports.startRecurrent = (id, callback, callBackData, rule) => {
  var r = new Object();
  
  r.hour   = parseInt(rule.hour);
  r.minute = parseInt(rule.minute);
  
  if (parseInt(rule.alldays) === 0) {
    r.dayOfWeek = parseInt(rule.day) + 1;
    console.log("ID " + id + " will fire day of week " + rule.day + " at: " + rule.hour + ":" + rule.minute);
  }
  else {
    console.log("ID " + id + " will fire all days at: " + rule.hour + ":" + rule.minute);
  }
  
  var j = schedule.scheduleJob(id.toString(), r, () => {
    callback(callBackData);
  });

  if (j == null) {
    console.log("JOB was not created, why?");
  }
  else {
    allJobs.push(j);
  }
}

function genericJobCallBack(cbData) {
  console.log("JOB HAS FIRED!!!!!!!");
  console.log(cbData);
}


exports.scheduleAllJobs = (rows) => {

  this.stopAll();

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    row.rule = JSON.parse(row.rule);

    if (row.active != 1)
    {
      console.log("ID " + row.id + " is not active, skipping...");
      continue;
    }

    if (row.recurrent === 0)
    {
      this.startSingle(row.id, genericJobCallBack, row, row.rule);
    }
    else {
      this.startRecurrent(row.id, genericJobCallBack, row, row.rule);
    }
  }
}
