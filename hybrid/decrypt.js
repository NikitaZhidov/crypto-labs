const {
	PATH_TO_PRIVATE_RSA,
	RSA_FORMAT,
	PATH_TO_SESSION_KEY,
	HEX_BLOCKS_DELIMITER,
	PATH_TO_PUBLIC_SIGNATURE,
	PATH_TO_SIGNATURE_CONTENT,
} = require('./constants');

const fs = require('fs');
const path = require('path');

const Rsa = require('node-rsa');
const aesjs = require('aes-js');
const sha256 = require('sha256');
const {
	getAesDecryptedFileContent,
	getDecryptedFileContentByPassword,
} = require('./utils/aes-encrypt');
const { question } = require('./utils/question');

const readRsaPrivateKey = (password = '') => {
	const privateKey = getDecryptedFileContentByPassword(
		PATH_TO_PRIVATE_RSA,
		password
	);

	const key = new Rsa().importKey(privateKey, `${RSA_FORMAT}-private`);

	if (!key.isPrivate()) {
		throw new Error('Invalid private key');
	}

	return key;
};

const readSignaturePublicKey = () => {
	const publicKey = fs.readFileSync(PATH_TO_PUBLIC_SIGNATURE).toString();

	const key = new Rsa().importKey(publicKey, `${RSA_FORMAT}-public`);

	if (!key.isPublic()) {
		throw new Error('Invalid public key');
	}

	return key;
};

const readEncryptedSessionKey = () => {
	const key = fs.readFileSync(PATH_TO_SESSION_KEY, 'utf-8');

	return key.split('-');
};

const readEncryptedFileContent = (filename) => {
	const fileContentBuffer = fs.readFileSync(
		path.resolve(__dirname, 'encrypted', filename),
		'utf-8'
	);

	const fileContent = fileContentBuffer.toString();

	return fileContent;
};

const readSignatureContent = (publicKey) => {
	const encryptedSignatureContent = fs
		.readFileSync(PATH_TO_SIGNATURE_CONTENT)
		.toString();

	const decryptedSignature = publicKey.decryptPublic(
		Buffer.from(encryptedSignatureContent, 'hex'),
		'utf-8'
	);

	return decryptedSignature;
};

// filename in "encrypted" directory
const main = (filename, password) => {
	const rsaPrivateKey = readRsaPrivateKey(password);

	const signaturePublicKey = readSignaturePublicKey();
	const signatureContent = readSignatureContent(signaturePublicKey);

	const [encryptedSessionKeyHex, encryptedInitVectorArr] =
		readEncryptedSessionKey();

	const sessionKeyHexString = rsaPrivateKey.decrypt(
		Buffer.from(encryptedSessionKeyHex, 'hex'),
		'utf-8'
	);

	const initVectorHexString = rsaPrivateKey.decrypt(
		Buffer.from(encryptedInitVectorArr, 'hex'),
		'utf-8'
	);

	const sessionKeyArr = aesjs.utils.hex.toBytes(sessionKeyHexString);
	const initVectorArr = aesjs.utils.hex.toBytes(initVectorHexString);

	const encryptedFileContentHexWithDelimiter =
		readEncryptedFileContent(filename);

	const fileContent = getAesDecryptedFileContent(
		encryptedFileContentHexWithDelimiter,
		[sessionKeyArr, initVectorArr],
		HEX_BLOCKS_DELIMITER
	);

	const contentHash = sha256(fileContent.trim());

	console.log('content sha256 hash:', contentHash);
	console.log('signature:', signatureContent);
	console.log('Signature is valid:', contentHash === signatureContent);
	console.log('');
	console.log('Decrypted file content:');
	console.log(fileContent);
};

question(`Enter rsa private key password: `).then((password) => {
	main('encrypted_test.txt', password);
});
