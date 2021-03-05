/*
 * Main File for the Pizza Delivery API 
 */

// Dependencies
const _server = require('./lib/server');

const app = {};

// Initialize app
app.init = () => {
    // Initialize server
    _server.init();
};

app.init();

module.exports = app;
