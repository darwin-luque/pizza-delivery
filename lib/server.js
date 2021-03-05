/*
 * Server file
 */

// Dependencies
const http = require('http');
const { URL } = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const helpers = require('./helpers');
const handlers = require('./handlers');

// Create server
const server = http.createServer((req, res) => {
  // get the url, headers and method of the request
  const { url, headers, method } = req;
  const basedUrl = `http://${headers.host}/`;
  const parsedUrl = new URL(url, basedUrl);

  // Get the pathname and query parameters of the url
  const { pathname, searchParams } = parsedUrl;
  const trimmedPath = pathname.replace(/^\/+|\/+$/g, '');

  // Parse query strings
  const queryStringObject = helpers.parseQueryStrings(searchParams);

  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.pageNotFound;

    const data = {
      url: parsedUrl,
      method: method.toLowerCase(),
      queries: queryStringObject,
      payload: helpers.parseJsonToObject(buffer),
      headers,
    };

    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or use an empty object
      payload = typeof payload === 'object' ? payload : {};

      // Convert the payload to a stringify JSON
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response is 200, otherwise print red
      let color = '\x1b[31m%s\x1b[0m';
      if (statusCode == 200 || statusCode === 201) color = '\x1b[32m%s\x1b[0m';

      // Print out the response
      console.log(
        color,
        `${method.toUpperCase()} /${trimmedPath} ${statusCode}`
      );
    });
  });
});

// Listen to the respective port
server.init = () => {
  server.listen(config.port, () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `The server is listening on port ${config.port}`
    );
  });
};

const router = {
  user: handlers.user,
};

module.exports = server;
