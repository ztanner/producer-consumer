var util = require('util');
var events = require('events');

function isActiveConsumer(lastKeepAlive) {
  return Math.abs(lastKeepAlive - new Date()) < 10000;
}

class Producer extends events.EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.consumers = {};
    this.interval = null;

    this.on('Register', (consumer) => {
      console.info(`${this.name} received a message: (Register) from ${consumer.name}`);
      this.consumers[consumer.name] = { consumer: consumer, lastKeepAlive: new Date() };
    });

    this.on('KeepAlive', (consumer) => {
      console.info(`${this.name} received a message: (KeepAlive) from ${consumer.name}`);
      this.consumers[consumer.name].lastKeepAlive = new Date();
    });
  }

  start() {
    this.interval = setInterval(() => {
      this.emitTime();
    }, 1000)
  }

  emitTime() {
    let date = new Date();

    for (var key in this.consumers) {
      if (this.consumers.hasOwnProperty(key)) {
        if (!isActiveConsumer(this.consumers[key].lastKeepAlive)) {
          console.info(`${this.name} is retiring consumer: ${key}`);
          delete this.consumers[key];
        } else {
          this.consumers[key].consumer.emit('Time', date.toISOString());
        }
      }
    }

    if (Object.keys(this.consumers).length === 0) {
      clearInterval(this.interval);
      console.log(`${this.name}: All consumers finished.`);
    }
  }

}

module.exports = Producer;