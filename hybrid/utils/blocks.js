const getStringBlocks = (str, blockSize) => {
	if (blockSize === 0 || !Boolean(blockSize)) {
		return [];
	}

	let buf = Buffer.from(str);
	const result = [];

	while (buf.length) {
		result.push(buf.slice(0, blockSize).toString());
		buf = buf.slice(blockSize);
	}

	while (result[result.length - 1].length < blockSize) {
		result[result.length - 1] = result[result.length - 1] + ' ';
	}

	return result;
};

module.exports = { getStringBlocks };
