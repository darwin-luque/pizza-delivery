/**
 * Menu handlers
 */

const _data = require('../data');

// Instantiate the module
const menu = {};

// Menu - GET
// Required data: email, token
// Optional data: none
menu.get = (data, callback) => {
  const { queries } = data;

  // Check data
  const email =
    typeof payload.email === 'string' &&
    payload.email.trim().indexOf('@') > -1 &&
    payload.email.trim().split('@')[1].indexOf('.') > -1
      ? payload.email.trim()
      : false;
  const token =
    typeof queries.token === 'string' && queries.token.trim().length === 20
      ? queries.token.trim()
      : false;

  if (email && token) {
    _data.read('users', email, (err, userData) => {
      if (!err && userData) {
        if (userData.token === token) {
          _data.read('menu', 'menu', (err, menuData) => {
            if (!err && menuData) {
              callback(200, menuData);
            } else {
              callback(500, { Error: 'Could not read the menu data' });
            }
          });
        } else {
          callabck(403, { Error: 'User is not the owner of this token' });
        }
      } else {
        callback(404, { Error: 'User not found' });
      }
    });
  } else {
    callback(403, { Error: 'Invalid or missing parameters' });
  }
};

module.exports = menu;
