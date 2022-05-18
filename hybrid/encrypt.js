const fs = require('fs');
const path = require('path');

const Rsa = require('node-rsa');
const sha256 = require('sha256');

const aesjs = require('aes-js');

const { convertToMultipleOf16Bytes } = require('./utils/utils');

const {
	PATH_TO_PUBLIC_RSA,
	RSA_FORMAT,
	PATH_TO_SESSION_KEY,
	PATH_TO_PRIVATE_SIGNATURE,
	PATH_TO_SIGNATURE_CONTENT,
} = require('./constants');

const {
	getAesEncryptedHex,
	generateAesKeyAndInitVector,
	getDecryptedFileContentByPassword,
} = require('./utils/aes-encrypt');
const { question } = require('./utils/question');

const readRsaPublicKey = () => {
	const publicKey = fs.readFileSync(PATH_TO_PUBLIC_RSA).toString();

	const key = new Rsa().importKey(publicKey, `${RSA_FORMAT}-public`);
	return key;
};

const writeSessionKey = ([sessionKeyArr, initVectorArr], rsaPublicKey) => {
	const sessionKeyHexString = aesjs.utils.hex.fromBytes(sessionKeyArr);
	const initVectorHexString = aesjs.utils.hex.fromBytes(initVectorArr);

	const encryptedSessionKeyHex = rsaPublicKey.encrypt(
		sessionKeyHexString,
		'hex'
	);

	const encryptedInitVectorHex = rsaPublicKey.encrypt(
		initVectorHexString,
		'hex'
	);

	fs.writeFileSync(
		PATH_TO_SESSION_KEY,
		encryptedSessionKeyHex + '-' + encryptedInitVectorHex
	);
};

const readFileContent = (filename) => {
	const fileContentBuffer = fs.readFileSync(
		path.resolve(__dirname, 'source', filename),
		'utf-8'
	);

	const fileContent = convertToMultipleOf16Bytes(fileContentBuffer.toString());

	return fileContent;
};

const writeEncryptedFile = (content, filename) => {
	fs.writeFileSync(
		path.resolve(__dirname, 'encrypted', `encrypted_${filename}`),
		content
	);
};

const writeSignature = (content = '', privateKeyPass) => {
	const privateKey = getDecryptedFileContentByPassword(
		PATH_TO_PRIVATE_SIGNATURE,
		privateKeyPass
	).trim();

	const key = new Rsa().importKey(privateKey, `${RSA_FORMAT}-private`);

	const encryptedSignature = key.encryptPrivate(content, 'hex');

	fs.writeFileSync(PATH_TO_SIGNATURE_CONTENT, encryptedSignature);
};

// filename in "source" directory
const main = (filename, signaturePrivateKeyPass) => {
	const [sessionKeyArr, initVectorArr] = generateAesKeyAndInitVector();
	const rsaPublicKey = readRsaPublicKey();

	writeSessionKey([sessionKeyArr, initVectorArr], rsaPublicKey);

	const content = readFileContent(filename);

	writeSignature(sha256(content.trim()), signaturePrivateKeyPass);

	const aesSessionCBC = new aesjs.ModeOfOperation.cbc(
		sessionKeyArr,
		initVectorArr
	);

	const encryptedContent = getAesEncryptedHex(aesSessionCBC, content);

	writeEncryptedFile(encryptedContent, filename);
};

question(`Enter signature private key password: `).then((password) => {
	main('test.txt', password);
});
