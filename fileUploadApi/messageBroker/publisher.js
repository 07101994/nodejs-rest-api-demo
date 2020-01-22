var amqp = require("amqplib/callback_api");
const config = require("../config/config");
var amqpConn = null;
var publisherChannel = null;

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
};

// When RabbitMQ connection is successfully created then start the dependent tasks
function whenConnected() {
  initializePublisherChannel();
}

// Initialize RabbitMQ Publisher channel
function initializePublisherChannel() {
  amqpConn.createConfirmChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    publisherChannel = ch;
  });
}

// Publish message to RabbitMQ queue
exports.publishToQueue = async (queueName, data) => {
  try {
    publisherChannel.assertQueue(queueName, {
      durable: true
    });
    // Message details is passed as a JSON in RabbitMQ
    publisherChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
  }
};

// On RabbitMQ connection closed
process.on("exit", code => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});

// Clone RabbitMQ connection on error
function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}