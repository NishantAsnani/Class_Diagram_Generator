// services/parsers/jsParser.js
const fs = require('fs');

async function parseJSFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const classes = [];
    const relations = [];

    // Detect classes
    const classRegex = /class\s+(\w+)(\s+extends\s+(\w+))?/g;
    let classMatch;

    while ((classMatch = classRegex.exec(content)) !== null) {
        const className = classMatch[1];
        const parentClass = classMatch[3];

        const attributes = [];
        const methods = [];

        // Attributes (this.property)
        const attrRegex = /this\.(\w+)/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(content)) !== null) {
            attributes.push(attrMatch[1]);
        }

        // Methods
        const methodRegex = /(\w+)\s*\([^)]*\)\s*{/g;
        let methodMatch;
        while ((methodMatch = methodRegex.exec(content)) !== null) {
            const methodName = methodMatch[1];
            if (methodName !== 'constructor') {
                methods.push(methodName + '()');
            }
        }

        classes.push({
            name: className,
            attributes,
            methods,
            language: 'JavaScript',
            file: filePath
        });

        // Inheritance
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

module.exports = { parseJSFile };