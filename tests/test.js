var Consumer = require('../src/Consumer');
var Producer = require('../src/Producer');
var assert = require('assert');

describe("Consumers", function() {
  var producer = new Producer("Producer");
  var consumer = new Consumer("Consumer #1", 1, producer);

  it("should have all necessary constructor values", function() {
    assert.equal("Consumer #1", consumer.name);
    assert.equal(1, consumer.keepAliveCount);
    assert.equal(producer, consumer.producer);
  });

  it("should not start with an active interval", function(){
    assert.equal(null, consumer.interval);
  });

  it("should decrement keepAliveCount once broadcasting KeepAlive message", function(){
    consumer.emitKeepAlive();
    assert.equal(0, consumer.keepAliveCount);
  });
});

describe("Producer", function() {
  var producer = new Producer("Producer");
  var consumer = new Consumer("Consumer #1", 1, producer);

  it("should have all necessary constructor values", function() {
    assert.equal("Producer", producer.name);
  });

  it("should have a consumer", function() {
    assert.equal(true, Object.keys(producer.consumers).length === 1);
  });

  it("should not start with an active interval", function(){
    assert.equal(null, producer.interval);
  });

  it("should update lastKeepAlive during KeepAlive message", function() {
    var oldKeepAlive = producer.consumers["Consumer #1"].lastKeepAlive;
    producer.emit('KeepAlive', consumer);
    var newKeepAlive = producer.consumers["Consumer #1"].lastKeepAlive;
    assert.equal(true, newKeepAlive > oldKeepAlive);
  });

  it("should retire expired consumer", function() {
    producer.consumers["Consumer #1"].lastKeepAlive = new Date() - 10000;
    producer.emitTime();
    assert.equal(true, Object.keys(producer.consumers).length === 0);
  });
});