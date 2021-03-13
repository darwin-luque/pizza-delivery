/**
 * Token handlers
 */

// Dependencies
const _data = require('../data');
const helpers = require('../helpers');

// Instantieate the token object
const token = {};

// POST - Token
// Required data: email, password
// Optional data: none
token.post = (data, callback) => {
  // Get the payload
  const { payload } = data;

  // Check the data
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

  if (email && password) {
    _data.read('user', email, (err, userData) => {
      if (!err && userData) {
        const hashPassword = helpers.hash(password);
        if (userData.hashPassword === hashPassword) {
          if (userData.token !== '') {
            const randomToken = helpers.generateRandomKey(20, true, true);
            userData.token = randomToken;
            _data.update('users', email, userData, (err) => {
              if (!err) {
                const tokenData = {
                  email,
                  token: randomToken,
                  createdOn: Date.now(),
                };

                _data.create('tokens', email, tokenData, (err) => {
                  if (!err) {
                    callback(200, tokenData);
                  } else {
                    callback(500, { Error: 'Could not create the token file' });
                  }
                });
              } else {
                callback(500, { Error: "Could not update the user's token" });
              }
            });
          } else {
            callback(403, {
              Error: 'User already has a token',
              token: user.token,
            });
          }
        } else {
          callback(403, { Error: 'Wrong password' });
        }
      } else {
        callback(404, { Erro: 'User does not exist' });
      }
    });
  } else {
    callback(403, { Error: 'Missing or invalid required field' });
  }
};

// Token - GET
// Required data: token
// Optional data: none
token.get = (data, callback) => {
  const { queries } = data;

  // Check the data
  const token =
    typeof queries.token === 'string' && queries.token.trim().length === 20
      ? queries.token.trim()
      : false;
  if (token) {
    _data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404, { Error: 'Could not find the token' });
      }
    });
  } else {
    callback(403, {
      Error: 'Required parameters are invalid or were not passed in',
    });
  }
};

// Token - Delete
// Required data: token
token.delete = (data, callback) => {
  const { queries } = data;

  // Check the data
  const token =
    typeof queries.token === 'string' && queries.token.trim().length === 20
      ? queries.token.trim()
      : false;

  if (token) {
    _data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        _data.delete('tokens', token, (err) => {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: 'Could not delete the token' });
          }
        });
      } else {
        callback(403, {
          Error: 'Required parameters are invalid or were not passed in',
        });
      }
    });
  } else {
    callback(403, {
      Error: 'Required parameters are invalid or were not passed in',
    });
  }
};

// Verify a token
// Required info: token, email (to verify if the passed token belongs to the person passing it)
token.verifyToken = (token, email) => {
  // Check data
  token =
    typeof token === 'string' && token.trim().length === 20
      ? token.trim()
      : false;
  email =
    typeof email === 'string' &&
    email.trim().indexOf('@') > -1 &&
    email.trim().split('@')[1].indexOf('.') > -1
      ? email.trim()
      : false;

  if (token && email) {
    _data.read('tokens', token, (err, tokenData) => {
      if (!err && tokenData) {
        if (tokenData.email === email) {
          callback(false);
        } else {
          callback(
            'Token does not belong to the user with the email passed in'
          );
        }
      } else {
        callback('Token not found');
      }
    });
  } else {
    callback('Invalid parameters');
  }
};
