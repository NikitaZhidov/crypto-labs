const { PATH_TO_PUBLIC_RSA, PATH_TO_PRIVATE_RSA } = require('./constants');
const { generateRsaKeys } = require('./utils/generate-keys');
const { question } = require('./utils/question');

question('Enter password for private key: ').then((password) => {
	generateRsaKeys(PATH_TO_PUBLIC_RSA, PATH_TO_PRIVATE_RSA, password);
});
