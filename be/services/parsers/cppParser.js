// services/parsers/cppParser.js
const fs = require('fs');

async function parseCppFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const classes = [];
    const relations = [];

    const classRegex = /class\s+(\w+)(\s*:\s*public\s+(\w+))?/g;
    let classMatch;

    while ((classMatch = classRegex.exec(content)) !== null) {
        const className = classMatch[1];
        const parentClass = classMatch[3];

        const attributes = [];
        const methods = [];

        // Attributes
        const attrRegex = /\w+\s+(\w+);/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(content)) !== null) {
            attributes.push(attrMatch[1]);
        }

        // Methods
        const methodRegex = /\w+\s+(\w+)\s*\(/g;
        let methodMatch;
        while ((methodMatch = methodRegex.exec(content)) !== null) {
            methods.push(methodMatch[1] + '()');
        }

        classes.push({
            name: className,
            attributes,
            methods,
            language: 'C++',
            file: filePath
        });

        if (parentClass) {
            relations.push({
                from: className,
                to: parentClass,
                type: 'inheritance'
            });
        }
    }

    return { classes, relations };
}

module.exports = { parseCppFile };