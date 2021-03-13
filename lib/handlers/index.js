/*
 * Main handlers file
 */

// Dependencies
const _user = require('./user');
const _token = require('./token');
const _menu = require('./menu');

// Instantiate handlers
const handlers = {};

// Handle not found requests
handlers.pageNotFound = (_, callback) => {
  callback(404);
};

// Handler the /user path
handlers.user = (data, callback) => {
  if (['get', 'post', 'put', 'delete'].indexOf(data.method) > -1) {
    _user[data.method](data, callback);
  } else {
    callback(405, { Error: 'Method not valid' });
  }
};

handlers.token = (data, callback) => {
  if (['get', 'post', 'delete'].indexOf(data.method) > -1) {
    _token[data.method](data, callback);
  } else {
    callback(405, { Error: 'Method not valid' });
  }
};

handlers.menu = (data, callback) => {
  if (['get'].indexOf(data.method) > -1) {
    _menu[data.method](data, callback);
  } else {
    callback(405, { Error: 'Method not valid' });
  }
};

module.exports = handlers;
