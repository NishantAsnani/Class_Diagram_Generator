const { scanRepoFiles } = require('./fileScannerService');
const { detectLanguage } = require('../utils/languageDetector');
const { extractClassesFromJS } = require('./classExtractorService');
const {parseCppFile}=require('./parsers/cppParser')
const {parseJSFile}=require('./parsers/jsParser')
const {parseJavaFile}=require('./parsers/javaParser')

async function parseRepository(repoPath) {
    const files = await scanRepoFiles(repoPath);

    let allClasses = [];
    let relations = [];

    for (const file of files) {
        const lang = detectLanguage(file);

        let classes = [];
        let rels = [];

        if (lang === 'javascript') {
            const result = await parseJSFile(file);
            classes = result.classes;
            rels = result.relations;
        }

        if (lang === 'java') {
            const result = await parseJavaFile(file);
            classes = result.classes;
            rels = result.relations;
        }

        if (lang === 'cpp') {
            const result = await parseCppFile(file);
            classes = result.classes;
            rels = result.relations;
        }

        allClasses.push(...classes);
        relations.push(...rels);
    }

    return {
        classes: allClasses,
        relations: relations
    };
}

module.exports = { parseRepository };