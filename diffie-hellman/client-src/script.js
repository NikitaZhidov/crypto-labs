const { getCountBitsOfNumber } = require('../../helpers/crypto-helpers');
const { diffieHellman } = require('../diffie-hellman');

const socket = io();

let FIRST_STAGE_KEY = null;
let messages$ = null;
let form$ = null;

const formSubmitListener = function (e) {
	e.preventDefault();

	if (input$.value) {
		if (isNaN(input$.value)) {
			return;
		}

		socket.emit('chat message', input$.value);
		input$.value = '';
	}
};

let input$ = null;

let KEY = null;

let cryptoParams = {
	g: null,
	p: null,
	q: null,
	x: null,
};

function initChatView() {
	const chatHtml = `
		<h1>1st stage key: ${FIRST_STAGE_KEY}</h1>
		<h1 style="border-bottom: 1px solid #000;">Key: ${KEY}</h1>
		`;

	document.body.innerHTML = chatHtml;

	form$ = document.getElementById('form');
	input$ = document.getElementById('input');
	messages$ = document.getElementById('messages');

	form$.addEventListener('submit', formSubmitListener);
}

function initNoChatView() {
	if (form$) {
		document.body.innerHTML = `<h1 style="display: flex; justify-content: center; align-items: center; height: 100vh;">Wait for a partner to connect...</h1>;`;
	}
}

socket.on('init', function (data) {
	cryptoParams.g = BigInt(data['g']);
	cryptoParams.p = BigInt(data['p']);
	cryptoParams.q = BigInt(data['q']);
});

socket.on('keys-exchange', function () {
	FIRST_STAGE_KEY = createFirstStageKey().toString();
	console.log('first-stage-key', FIRST_STAGE_KEY);
	socket.emit('first-stage-key', FIRST_STAGE_KEY);
});

socket.on('first-stage-key', function (key) {
	const bigIntKey = BigInt(key);
	const { x, q, p } = cryptoParams;
	KEY = diffieHellman(bigIntKey, x, q, p);
	console.log('private_key', KEY);
	initChatView();
});

socket.on('no-two-connections', () => initNoChatView());

socket.on('chat message', function (msg) {
	var item = document.createElement('li');
	item.textContent = msg;
	messages$.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

function createFirstStageKey() {
	const { p, q, g } = cryptoParams;
	const pBits = getCountBitsOfNumber(p);

	cryptoParams.x = rnd(pBits - 1);

	console.log('x', cryptoParams.x);

	const key = diffieHellman(g, cryptoParams.x, q, p);
	return key;
}

function rnd(bits) {
	const bytes = new Uint8Array(Math.ceil(bits / 4));

	// load cryptographically random bytes into array
	window.crypto.getRandomValues(bytes);

	// convert byte array to hexademical representation
	const bytesHex = bytes.reduce(
		(o, v) => o + ('00' + v.toString(16)).slice(-2),
		''
	);

	return BigInt('0x' + bytesHex);
}
