const aesjs = require('aes-js');

const convertToMultipleOf16Bytes = (str) => {
	const strBytesLength = aesjs.utils.utf8.toBytes(str).length;

	const remainder = strBytesLength % 16;
	const padding = remainder === 0 ? 0 : 16 - remainder;

	const correctStr = str + ' '.repeat(padding);

	return correctStr;
};

module.exports = {
	convertToMultipleOf16Bytes,
};
