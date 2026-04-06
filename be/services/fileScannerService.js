const { glob } = require('glob');
const path = require('path');

async function scanRepoFiles(repoPath) {
    try {
        const files = await glob('**/*.{js,ts,py,java,cpp,jsx,tsx}', {
            cwd: repoPath,                  // set base dir instead of prefixing path
            absolute: true,                 // return absolute paths directly
            ignore: [
                '**/node_modules/**',       // biggest win — skip dependencies
                '**/dist/**',
                '**/build/**',
                '**/.git/**',
                '**/coverage/**',
                '**/vendor/**',
                '**/__pycache__/**',
                '**/*.min.js',              // skip minified files
                '**/*.test.{js,ts}',        // skip test files if not needed
                '**/*.spec.{js,ts}',
            ],
            follow: false,                  // don't follow symlinks (avoids loops)
            nodir: true,                    // only return files, not directories
        });

        return files;

    } catch (error) {
        throw new Error(`File scan failed: ${error.message}`);
    }
}

module.exports = { scanRepoFiles };