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

/*
dataSchema = {
  firstName: String,
  lastName: String,
  items: arrayOf(shape({
    name: String,
    quantity: Number,
    price: Number,
  })),
  total: Number,
}
*/
lib.createReceipt = (data) => {

};

lib.sendEmail = async (to, subject, text) => {
  const { MAILGUN_URL, MAILGUN_DOMAIN_NAME, MAILGUN_PRIVATE_KEY } = process.env;
  const formData = new FormData();

  formData.append('from', `Darwin Luque <darwin@${MAILGUN_DOMAIN_NAME}>`)
  formData.append('to', to);
  formData.append('subject', subject);
  formData.append('text', text);

  return fetch(`${MAILGUN_URL}/${MAILGUN_DOMAIN_NAME}/messages`, {
    method: 'POST',
    headers: {
      Authorization: MAILGUN_PRIVATE_KEY,
      'Content-Type': 'application/JSON',
    },
    body: formData,
  })
};

return sendEmail

module.exports = lib;
