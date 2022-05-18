const path = require('path');

const PATH_TO_PUBLIC_KEYS = path.resolve(__dirname, 'credentials', 'public');
const PATH_TO_PRIVATE_KEYS = path.resolve(__dirname, 'credentials', 'private');

const RSA_FORMAT = 'pkcs8';

const PATH_TO_PUBLIC_RSA = path.resolve(PATH_TO_PUBLIC_KEYS, 'rsa-public.txt');

const PATH_TO_PRIVATE_RSA = path.resolve(
	PATH_TO_PRIVATE_KEYS,
	'rsa-private.txt'
);

const PATH_TO_PUBLIC_SIGNATURE = path.resolve(
	'credentials',
	'signature',
	'public.txt'
);
const PATH_TO_PRIVATE_SIGNATURE = path.resolve(
	'credentials',
	'signature',
	'private.txt'
);
const PATH_TO_SIGNATURE_CONTENT = path.resolve(
	'credentials',
	'signature',
	'signature.txt'
);

const PATH_TO_SESSION_KEY = path.resolve(
	PATH_TO_PUBLIC_KEYS,
	'aes-session.txt'
);

const PATH_TO_PRIVATE_RSA_PASSWORD_HASH = path.resolve(
	PATH_TO_PRIVATE_KEYS,
	'rsa-private-password.txt'
);

const PATH_TO_PRIVATE_SIGNATURE_PASSWORD_HASH = path.resolve(
	__dirname,
	'credentials',
	'signature',
	'private-password.txt'
);

const HEX_BLOCKS_DELIMITER = '|';

module.exports = {
	PATH_TO_PRIVATE_KEYS,
	PATH_TO_PUBLIC_KEYS,
	PATH_TO_PRIVATE_RSA,
	PATH_TO_PUBLIC_RSA,
	PATH_TO_SESSION_KEY,
	PATH_TO_PRIVATE_SIGNATURE,
	PATH_TO_PUBLIC_SIGNATURE,
	HEX_BLOCKS_DELIMITER,
	PATH_TO_SIGNATURE_CONTENT,
	RSA_FORMAT,
};
