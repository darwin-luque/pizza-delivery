/**
 * Shopping cart handlers
 */

// Dependencies
const _data = require('../data');
const { verifyToken } = require('./token');

// Instantiate handler object
const shoppingCart = {};

// Shopping Cart - POST
// Required data: token, email, item(s)
// Item's structure = [ { name: "name of the food", quantity: (number) } ]
// Shopping cart structure: { food: [(item structure)], totalPrice: (number) }
// Optional data: none
shoppingCart.post = (data, callback) => {
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
  const items =
    Array.isArray(payload.items) &&
      payload.items.length > 0
      ? payload.items
      : false;
  if (email && token && items) {
    verifyToken(token, email, (err) => {
      if (!err) {
        _data.read('shopping-carts', email, (err, _) => {
          if (err) {
            _data.read('menu', 'menu', (err, menuData) => {
              if (!err && menuData) {
                let itemFlag = true;
                let itemErr = undefined;
                const itemObject = {
                  totalPrice: 0,
                  items: [],
                };
                items.forEach((item) => {
                  try {
                    const { name, quantity } = item;
                    const food = menuData.find((menuItem) => menuItem.name === name);
                    itemObject.items.push(item);
                    itemObject.totalPrice += food.price * parseInt(quantity, 10);
                  } catch (err) {
                    itemFlag = false;
                    itemErr = err;
                  }
                });
                if (itemFlag) {
                  _data.create('shopping-carts', email, itemObject, (err) => {
                    if (!err) {
                      callback(200);
                    } else {
                      callback(500, { Error: err });
                    }
                  })
                } else {
                  callback(402, { Error: itemErr });
                }
              } else {
                callback(500, { Error: err });
              }
            })
          } else {
            callback(400, {
              Error: 'User already has a shopping cart, instead do a PUT request'
            })
          }
        })
      } else {
        callback(403, { Error: err });
      }
    })
  } else {
    callback(403, { Error: 'Invalid or missing required fields' });
  }
}

// Shopping Cart - GET
// Required data: email, token
// Optional data: none
shoppingCart.get = (data, callback) => {
  const { queries } = data;

  // Verify data
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
        _data.read('shopping-carts', email, (err, shoppingCartData) => {
          if (!err && shoppingCartData) {
            callback(200, shoppingCartData);
          } else {
            callback(404, { Error: 'Could not find a Shopping cart for this user' });
          }
        })
      } else {
        callback(400, { Error: err });
      }
    })
  } else {
    callback(403, { Error: 'Invalid or missing required field' });
  }
}

// Shopping Cart - PUT
// Required data: token, email, items
// Note: to delete an item from the list just pass in the same object with quantity = 0
shoppingCart.put = (data, callback) => {
  const { payload } = data;

  // Verify data
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
  const items =
    Array.isArray(payload.items) &&
      payload.items.length > 0
      ? payload.items
      : false;
  if (email && token && items) {
    _data.read('shopping-cart', email, (err, shoppingCartData) => {
      if (!err && shoppingCartData) {
        // Check if the modifications are only in the already existing items (To improve performance)
        let checkOthers = false;
        let checkErr
        const newShoppingCartData = {
          totalPrice = 0,
          items: [],
        };
        // TODO: Modify this function to look more like the POST method
        items.forEach((item) => {
          try {
            const { quantity, name } = item;
            const quantityNumber = parseInt(quantity, 10);
            if (quantityNumber > 0) {
              const curItem = shoppingCartData.find((shoppingCartItem) => shoppingCartItem.name === name)
              if (curItem !== undefined) {

              } else {
                checkOthers = true;
              }
            }
          } catch(_) {
            checkErr = true;
          }
        });
        if (!checkErr) {
          if (checkOthers) {
            // Check other options in the menu
          } else {
            // Update object
          }
        } else {
          callback(403, { Error: 'Invalid parameters in the items array' });
        }
      } else {
        callback(404, { Error: 'Could not find a shopping cart for this user' });
      }
    })
  } else {
    callback(403, { Error: 'Invalid or missing required fields' });
  }

}

module.exports = shoppingCart;