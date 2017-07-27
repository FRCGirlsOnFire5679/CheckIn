var path = require('path')
    , fs = require('fs')
    , knex = require('knex')
    , bookshelf = require('bookshelf')
    , dbFile = path.join(__dirname, '../data/attendance.sqlite')
    , db = null; // bookshelf db instance

// init db
db = bookshelf(knex({
    client: 'sqlite3'
    , connection: { filename: dbFile }
}));

module.exports = db;

