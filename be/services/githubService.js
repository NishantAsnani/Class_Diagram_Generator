const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs-extra');

async function cloneRepo(repoUrl) {
    try {
        const repoName = repoUrl.split('/').pop().replace('.git', '');

        // Use process.cwd() or an absolute path instead of __dirname
        const tempDir = path.join(process.cwd(), 'tempRepos');
        const localPath = path.join(tempDir, repoName);

        // Ensure the parent tempRepos directory exists first
        await fs.ensureDir(tempDir);

        const exists = await fs.pathExists(localPath);
        if (exists) {
            await fs.remove(localPath);
        }


        const git = simpleGit();    
        await git.clone(repoUrl, localPath);

        return localPath;
    } catch (error) {
        throw new Error(`Repository clone failed: ${error.message}`);
    }
}

module.exports = { cloneRepo };