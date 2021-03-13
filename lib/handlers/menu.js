/**
 * Menu handlers
 */

const _data = require('../data');
const { verifyToken } = require('./token');

// Instantiate the module
const menu = {};

// Menu - GET
// Required data: email, token
// Optional data: none
menu.get = (data, callback) => {
  const { queries } = data;

  // Check data
  const email =
    typeof queries.email === 'string' &&
    queries.email.trim().indexOf('@') > -1 &&
    queries.email.trim().split('@')[1].indexOf('.') > -1
      ? queries.email.trim()
      : false;
  const token =
    typeof queries.token === 'string' && queries.token.trim().length === 20
      ? queries.token.trim()
      : false;

  if (email && token) {
    _data.read('users', email, (err, userData) => {
      if (!err && userData) {
        verifyToken(token, email, (err) => {
          if (!err) {
            _data.read('menu', 'menu', (err, menuData) => {
              if (!err && menuData) {
                callback(200, menuData);
              } else {
                callback(500, { Error: 'Could not read the menu data' });
              }
            });
          } else {
            callback(403, { Error: err });
          }
        });
      } else {
        callback(404, { Error: 'User not found' });
      }
    });
  } else {
    callback(403, { Error: 'Invalid or missing parameters' });
  }
};

module.exports = menu;
