/**
 * Created by johnsoftek on 22 Jul 2015
 */

require('./init');
var expect = require('chai').expect;

var Multi1, Multi2, db, db2;

describe("SQLite multi-file test", function(){

  before('Create connection and User2 model definition', function () {
    db  = getDataSource();
    db2 = getDataSource2();

    Multi1 = db.define('Multi1', {
      id: {type: Number, id: true},
      name: { type: String },
      email: { type: String }
    });
    Multi2 = db2.define('Multi2', {
      id: {type: Number, id: true},
      new_name: { type: String }
    });

  });

  it('should create models attached to different datasources in their respective databases', function(done) {

    db.automigrate('Multi1', function () {
      db2.automigrate('Multi2', function () {
        db2.connector.query("SELECT name FROM sqlite_master where type = 'table'", function(err,tables) {
          expect(tables).to.include({ name: 'Multi2' })
          expect(tables).to.not.include({ name: 'Multi1' })
          done();
        })
      });
    });

  });

});
