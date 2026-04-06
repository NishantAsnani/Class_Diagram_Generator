// services/parsers/javaParser.js
const fs = require('fs');

async function parseJavaFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const classes = [];
    const relations = [];

    const classRegex = /class\s+(\w+)(\s+extends\s+(\w+))?/g;
    let classMatch;

    while ((classMatch = classRegex.exec(content)) !== null) {
        const className = classMatch[1];
        const parentClass = classMatch[3];

        const attributes = [];
        const methods = [];

        // Attributes
        const attrRegex = /(private|public|protected)\s+\w+\s+(\w+);/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(content)) !== null) {
            attributes.push(attrMatch[2]);
        }

        // Methods
        const methodRegex = /(public|private|protected)\s+\w+\s+(\w+)\s*\(/g;
        let methodMatch;
        while ((methodMatch = methodRegex.exec(content)) !== null) {
            methods.push(methodMatch[2] + '()');
        }

        classes.push({
            name: className,
            attributes,
            methods,
            language: 'Java',
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

module.exports = { parseJavaFile };