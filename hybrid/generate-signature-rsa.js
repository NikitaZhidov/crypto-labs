const {
	PATH_TO_PUBLIC_SIGNATURE,
	PATH_TO_PRIVATE_SIGNATURE,
} = require('./constants');

const { generateRsaKeys } = require('./utils/generate-keys');
const { question } = require('./utils/question');

question('Enter password for private key: ').then((password) => {
	generateRsaKeys(
		PATH_TO_PUBLIC_SIGNATURE,
		PATH_TO_PRIVATE_SIGNATURE,
		password
	);
});
