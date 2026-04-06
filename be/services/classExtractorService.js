const fs = require('fs');
const parser = require('@babel/parser');

function extractClassesFromJS(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');

    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['classProperties']
    });

    const classes = [];

    ast.program.body.forEach(node => {
        if (node.type === 'ClassDeclaration') {
            const className = node.id.name;

            let methods = [];
            let attributes = [];

            node.body.body.forEach(member => {
                if (member.type === 'ClassMethod') {
                    methods.push(member.key.name);
                }

                if (member.type === 'ClassProperty') {
                    attributes.push(member.key.name);
                }
            });

            let parentClass = null;
            if (node.superClass) {
                parentClass = node.superClass.name;
            }

            classes.push({
                name: className,
                methods,
                attributes,
                extends: parentClass,
                file: filePath
            });
        }
    });

    return classes;
}

module.exports = { extractClassesFromJS };