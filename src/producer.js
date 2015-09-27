var util = require('util');
var events = require('events');

function isActiveConsumer(lastKeepAlive) {
  return Math.abs(lastKeepAlive - new Date()) < 10000;
}

var Producer = function (name) {
  var self = this;
  self.name = name;
  self.consumers = {};
  self.interval = null;

  // Initializes the producer interval to emit the time every 1000ms.
  self.start = function () {
    self.interval = setInterval(function () {
      self.emitTime();
    }, 1000);
  };

  self.on('Register', function (consumer) {
    console.info(self.name + " received a message: (Register) from " + consumer.name);
    self.consumers[consumer.name] = { consumer: consumer, lastKeepAlive: new Date() };
  });

  self.on('KeepAlive', function (consumer) {
    console.info(self.name + " received a message: (KeepAlive) from " + consumer.name);
    self.consumers[consumer.name].lastKeepAlive = new Date();
  });
};

util.inherits(Producer, events.EventEmitter);

Producer.prototype.emitTime = function () {
  var self = this;
  var date = new Date();

  for (var key in self.consumers) {
    if (!isActiveConsumer(self.consumers[key].lastKeepAlive)) {
      console.info(self.name + " retiring consumer: " + key);
      delete self.consumers[key];
    } else {
      self.consumers[key].consumer.emit('Time', date.toISOString());
    }
  }

  if (Object.keys(self.consumers).length === 0) {
    clearInterval(self.interval);
    console.log(self.name + ": All consumers finished.");
  }
};

module.exports = Producer;