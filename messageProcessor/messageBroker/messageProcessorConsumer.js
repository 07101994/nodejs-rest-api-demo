var amqp = require("amqplib/callback_api");
const config = require('../config/config');
var amqpConn = null;
var consumerChannel = null;
const employeeService = require('../services/employeeService');
const employeeDetail = require('../messageBrokerContracts/employeeDetail');

// Start function to start RabbitMQ connection
exports.start = function start() {
  amqp.connect(config.rabbitMQUrl + "?heartbeat=60", function(connectionError, conn) {
    if (connectionError) {
      console.error("[AMQP]", connectionError.message);
      return setTimeout(start, 1000);
    }

    conn.on("error", function(err) {
      if (err.message !== "Connection closing") {
        console.error("[AMQP] conn error", err.message);
      }
    });

    conn.on("close", function() {
      console.error("[AMQP] reconnecting");
      return setTimeout(start, 1000);
    });
    console.log("[AMQP] connected");
    amqpConn = conn;
    whenConnected();
  });
}

// Start subscriber when RabbitMQ connection is successfully connected
function whenConnected() {
  startSubscriber();
}

// A suscriber that acks messages only if processed successfully
function startSubscriber() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    // Process one message at a time
    ch.prefetch(1);

    consumerChannel = ch;

    var queue = "process-csv-message";
    ch.assertQueue(queue, { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume(queue, processMessage, { noAck: false });
      console.log("Worker is started");
    });
  });
}

// Close RabbitMQ channel on connection exit
process.on("exit", code => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});

// Process RabbitMQ message
function processMessage(message) {
  saveEmployee(message, function(ok) {
    try {
      // Here either we can acknowledge or reject message
      // In case of error we can reject the message and close the connection
      // Or we can acknowledge message and generate error for further investigation
      if (ok) consumerChannel.ack(message);
      else consumerChannel.reject(message, true);
    } catch (e) {
      closeOnErr(e);
    }
  });
}

// Close RabbitMQ connection on error
function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

// Save employee in database
function saveEmployee(message, callback) {
  var message = JSON.parse(message.content.toString());
  var employeeDetails = employeeDetail.create(message.Name, message.Phone, message.Email, message.Company);
  employeeService.saveEmployee(employeeDetails);
  callback(true);
}
