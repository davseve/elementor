const fs = require('fs');
const path = require('path');

// Function to insert the string at the correct position
function insertStringInFile(filePath, insertText) {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const lines = fileContent.split('\n');

	// Find the '== Changelog ==' line
	const changelogIndex = lines.findIndex(line => line.trim() === '== Changelog ==');
	if (changelogIndex === -1) {
		console.error(`"== Changelog ==" title not found in ${filePath}`);
		process.exit(1);
	}

	// Insert text two lines below the title
	const insertionLine = changelogIndex + 2;
	lines.splice(insertionLine, 0, insertText);

	// Write the modified content back to the file
	fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
}

const mdxString = process.argv[2];

const filesToUpdate = [
	path.join(__dirname, '../readme.txt'),
	path.join(__dirname, '../changelog.txt')
];

filesToUpdate.forEach(filePath => {
	insertStringInFile(filePath, mdxString);
});
