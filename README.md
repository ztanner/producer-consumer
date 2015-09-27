# Simple NTP Service

## Requirements
- NodeJS
- Mocha ^2.3.3

## Setup & Installation
Simply run `npm install` followed by `npm start <num_consumers>` to run the program. Example: `npm start 5` will run the application with 5 consumers. 

## Consumer
Upon its creation, a `Consumer` object immediately fires the `Register` message to the producer. This allows the consumer to 
immediately be added to the list of consumers that the producer knows about. 

**Attributes**

- `name`: Used to identify the consumer for easy lookup in the `producer.consumers` collection. 

- `keepAliveCount`: Random value [0,12] which indicates how many times the keepAlive message will be broadcast for that particular consumer.

- `producer`: Instance of the producer to whom the consumer emits the `Register` & `KeepAlive` messages.

- `interval`: The start function binds an interval to this value, so that we can clear the interval once the consumer is finished.

**Listeners**

- `Time`: Simply logs the time received from the producer.

## Producer
From the project spec, there is only one producer in the application. 

**Attributes**

- `name`: Name of the producer, simply used for identification in the command line.

- `consumers`: Collection of consumers that the producer is aware of and talking to. The key is the name of the consumer, and the value is a object containing the consumer instance and `lastKeepAlive`. The producer updates the `lastKeepAlive` value with the current time when it receives a `Register` or `KeepAlive` message from a consumer.

- `interval`: The start function binds an interval to this value, so that we can clear the interval once the producer is finished.

**Listeners**

- `Register`: Adds a consumer to the producer's consumer collection. Emitted by the consumer. Tags the newly added consumer with a `lastKeepAlive` timestamp. Expects a consumer object.

- `KeepAlive`: Updates the `lastKeepAlive` value for the consumer who sent the message, equal to the current time. Expects a consumer object.

## Tests
Tests are created using Mocha. To run them, simply type `npm test`. Each describe block tests the essential functions of both the Producer and Consumer.

## Design Decisions
- I chose to use `EventEmitter` for this task. Both the producer and consumer extend the emitter to provide support for listening to & emitting events. 
- Using an object with consumer names as keys has a couple of merits:
  - Consumer look-ups are easier upon receival of a `KeepAlive` message. The producer can simply use the received consumer's name to find the consumer and update its `lastKeepAlive` value.
  - It's more intuitive to remove the key-value pair from the consumers object than trying to splice it from an array, as it's index agnostic.
- Because the application is so small, it didn't seem to warrant individual folders for each component. However, if this were to expand beyond 3 files, I would structure tests, Producer, and Consumer to be more modular. 

## Potential Improvements
- Defining the roles of the producer and consumer at first would have made the development process a bit quicker. Rather than figuring out role responsibilities while developing, it would have been easier to draw out a simple relationship diagram from the start. 
- Splitting up `Producer.prototype.emitTime()` into separate functions could help improve modularity. Another way to design the consumer staleness check could be to have the Producer run through consumers and observe their `lastKeepAlive` date, rather than relying on the `emitTime()` function to perform that check. The fact that they are combined in a single function muddles the individuality of the producer's tasks.   
