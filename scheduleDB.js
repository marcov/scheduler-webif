var sqlite3 = require('sqlite3').verbose();
var db = null;

const db_in_memory = Boolean(false);
const db_file_name = 'database.db';
const schedulesTable = "schedules";

exports.populate = () =>
{
    console.log("TODO");
}

exports.insertSchedule = (insertData, cb) =>
{
  console.log("will insert this: ");
  console.log(insertData);

  // As an array.
  db.run("INSERT INTO " + schedulesTable + " (duration, active, recurrent, rule) " +
         "VALUES (?, ?, ?, ?)", 
         [ insertData.duration, 
           insertData.active,
          insertData.recurrent,
           insertData.rule], 
          function(err) {
            cb(err); 
  });
}

exports.deleteSchedule = (id, cb) =>
{
  // As an array.
  db.run("DELETE FROM " + schedulesTable + " " +
         "WHERE id = ?", [id], 
         function(err) {
          cb(err); 
  });
}

exports.updateSchedule = (id, active, cb) =>
{
  // As an array.
  db.run("UPDATE " + schedulesTable + " SET active = ? WHERE id = ?", [active, id], 
         function(err) {
    cb(err); 
  });
}

exports.init = () =>
{
    if (db_in_memory)
    {
        db = new sqlite3.Database(':memory:');
        populate();
    }
    else
    {
        console.log("Creating db file: " +  db_file_name);
        db = new sqlite3.Database(db_file_name, sqlite3.OPEN_READWRITE);
    }

    //Lets connect to our database using the DB server URL.
    //mongoose.connect('mongodb://localhost/fiobbio');
    console.log("DB inited!");
}


exports.getSchedules = (cb, cbData) =>
{
    console.log("running query...");
    
    db.all("SELECT * FROM " + schedulesTable + "", function(err, rows) {
      cbData.rows = rows;
      cbData.err  = err;
      cb(cbData); 
    });
}

