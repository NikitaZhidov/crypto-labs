const { RSA_FORMAT, HEX_BLOCKS_DELIMITER } = require('../constants');

const Rsa = require('node-rsa');
const fs = require('fs');
const aesjs = require('aes-js');
const sha256 = require('sha256');
const {
	getAesKeyFromPassword,
	getAesEncryptedHexWithDelimiter,
} = require('./aes-encrypt');

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

	const encryptedPrivateKeyHexWithDelimiter = getAesEncryptedHexWithDelimiter(
		aesSession,
		privateKey,
		HEX_BLOCKS_DELIMITER
	);

	fs.writeFileSync(pathToPublic, publicKey);
	fs.writeFileSync(pathToPrivate, encryptedPrivateKeyHexWithDelimiter);

	return key;
};

module.exports = {
	generateRsaKeys,
};
