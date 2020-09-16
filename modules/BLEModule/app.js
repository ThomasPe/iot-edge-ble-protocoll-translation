'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;
const ruuvi = require('node-ruuvitag');


Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');

        initRuuviTag();
      }
    });
  }
});

function initRuuviTag() {
  ruuvi.on('found', tag => {
    console.log('Found RuuviTag, id: ' + tag.id);
    tag.on('updated', async data => {

      var json = JSON.stringify(data, null, '\t')
      var sensorMsg = new Message(json);

      // send received ruuvi message through module identity
      client.sendOutputEvent('output1', sensorMsg, printResultFor('Sending ble payload'));

    });
  });
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}
