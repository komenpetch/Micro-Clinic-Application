/**
 * Based on 
 * https://gist.github.com/rguzmano/5295cc9c7469f20c7ac4e874f30049d9#file-rabbitmq-startconsumer-js
 * https://gist.github.com/rguzmano/1dcfda90b5872bd5ced66d2d9b865719#file-rabbitmq-initconnection-js
 */
const amqp = require('amqplib/callback_api');
const TIMEOUT = 3000; // default timeout
const PREFETCH = 10; // max number of process in each time slot

module.exports = {
  initConnection: (uri, fnConnected) => {
    // Start connection with Rabbitmq
    amqp.connect(uri, (err, conn) => {
      // If connection error try to reconnect
      // E.g., RabbitMQ does not ready yet
      if (err) {
        console.error("[AMQP]", err.message);
        console.log("[AMQP] Reconnecting.....")
        return setTimeout(() => { module.exports.initConnection(uri, fnConnected) }, TIMEOUT);
      }

      conn.on("error", function (err) {
        console.log("ERROR", err);
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });

      conn.on("close", function () {
        // Reconnect when connection was closed
        console.log("[AMQP] closed");
      });

      // Connection OK
      console.log("[AMQP] connected");

      // Execute finish function
      fnConnected(conn);
    });
  },

  startConsumer: (conn, exchange, fnConsumer) => {
    // Create a channel for queue
    conn.createChannel(function (err, ch) {
      if (closeOnErr(err, conn)) return;

      ch.on("error", function (err) {
        console.error("[AMQP] channel error", err.message);
      });

      ch.on("close", function () {
        console.log("[AMQP] channel closed");
      });

      // Set prefetch value
      ch.prefetch(PREFETCH);

      ch.assertExchange(exchange, 'fanout', {
        durable: false
      });

      // Connect to queue
      ch.assertQueue('', { durable: true }, function (err, q) {
        if (closeOnErr(err, conn)) return;
        // Consume incoming messages
        ch.bindQueue(q.queue, exchange, '');
        ch.consume(q.queue, (msg) => {
          fnConsumer(msg.content.toString(), function (ok) {
            try {
              ok ? ch.ack(msg) : ch.reject(msg, true);
            } catch (e) {
              closeOnErr(e, conn);
            }
          });
        }, { noAck: false });
        console.log("[AMQP] Worker is started");
      });
    });
  }
}

function closeOnErr(err, conn) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  if (conn != null) {
    conn.close(); 
  }
  return true;
}
