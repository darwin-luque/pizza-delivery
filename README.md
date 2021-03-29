# Pizza Delivery REST API
This project is a REST API for a pizza delivery restaurant. The API consists of the following endpoints:
- user
- token
- menu
- shopping-cart
- order

This is a demo project for an assignment on a course. With that said, this was thought to be run locally since is not posted in production. The soul purpose of this project is to practice an npm-less application. That's right, there are no third-party packages in this project, the database is based on json filed, and there is NO package.json file. This project is done purely with Node's API and runtime.


> Note:
> I'll use http://localhost:5000/ as the base url, since that is what's configure in the config.js file as the port for production.
> I'll use the JavaScript's fetch API to showcase how to use the REST API

## Users
The User api is used to, well, CRUD users. The valid methods are POST, GET, PUT, and DELETE.

### CREATE
The required fields to create a user are:
- firstName: String
- lastName: String
- email: String
- streetAddress: String
- password: String **Required to have at least 1 lower case, 1 upper case, 1 digit, and 1 special character**
The parameters must be provided as JSON in the body of the request.

#### Example:
``` javascript
fetch('http://localhost:5000/user', {
  method: 'POST',
  body: {
    firstName: 'Darwin',
    lastName: 'Luque',
    email: 'darwin.luque.98@gmail.com',
    streetAddress: '13 street between 11 and 12 avenue S.E.',
    password: 'ThisIsMyVerySafePassword123!',
  }
});
```

### READ
The required fields to read the info of a user are:
- email: String
- token: String
The parameters must be provided as query params of the request

#### Example:
``` javascript
fetch('http://localhost:5000/user' + new URLSearchParamS({
  email: 'darwin.luque.98@gmail.com',
  token: 'A 20 alphanumeric token',
}));
```

#### Returns:
``` json
{
  "firstName": "Darwin",
  "lastName": "Luque",
  "email": "darwin.luque.98@gmail.com",
  "streetAddress": "13 street between 11 and 12 avenue S.E.",
  "token": "MyToken" (If it exists)
}
```

### UPDATE
The required fields to update the info of a user are:
- email: String
- token: String

Optional fields can be (collectively are required):
- firstName: String
- lastName: String
- streetAddress: String
- password: String

The parameters must be provided as JSON in the body of the request, except for the token

#### Example:
``` javascript
fetch('http://localhost:5000/user', {
  method: 'PUT',
  body: {
    email: 'example@email.com',
    token: 'MyToken',
    firstName: 'Valentin',
    lastName: 'Madrid',
    streetAddress: 'My New address',
    password: 'MyNewSafePassword123@',
  }
});
```

### DELETE
The required fields to delete the info of a user are:
- email: String
- token: String
The parameters must be provided as query parameters.

#### Example:
``` javascript
fetch('http://localhost:5000' + new URLSearchParams({
  email: 'example@email.com',
  token: 'MyToken',
}), {
  method: 'DELETE',
});
```

## Token
The token API is to be able to sign in users by generating a random token per session. The valid methods are POST, GET, and DELETE. The user is signed in by creating the token, and signed out by deleting the token. The token can be read but not updated. The token is a 20 long string with random characters that can be lowercase, uppercase, and digits.

### CREATE
The required fields to create a token are:
- email: String
- password: String
The parameters must be provided as JSON in the body of the request.

#### Example:
``` javascript
fetch('http://localhost:5000/token, {
  method: 'POST',
  body: {
    email: 'darwin.luque.98@gmail.com',
    password: 'ThisIsMyVerySafePassword123!',
  }
});
```

#### Returns:
``` json
{
  "email": "darwin.luque.98@gmail.com",
  "token": "MyNewToken",
  "createdAt": 1234545 (The value in miliseconds of the time elapsed until now)
}
```

### READ
The required fields to read the info of a token is:
- token: String
The parameters must be provided as query params of the request

#### Example:
``` javascript
fetch('http://localhost:5000/token' + new URLSearchParamS({
  token: 'MyToken',
}));
```

#### Returns:
``` json
{
  "email": "darwin.luque.98@gmail.com",
  "token": "MyNewToken",
  "createdAt": 1234545 (The value in miliseconds of the time elapsed until now)
}
```

### DELETE
The required fields to delete the info of a token is:
- token: String
The parameters must be provided as query parameters.

#### Example:
``` javascript
fetch('http://localhost:5000/token' + new URLSearchParams({
  token: 'MyToken',
}), {
  method: 'DELETE',
});
```

