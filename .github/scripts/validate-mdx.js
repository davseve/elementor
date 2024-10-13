const fs = require('fs');
const mdx = require('@mdx-js/mdx');

const inputFile = process.argv[2];

fs.readFile(inputFile, 'utf-8', (err, data) => {
	if (err) {
		console.error('Error reading MDX string:', err);
		process.exit(1);
	}

	try {
		mdx.sync(data); // This will throw an error if the MDX is invalid
		console.log('MDX validation successful');
	} catch (error) {
		console.error('MDX validation failed:', error.message);
		process.exit(1);
	}
});
