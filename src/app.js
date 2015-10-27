require('babel/register');
var Consumer = require('./consumer');
var Producer = require('./producer');

function initialize(numConsumers) {
  var producer = new Producer("Producer");

  if (isNaN(numConsumers)) {
    return console.error("Please enter a valid number of consumers. (Eg: npm start 5)");
  }

  for (var i = 0; i < numConsumers; i++) {
    var consumer = new Consumer("Consumer #" + i, Math.round(Math.random() * 12) + 1, producer);
    consumer.start();
  }
  producer.start();
}

var args = parseInt(process.argv.slice(2));
initialize(args);
