const WebSocket = require('ws');

const PORT = process.env.PORT;
const BROKER_URL = process.env.BROKER_URL
const EXCH_REGISTRATION = process.env.EXCH_REGISTRATION
const EXCH_EXAMINED = process.env.EXCH_EXAMINED
const KEY_EVENT = 'EVENT'
const KEY_DATA = 'DATA'

const wss = new WebSocket.Server({ port: PORT });
// Just for logging message
wss.on('connection', function connection(ws) {
  console.log("Websocket client connected");
  ws.on('close', function close() {
    console.log('Websocket client disconnected');
  });
})

const broadcastMessage = (event, message) => {
  wss.clients.forEach(function each(client) {
    console.log("Sending notify message....")
    client.send(JSON.stringify({
      [KEY_EVENT]: event,
      [KEY_DATA]: message
    }));
  });
}

const consumer = require('./consumer')
consumer.initConnection(BROKER_URL, (conn) => {
  consumer.startConsumer(conn, EXCH_REGISTRATION,
    async (content, callback) => {
      console.log(`New patient arrive.`)
      broadcastMessage(EXCH_REGISTRATION, content)
      callback(true);
    })
})

consumer.initConnection(BROKER_URL, (conn) => {
  consumer.startConsumer(conn, EXCH_EXAMINED,
    async (content, callback) => {
      console.log(`Patient Diagnosed.`)
      broadcastMessage(EXCH_EXAMINED, content)
      callback(true);
    })
})

