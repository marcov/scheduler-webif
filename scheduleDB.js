var sqlite3 = require('sqlite3').verbose();
var db = null;
const fs = require('fs');

const allowDbCreate = Boolean(true);
const dbInMemory = Boolean(false);
const sqliteDb = 'database.sdb';
const sqliteSchema = 'database.sql';
const schedulesTable = "schedules";

exports.createDb = () => {
  try {
    var schemaQuery = fs.readFileSync(sqliteSchema, 'utf8');
  } catch (e) {
    abortWhenFail(e);
  }

  //console.log(schemaQuery);

  db.exec(schemaQuery, abortWhenFail);
}


function abortWhenFail(err) {
  if (!err) return;
 
  console.log(err);
  process.exit(-1);
}

exports.insertSchedule = (insertData, cb) => {
  console.log("will insert this: ");
  console.log(insertData);

  // As an array.
  db.run("INSERT INTO " + schedulesTable + " (duration, active, recurrent, rule) " +
         "VALUES (?, ?, ?, ?)", 
         [ insertData.duration, 
           insertData.active,
          insertData.recurrent,
           insertData.rule], 
          (err) => {
            cb(err);
            if (err) abortWhenFail(err);
          });
}

exports.deleteSchedule = (id, cb) => {
  // As an array.
  db.run("DELETE FROM " + schedulesTable + " " +
         "WHERE id = ?", [id],
          (err) => {
            cb(err);
            if (err) abortWhenFail(err);
          });
}

exports.updateSchedule = (id, active, cb) => {
  // As an array.
  db.run("UPDATE " + schedulesTable + " SET active = ? WHERE id = ?", [active, id], 
          (err) => {
            cb(err);
            if (err) abortWhenFail(err);
          });
}

exports.getSchedules = (cbData, cb) => {
    console.log("running query...");
    
    db.all("SELECT * FROM " + schedulesTable + "", (err, rows) => {
      cbData.rows = rows;
      cb(err, cbData); 
      if (err) abortWhenFail(err);
    });
}


exports.init = () => {
  var create = Boolean(false);

  create = dbInMemory;
 
  if (!create) {
    try {
      fs.statSync(sqliteDb);
    } catch (e) {
      //console.log(e);
      create = allowDbCreate;
    }
  }

  if (!create) {
    console.log("Opening db file: " +  sqliteDb);
    db = new sqlite3.Database(sqliteDb,
                              sqlite3.OPEN_READWRITE,
                              abortWhenFail);
  } else { 
    db = new sqlite3.Database(dbInMemory ? ':memory:' : sqliteDb);
      console.log("Creating DB in memory...");
      this.createDb();
  }

  //Lets connect to our database using the DB server URL.
  console.log("DB inited!");
}

