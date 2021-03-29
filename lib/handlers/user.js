/**
 * User handlers
 */

// Dependencies
const _data = require('../data');
const helpers = require('../helpers');
const { verifyToken } = require('./token');

// Instantiate the user's method handler
const user = {};

// User - POST
// Required data: firstName, lastName, email, streetAddress, password
// Optional data: none
user.post = (data, callback) => {
  const { payload } = data;

  // Validate the input data
  const firstName =
    typeof payload.firstName === 'string' && payload.firstName.length > 0
      ? payload.firstName.trim()
      : false;
  const lastName =
    typeof payload.lastName === 'string' && payload.lastName.length > 0
      ? payload.lastName.trim()
      : false;
  const email =
    typeof payload.email === 'string' &&
      payload.email.trim().indexOf('@') > -1 &&
      payload.email.trim().split('@')[1].indexOf('.') > -1
      ? payload.email.trim()
      : false;
  const password =
    typeof payload.password === 'string' &&
      payload.password.trim().length > 8 &&
      helpers.checkPassword(payload.password)
      ? payload.password
      : false;
  const streetAddress =
    typeof payload.streetAddress === 'string' &&
      payload.streetAddress.trim().length > 0
      ? payload.streetAddress.trim()
      : false;

  if (firstName && lastName && email && streetAddress && password) {
    _data.read('users', email, (err, _) => {
      const hashPassword = helpers.hash(password);
      if (hashPassword) {
        const userObject = {
          firstName,
          lastName,
          email,
          streetAddress,
          hashPassword,
        };

        if (err) {
          _data.create('users', email, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: 'Could not create file for the current user',
              });
            }
          });
        } else {
          callback(403, { Error: 'This email is already used' });
        }
      } else {
        callback(500, { Error: 'Could not hash the password' });
      }
    });
  } else {
    callback(403, { Error: 'Parameters not valid or not properly provided' });
  }
};

// User - GET
// Required data: email, token
// Optional data: none
// TODO: Only authorized user should be able to see their own data
user.get = (data, callback) => {
  const { queries } = data;
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
    verifyToken(token, email, (err) => {
      if (!err) {
        _data.read('users', email, (err, userData) => {
          if (!err && userData) {
            delete userData.password;
            callback(200, userData);
          } else {
            callback(404, { Error: 'Could not find this user' });
          }
        });
      } else {
        callback(403, { Error: 'Invalid token for user' })
      }
    });
  } else {
    callback(403, {
      Error: 'Missing or invalid required fields',
    });
  }
};

// User - PUT
// Required data: email, token
// Optional data (collectively required): firstName, lastName, streetAddress, password
// TODO: Only authorized user should be able to edit their own data
user.put = (data, callback) => {
  const { payload } = data;
  // Required data
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

  //Optional data
  const firstName =
    typeof payload.firstName === 'string' && payload.firstName.length > 0
      ? payload.firstName.trim()
      : false;
  const lastName =
    typeof payload.lastName === 'string' && payload.lastName.length > 0
      ? payload.lastName.trim()
      : false;
  const password =
    typeof payload.password === 'string' &&
      payload.password.trim().length > 8 &&
      helpers.checkPassword(payload.password)
      ? payload.password
      : false;
  const streetAddress =
    typeof payload.streetAddress === 'string' &&
      payload.streetAddress.trim().length > 0
      ? payload.streetAddress.trim()
      : false;

  if (email && token) {
    verifyToken(token, email, (err) => {
      if (!err) {
        if (firstName || lastName || streetAddress || password) {
          _data.read('users', email, (err, userData) => {
            if (!err && userData) {
              if (firstName) userData.firstName = firstName;
              if (lastName) userData.lastName = lastName;
              if (streetAddress) userData.streetAddress = streetAddress;
              if (password) userData.hashPassword = helpers.hash(passowrd);
              _data.update('users', email, userData, (err) => {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {
                    Error: "Could not update the user's information",
                  });
                }
              });
            } else {
              callback(404, { Error: 'Could not find this user' });
            }
          });
        } else {
          callback(403, {
            Error: 'Is required to pass on at least one valid optional parameter',
          });
        }
      } else {
        callback(403, { Error: 'Invalid token for user' });
      }
    })
  } else {
    callback(403, {
      Error: 'Email parameter not valid or not properly provided',
    });
  }
};

// User - Delete
// Required data: email, token
// Optional data: none
// TODO: Only authorized user should be able to delete their own data
user.delete = (data, callback) => {
  const { queries } = data;
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
    verifyToken(token, email, (err) => {
      if (!err) {
        _data.read('users', email, (err, userData) => {
          if (!err && userData) {
            _data.delete('users', email, (err) => {
              if (!err) {
                callback(200);
              } else {
                callback(500, { Error: 'Could not delete the user data' });
              }
            });
          } else {
            callback(404, { Error: 'Could not find this user' });
          }
        });
      } else {
        callback(403, { Error: 'Invalid token for user' });
      }
    });
  } else {
    callback(403, {
      Error: 'Email parameter not valid or not properly provided',
    });
  }
};

module.exports = user;
