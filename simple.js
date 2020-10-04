const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8000 });
var DATA = require('./stations.json');

wss.on('connection', function connection(ws) {
  // ws is client(browser) connected to our server
  ws.on('message', function incoming(message) {
    // when browser send us a message
    console.log('received: %s', message);
  });
});

// Broadcast message to all connected clients (wss.clients) every 1000 ms
setInterval((data) => {
  let message = data.shift();

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
        message.last_update = (new Date(message.last_update)).getTime();
        let feature = {
        	"geometry": {
        		"x": message.lat,
        		"y": message.lon,
        		"spatialReference": {
        			"wkid": 4326
        		}
        	},
        	"attributes": {
        		codLinea: message.codLinea,
                codBus: message.codBus,
                codParIni: message.codParIni,
                sentido: message.sentido,
                last_update: (new Date(message.last_update)).getTime()
        	}
        }
        console.log(feature);
      client.send(JSON.stringify(feature));
    }
  });
},1000,DATA);
