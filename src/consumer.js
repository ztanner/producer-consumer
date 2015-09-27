var util = require('util');
var events = require('events');

var Consumer = function (name, keepAliveCount, producer) {
  var self = this;
  self.producer = producer;
  self.name = name;
  self.keepAliveCount = keepAliveCount;
  self.interval = null;

  producer.emit('Register', self);

  // Initializes the consumer interval to emit KeepAlive every 5000ms.
  self.start = function () {
    self.interval = setInterval(function () {
      self.emitKeepAlive();
    }, 5000);
  };

  self.on('Time', function (time) {
    console.info(self.name + " received a message:" + " (Time): " + time);
  });
};

util.inherits(Consumer, events.EventEmitter);

Consumer.prototype.emitKeepAlive = function () {
  var self = this;

  if (self.keepAliveCount === 0) {
    clearInterval(self.interval);
  }
  else {
    console.info(self.name + " sending a message: (KeepAlive)");
    self.producer.emit('KeepAlive', self);
    self.keepAliveCount--;
  }
};


module.exports = Consumer;