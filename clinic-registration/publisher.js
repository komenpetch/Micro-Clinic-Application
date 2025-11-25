/**
 * Based on 
 * https://gist.github.com/rguzmano/7b6fbc04dc9b5da6d850d09c2fb353a8#file-rabbitmq-publisher-js
 * https://gist.github.com/rguzmano/1dcfda90b5872bd5ced66d2d9b865719#file-rabbitmq-initconnection-js
 */
const amqp = require('amqplib/callback_api');
const TIMEOUT = 3000; // default timeout

module.exports = {
  startPublisher: (uri) => {
    return new Promise((resolve, reject) => {
      amqp.connect(uri, (err, conn) => {
        // If connection error, 
        // No reconnect in publisher just log the error
        if (err) {
          console.error("[AMQP]", err.message);
          reject(err)
          return;
        }

        conn.on("error", function (err) {
          console.log("ERROR", err);
          reject(err)
          if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
          }
        });

        conn.on("close", function () {
          // Reconnect when connection was closed
          console.log("[AMQP] closed");
          console.log("[AMQP] Reconnecting.....")
          return setTimeout(() => { module.exports.startPublisher(uri) }, TIMEOUT);
        });

        // Connection OK
        console.log("[AMQP] connected");

        // Init publisher
        conn.createConfirmChannel(function (err, ch) {
          if (closeOnErr(err)) {
            reject(err)
            return;
          }

          ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
          });

          ch.on("close", function () {
            console.log("[AMQP] channel closed");
          });

          console.log("[AMQP] Publisher started");
          resolve(ch)
        });
      });
    });
  },
  publishMessage: (channel, exchange, content, options = {}) => {
    if(channel == null) {
      console.error("[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with startPublisher function");
      return;
    }
    // convert string message in buffer
    const message = Buffer.from(content, "utf-8");
    try {
      // Publish message to exchange
      // Remove routingkey
      // options is not required
      channel.publish(exchange, '', message, options,
        (err) => {
          if (err) {
            console.error("[AMQP] publish", err);
            channel.connection.close();
            return;
          }
          console.log("[AMQP] message delivered");
        });
    } catch (e) {
      console.error("[AMQP] publish", e.message);
    }
  }
}

function closeOnErr(err, conn) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  if(conn != null) {
    conn.close();
  }
  return true;
}
