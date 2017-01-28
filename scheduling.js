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

exports.startSingle = (id, callback, rule) => {
  var date = new Date(rule.year, 
                      rule.month, 
                      rule.day, 
                      rule.hour, 
                      rule.minute,
                      0);
  console.log("ID " + id + " will fire at: " + date);
  var j = schedule.scheduleJob(id.toString(), date, callback);
  
  if (j == null) {
    console.log("JOB was not created, why? (is it in the past??)");
  }
  else {
    allJobs.push(j);
  }
}


exports.startRecurrent = (id, callback, rule) => {
  var r = new schedule.RecurrenceRule();
  
  r.hour   = parseInt(rule.hour);
  r.minute = parseInt(rule.minute);
  
  if (parseInt(rule.alldays) === 0) {
    r.dayOfWeek = parseInt(rule.day);
    console.log("ID " + id + " will fire day of week " + rule.day + " at: " + rule.hour + ":" + rule.minute);
  }
  else {
    console.log("ID " + id + " will fire all days at: " + rule.hour + ":" + rule.minute);
  }
  
  var j = schedule.scheduleJob(id.toString(), r, callback);
  

  if (j == null) {
    console.log("JOB was not created, why?");
  }
  else {
    allJobs.push(j);
  }
}

