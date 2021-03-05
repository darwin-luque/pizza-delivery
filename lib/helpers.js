/**
 * Helpers functions
 */

//Dependencies
const crypto = require('crypto');

const lib = {};

// Parse the entries array returned by the URLParam object
lib.parseQueryStrings = (entries) => {
  // Initialize vairable to return
  const res = {};

  // Iterate through the array of array
  entries.forEach((value, name) => {
    res[name] = value;
  });

  return res;
};

lib.parseJsonToObject = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
};

lib.checkPassword = (password) => {
  const lowerCase = false;
  const upperCase = false;
  const digit = false;
  password.split('').forEach((passChar) => {
    lowerCase = !lowerCase && passChar === passChar.toLowerCase();
    upperCase = !upperCase && passChar === passChar.toUpperCase();
    digit = !digit && '1234567890'.split('').indexOf(passChar) > -1;
    if (lowerCase && upperCase && digit) return true;
  });
  return false;
};

lib.hash = (pass) => {
  if (typeof pass === 'string' && pass.length > 0) {
    return crypto
      .createHmac('sha256', config.hashingSecret)
      .update(pass)
      .digest('hex');
  } else {
    return false;
  }
};

module.exports = lib;
