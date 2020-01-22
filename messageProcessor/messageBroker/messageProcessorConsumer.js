var amqp = require("amqplib/callback_api");
const CONN_URL = "amqp://localhost";
var amqpConn = null;
var consumerChannel = null;
const employeeService = require('../services/employeeService');
const employeeDetail = require('../messageBrokerContracts/employeeDetail');

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
}

function whenConnected() {
  startWorker();
}

// A worker that acks messages only if processed successfully
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(1);

    consumerChannel = ch;

    var queue = "process-csv-message";
    ch.assertQueue(queue, { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume(queue, processMsg, { noAck: false });
      console.log("Worker is started");
    });
  });
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

function processMsg(msg) {
  work(msg, function(ok) {
    try {
      if (ok) consumerChannel.ack(msg);
      else consumerChannel.reject(msg, true);
    } catch (e) {
      closeOnErr(e);
    }
  });
}

function work(msg, cb) {
  var message = JSON.parse(msg.content.toString());
  var employeeDetails = employeeDetail.create(message.Name, message.Phone, message.Email, message.Company);
  employeeService.createEmployee(employeeDetails);
  cb(true);
}
