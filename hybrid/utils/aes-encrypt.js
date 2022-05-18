const { getRandomInt } = require('../../helpers/crypto-helpers');
const fs = require('fs');

const AES_KEY_TYPE = {
	k128: 128,
	k192: 192,
	k256: 256,
};

const aesjs = require('aes-js');
const sha256 = require('sha256');
const { convertToMultipleOf16Bytes } = require('./utils');

const generateAesKeyAndInitVector = (type = AES_KEY_TYPE.k128) => {
	let arrayLength = 16;

	switch (type) {
		case AES_KEY_TYPE.k192:
			arrayLength = 24;
			break;
		case AES_KEY_TYPE.k256:
			arrayLength = 32;
			break;
		case AES_KEY_TYPE.k128:
		default:
			arrayLength = 16;
			break;
	}

	const targetArr = new Array(arrayLength)
		.fill(0)
		.map(() => getRandomInt(0, 255));

	const initVector = new Array(arrayLength)
		.fill(0)
		.map(() => getRandomInt(0, 255));

	return [new Uint8Array(targetArr), new Uint8Array(initVector)];
};

const getAesEncryptedHex = (aesSession, content) => {
	const correctContent = convertToMultipleOf16Bytes(content);

	const encryptedBytes = aesSession.encrypt(
		aesjs.utils.utf8.toBytes(correctContent)
	);

	const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

	return encryptedHex;
};

const getAesDecryptedFileContent = (
	encryptedFileContentHex,
	[aesKeyArr, initVectorArr]
) => {
	const aesSessionCBC = new aesjs.ModeOfOperation.cbc(aesKeyArr, initVectorArr);

	const encryptedBytes = aesjs.utils.hex.toBytes(encryptedFileContentHex);
	const decryptedBytes = aesSessionCBC.decrypt(encryptedBytes);

	return aesjs.utils.utf8.fromBytes(decryptedBytes);
};

const getDecryptedFileContentByPassword = (pathToFile, password) => {
	const encryptedFileContentHex = fs.readFileSync(pathToFile).toString();

	const [sessionKeyArr, initVectorArr] = getAesKeyFromPassword(password);

	const decryptedFileContent = getAesDecryptedFileContent(
		encryptedFileContentHex,
		[sessionKeyArr, initVectorArr]
	).trim();

	return decryptedFileContent;
};

const getAesKeyFromPassword = (password, aesKeyType = AES_KEY_TYPE.k128) => {
	const sessionKeyHash = sha256(password);
	const initVectorHash = sha256.x2(password);

	let keyLength = 16;

	switch (aesKeyType) {
		case AES_KEY_TYPE.k192:
			keyLength = 24;
			break;
		case AES_KEY_TYPE.k256:
			keyLength = 32;
			break;
		case AES_KEY_TYPE.k128:
		default:
			keyLength = 16;
			break;
	}

	const sessionKeyArr = sessionKeyHash
		.split('')
		.slice(0, keyLength)
		.map((_, i) => sessionKeyHash.charCodeAt(i));

	const initVectorArr = initVectorHash
		.split('')
		.slice(0, keyLength)
		.map((_, i) => initVectorHash.charAt(i));

	return [new Uint8Array(sessionKeyArr), new Uint8Array(initVectorArr)];
};

module.exports = {
	getAesEncryptedHex,
	getDecryptedFileContentByPassword,
	getAesDecryptedFileContent,
	generateAesKeyAndInitVector,
	AES_KEY_TYPE,
	getAesKeyFromPassword,
};