## Menu
The Menu endpoint is to get the menu of the pizza restaurant. In this case, the only available method for a user is GET.

### READ
The required fields to read the info of the menu are:
- email: String
- token: String
These parameters must be provided as query parameters.

#### Example:
``` javascript
fetch('http://localhost:5000/menu' + new URLSearchParams({
  email: 'example@email.com',
  token: 'MyToken',
}));
```

#### Returns:
``` json
[
  {
    "name": "pasta",
    "price": 3.5
  },
  {
    "name": "peperonni pizza",
    "price": 5
  },
  {
    "name": "cheese pizza",
    "price": 4.5
  },
  {
    "name": "3 meat pizza",
    "price": 5.3
  },
  {
    "name": "raviolli",
    "price": 4.2
  }
]
```

## Shopping cart
The Shopping cart endpoint is used to store the food to purchase. The valid methods are POST, GET, PUT, and DELETE.

### CREATE
The required fields to create a shopping cart are:
- token: String
- email: : String
- items: arrayOf(Item) **Item Schema below**
The parameters should be provided as JSON file in the body of the request

``` json
ItemSchema: {
  "name": String: (Name of the food),
  "quantity": Int (Number of food)
}
```

#### Example:
``` javascript
fetch('http://localhost:5000/shopping-cart', {
  method: 'POST',
  body: {
    email: 'example@email.com',
    tyoken: 'MyToken',
    items: [
      {
        name: "pasta",
        quantity: 2,
      },
    ],
  },
});
```

### READ
The required fields to read the shopping cart of a user are:
- email: String
- token: String
The parameters should be provided as query parameters

#### Example:
``` javascript
fetch('http://localhost:5000/shopping-cart' + new URLSearchParams({
  email: 'example@email.com',
  token: 'MyToken',
}));
```

#### Returns:
``` json
{
  "email": "darwin.luque.98@gmail.com",
  "totalPrice": 24,
  "items": [
    {
      "name": "pasta",
      "quantity": 3
    },
    {
      "name": "cheese pizza",
      "quantity": 3
    }
  ]
}
```

### UPDATE
The required field to update the shopping cart of a user are:
- email: String
- token: String
- items: arrayOf(Item)
The parameters should be provided as JSON in the body of the request.
> Note: The only values to update are the items, the email and token are used for verification of a session only. 
> Also, keep in mind that the provided items will overwrite the existing items. With this said these two cases will need to work as such:
> - Append a new item: You would need to provide the existing array with the new items.
> - Add or subtract quantity to an exisiting item: You would need to provide the same array, but change the quantity to the item to be updated.

#### Example:
``` javascript
fetch('http://localhost:5000/shopping-cart', {
  method: 'PUT',
  body: {
    email: 'example@email.com',
    token: 'MyToken',
    items: [
      {
        name: 'pasta',
        quantity: 4,
      },
      {
        name: 'pizza',
        quantity: 3,
      },
    ],
  }
});
```

### DELETE
The required fields to delete the shopping cart of a user are:
- email: String
- token: String
The parameters should be provided as query parameters

#### Example:
``` javascript
fetch('http://localhost:5000/shopping-cart' + new URLSearchParams({
  email: 'xample@email.com',
  token: 'MyToken',
}), {
  method: 'DELETE',
})
```

## Order
The order endpoint places an order based on the shoppping cart of a user. Once the order is created, the user is provided with a recepit via email. The valid methods for the order api are POST, GET, and DELETE.

### CREATE
The required fields to create an order are:
- email: String
- token: String
- paymentMethod: String
The parameters should be provided as JSON in the body of the request.
> Note: The user should also have a valid shopping cart registered under its email.

#### Example:
``` javascript
fetch('http://localhost:5000/order', {
  method: 'POST',
  body: {
    email: 'example@email.com',
    token: 'MyToken',
    paymentMethod: 'visa',
  },
}),
```

### READ
The required fields to read an order are:
- email: String
- token: String
- orderId: String
The parameters should be provided as query parameters:

#### Example:
``` javascript
fetch('http://localhost:5000/order' + new URLSearchParams({
  email: 'example@email.com',
  token: 'MyToken',
  orderId: 'OrderId',
}));
```

## Improvement Notes
- The token should be provided through the Authentication parameter of the headers, instead of mostly as a payload of the body or, worst, query parameters.
- There should be a worker periodically earasing delivered orders.

Please keep in mind that this API was mostly, if not completely, thought from the user's perspective. For which, various capabilities were not included because they should not be allowed to users.

*If you have any suggestions, please feel free to open an issue or create a PR*
