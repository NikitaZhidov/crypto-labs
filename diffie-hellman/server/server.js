const path = require('path');
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

const { Server } = require('socket.io');
const { generateG } = require('../diffie-hellman');
const { getRandomBigInt } = require('../../helpers/crypto-helpers');
const io = new Server(server);

const { g, p, q } = generateG(20);

let socketsCount = 0;

app.use(express.static(path.join(__dirname, '..', 'client')));

io.on('connection', async (socket) => {
	socket.emit('init', { g: g.toString(), p: p.toString(), q: q.toString() });

	socketsCount++;

	console.log('socketsLength', socketsCount);

	if (socketsCount === 2) {
		io.emit('keys-exchange');
	} else if (socketsCount > 2) {
		io.emit('no-two-connections');
	}

	socket.on('disconnect', () => {
		socketsCount--;
		if (socketsCount === 2) {
			io.emit('keys-exchange');
		}

		if (socketsCount < 2) {
			io.emit('no-two-connections');
		}
	});

	socket.on('chat message', (msg) => {
		io.emit('chat message', `User${socket.id}: ${msg}`);
	});

	socket.on('first-stage-key', (msg) => {
		socket.broadcast.emit('first-stage-key', msg);
	});
});

server.listen(3000, () => {
	console.log('listening on *:3000');
});
