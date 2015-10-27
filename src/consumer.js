var util = require('util');
var events = require('events');

class Consumer extends events.EventEmitter {
  constructor(name, keepAliveCount, producer) {
    super();
    this.name = name;
    this.keepAliveCount = keepAliveCount;
    this.producer = producer;
    this.interval = null;
    
    producer.emit('Register', this);

    this.on('Time', (time) => {
      console.info(`${this.name} received a message: (Time): ${time}`);
    });
  }

  // Initializes the consumer interval to emit KeepAlive every 5000ms.
  start() {
    this.interval = setInterval(() => {
      this.emitKeepAlive();
    }, 5000)
  }
  
  emitKeepAlive() {
    if (this.keepAliveCount === 0) {
      clearInterval(this.interval);
    }
    else {
      console.info(`${this.name} sending a message: (KeepAlive)`);
      this.producer.emit('KeepAlive', this);
      this.keepAliveCount--;
    }
  }
}

module.exports = Consumer;