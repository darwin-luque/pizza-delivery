/**
 * Helpers functions
 */

//Dependencies
const crypto = require('crypto');
const config = require('./config');

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
  let lowerCase = false;
  let upperCase = false;
  let digit = false;
  for (let i = 0; i < password.length; i++) {
    const passChar = password[i];
    if (passChar === passChar.toLowerCase()) lowerCase = true;
    if (passChar === passChar.toUpperCase()) upperCase = true;
    if (!isNaN(passChar)) digit = true;
    if (lowerCase && upperCase && digit) return true;
  }
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

lib.generateRandomKey = (keyLength=10, useCapitals=false, useDigits=false, useSymbols=false) => {
  let keys = 'abcdefghijklmopqrstuvwxyz';
  keys += useCapitals ? keys.toUpperCase() : '';
  keys += useDigits ? '1234567890' : '';
  keys += useSymbols ? '|°!"#$%&/()=?¿¡´¨+*{[}];,:.-_~`^¬' : '';
  let res = '';
  for (let i = 0; i < keyLength; i++) {
    res += keys[Math.floor(Math.random() * keys.length)];
  }
  return res;
};

lib.filterShoppingCartItem = (items) => items.map((item) => ({
  name: item.name,
  quantity: item.quantity,
}));

module.exports = lib;
