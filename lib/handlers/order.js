/**
 * Order Handler
 */

// Dependencies
const _data = require('../data');
const helpers = require('../helpers');
const { verifyToken } = require('./token');

// Instantiate order object
const order = {}

// Order - POST
// Required data: email, token, and payment method
// Optional data: none
order.post = (data, callback) => {
  const { payload } = data;

  // Verify the data
  const email =
    typeof payload.email === 'string' &&
      payload.email.trim().indexOf('@') > -1 &&
      payload.email.trim().split('@')[1].indexOf('.') > -1
      ? payload.email.trim()
      : false;
  const token =
    typeof payload.token === 'string' && payload.token.trim().length === 20
      ? payload.token.trim()
      : false;
  const paymentMethod = 
    typeof payload.paymentMethod === 'string' 
      ? payload.paymentMethod.trim()
      : false

  if (email && token && paymentMethod) {
    verifyToken(token, email, (err) => {
      if (!err) {
        _data.read('shopping-cart', email, (err, shoppingCartData) => {
          if (!err && shoppingCartData) {
            const orderObject = {
              "amount": shoppingCartData.totalPrice,
              "currency": "usd",
              "payment_method_types[]": "card",
              "customer": email,
              "payment_method": paymentMethod,
            };
            var formBody = [];
            for (var property in orderObject) {
              var encodedKey = encodeURIComponent(property);
              var encodedValue = encodeURIComponent(cardDetails[property]);
              formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            fetch(process.env.STRIPE_URL, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: process.env.STRIPE_SECRET_KEY,
              },
              body: formBody,
            })
              .then(res => res.json())
              .then(data => {
                _data.create('orders', data.id, data, (err) => {
                  if (!err) {
                    _data.read('users', email, (err, userData) => {
                      if (!err && userData) {
                        _data.read('menu', 'menu', (err, menuData) => {
                          if (!err && menuData) {
                            const items = shoppingCartData.items.map(item => ({
                              ...item,
                              price: menuData.find((menuItem) => menuItem.name === item.name).price,
                            }));
                            const receiptData = {
                              name: `${userData.firstName} ${userData.lastName}`,
                              items,
                              total: shoppingCartData.totalPrice,
                            };
                            const emailMessage = helpers.createReceipt(receiptData);
                            helpers.sendEmail(email, `Receipt for order: ${data.id}`, emailMessage)
                              .then((res) => res.json())
                              .then((data) => {
                                callback(200, data);
                              })
                              .catch((err) => {
                                callback(500, err);
                              })
                          } else {
                            callback(404, 'Could not find menu data');
                          }
                        })
                      } else {
                        callback(404, 'Could not find the users info');
                      }
                    });
                  } else {
                    callback(500, { Error: 'Could not create the order file, but the payment did go through', response: data });
                  }
                })
              })
              .catch(err => callback(403, { Error: err }));
          } else {
            callback(404, { Error: 'Could not find a shopping cart for this user' });
          }
        })
      } else {
        callback(403, { Error: err });
      }
    })
  } else {
    callback(403, { Error: 'Invaid or missing required field' });
  }
}

// Order - GET
// Required data: email, token, and orderId
order.get = (data, callback) => {
  const { queries } = data;

  // Verify the data
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
  const orderId = typeof queries.orderId === 'string'
    ? queries.orderId.trim()
    : false

  if (email && token && orderId) {
    verifyToken(token, email, (err) => {
      if (!err) {
        _data.read('orders', orderId, (err, orderData) => {
          if (!err && orderData) {
            if (orderData.customer === email) {
              callback(200, orderId);
            } else {
              callback(403, { Error: 'This user is not the owner of this order' });
            }
          } else {
            callback(404, { Error: 'Could not find an order with that ID' });
          }
        })
      } else {
        callback(403, { Error: err });
      }
    })
  } else {
    callback(403, { Error: 'Invalid or missing required field' });
  }
};

module.exports = order;
