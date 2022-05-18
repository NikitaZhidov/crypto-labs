const { RSA_FORMAT } = require('../constants');

const Rsa = require('node-rsa');
const fs = require('fs');
const aesjs = require('aes-js');
const { getAesKeyFromPassword, getAesEncryptedHex } = require('./aes-encrypt');

const generateRsaKeys = (pathToPublic, pathToPrivate, privateKeyPassword) => {
	const key = new Rsa({ b: 512 });

	const publicKey = key.exportKey(`${RSA_FORMAT}-public`);

	const [sessionKeyArr, initVectorArr] =
		getAesKeyFromPassword(privateKeyPassword);

	const aesSession = new aesjs.ModeOfOperation.cbc(
		sessionKeyArr,
		initVectorArr
	);

	const privateKey = key.exportKey(`${RSA_FORMAT}-private`);

	const encryptedPrivateKeyHex = getAesEncryptedHex(aesSession, privateKey);

	fs.writeFileSync(pathToPublic, publicKey);
	fs.writeFileSync(pathToPrivate, encryptedPrivateKeyHex);

	return key;
};

module.exports = {
	generateRsaKeys,
};
