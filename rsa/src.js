// src.js

const {
	generatePrime,
	modExp,
	extendedEuclid,
} = require('../helpers/crypto-helpers');

module.exports = {
	RSA,
	decryptRSA,
};

function RSA(N) {
	let p, q;
	do {
		p = generatePrime(N);
		q = generatePrime(N);
	} while (p == q);

	const f = (p - 1n) * (q - 1n);
	var e = 1n;

	let t, x, y;
	do {
		e += 2n;
		[t, x, y] = extendedEuclid(e, f);
	} while (t > 1n);

	const n = p * q;
	const d = (x < 0n ? x + f : x) % f;

	const answer = [e, d, n, p, q];
	return answer;
}

function decryptRSA(cmsg, d, p, q, n) {
	d1 = d % (p - 1n);
	d2 = d % (q - 1n);

	m1 = modExp(cmsg, d1, p);
	m2 = modExp(cmsg, d2, q);

	let t, x, y;
	[t, x, y] = extendedEuclid(q, p);

	r = (x < 0n ? x + p : x) % p;
	msg = (((m1 - m2) * r) % p) * q + m2;
	return msg;
}

function main(message) {
	const [e, d, n, p, q] = RSA(100);
	console.log('Открытый ключ:', e, 'и', n);
	console.log('Закрытый ключ:', d, 'и', n);

	const signature = modExp(BigInt(message), d, n);
	console.log('Цифровая подпись:', signature);

	const approval = Number(decryptRSA(signature, e, p, q, n));
	if (approval == message)
		console.log(`Все ок, подпись валидна! Сообщение: ${approval}.`);
	else console.log('Исправляйте алгоритм');
}

const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

readline.question('Введите сообщение (число): ', (msg) => {
	if (isNaN(msg)) {
		console.warn('Введены некорректные данные');
		process.exit();
	}

	const msgNum = Number(msg);
	main(msgNum);
	process.exit();
});
