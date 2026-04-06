const path = require('path');

function detectLanguage(filePath) {
    const ext = path.extname(filePath);

    if (ext === '.js') return 'javascript';
    if (ext === '.ts') return 'typescript';
    if (ext === '.py') return 'python';
    if (ext === '.java') return 'java';
    if (ext === '.cpp') return 'cpp';

    return 'unknown';
}

module.exports = { detectLanguage };