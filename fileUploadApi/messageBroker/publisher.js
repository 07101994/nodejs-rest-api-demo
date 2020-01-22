var amqp = require("amqplib/callback_api");
const CONN_URL = "amqp://localhost";
var amqpConn = null;
var publisherChannel = null;

exports.start = function start() {
  amqp.connect(CONN_URL + "?heartbeat=60", function(connectionError, conn) {
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

function whenConnected() {
  startPublisher();
}

process.on("exit", code => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  amqpConn.close();
  return true;
}

function startPublisher() {
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

exports.publishToQueue = async (queueName, data) => {
  try {
    publisherChannel.assertQueue(queueName, {
      durable: true
    });
    publisherChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    console.log(error);
  }
};

process.on("exit", code => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});
