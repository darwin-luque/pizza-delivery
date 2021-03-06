/*
 * Data manager 
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Continer for the module to be exported
const lib = {};

// Base direction of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  if (!fs.existsSync(lib.baseDir + dir)) {
    fs.mkdirSync(lib.baseDir + dir);
  }
  // Open the file for writing
  fs.open(
    `${lib.baseDir}${dir}/${file}.json`,
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Write the data to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback('Error closing new file.');
              }
            });
          } else {
            callback('Error writing to new file!');
          }
        });
      } else {
        callback('Could not create new file, it may already exist.');
      }
    }
  );
};

// Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(
    `${lib.baseDir}${dir}/${file}.json`,
    'utf-8',
    (err, data) => {
      if (!err && data) {
        callback(false, helpers.parseJsonToObject(data));
      } else {
        callback(err, data);
      }
    }
  );
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
  // open the file for writing
  fs.open(
    `${lib.baseDir}${dir}/${file}.json`,
    'r+',
    (err, fileDescriptor) => {
      if (!err) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback('Error closing the exisitng file');
                  }
                });
              } else {
                callback('Error writing to exisiting file');
              }
            });
          } else {
            callback('Error truncating file.');
          }
        });
      } else {
        callback('Could not open the file for updating, it mya not exist yet.');
      }
    }
  );
};

lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting the file, it may not exist already!')
    }
  })
};

// List all the files in a directory
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
    if(!err && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach(fileName => {
        trimmedFileNames.push(fileName.replace('.json', ''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  })
}

// Export the module
module.exports = lib;
