const WebSocket = require('ws')
const wsServer = new WebSocket.Server({ port: 8080 })

wsServer.on('error', console.error);

wsServer.on('connection', (client) => {
	console.log('A new client connected')

	client.on('message', (message) => {
		console.log('received: %s', message)

		const textMessage = message.toString();

		if (textMessage === 'br55667') {
			wsServer.clients.forEach((client) => {
				console.log('br55667 read')
				if (client.readyState === WebSocket.OPEN) {
					client.send(textMessage);
				}
			})
		} else {
			wsServer.clients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(textMessage);
				}
			});
		}
	});

	client.on('close', () => {
		console.log('client disconnected');
	});

});
