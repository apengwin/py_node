const Storage = require('@google-cloud/storage');

const bucket = Storage().bucket("pywrentestoutput");

exports.test_data = function test(event, callback) {
  console.log(Object.keys(event.data));
  for (var key in event.data) {
    if (event.data.hasOwnProperty(key)) {
      console.log(key + " -> " + event.data[key]);
    }
  }
};

