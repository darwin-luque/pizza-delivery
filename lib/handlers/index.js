/*
 * Main handlers file
 */

// Dependencies
const _user = require('./user')

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
        callback(204, {Error: 'Method not valid'});
    }
};

module.exports = handlers;
