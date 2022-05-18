const readline = require('readline');

const question = (questionText = '') => {
	return new Promise((res, rej) => {
		try {
			const interface = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			interface.question(questionText, (userInput) => {
				res(userInput);
				interface.close();
			});
		} catch (e) {
			rej(e);
		}
	});
};

module.exports = {
	question,
};
