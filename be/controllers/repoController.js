const { cloneRepo } = require('../services/githubService');
const { parseRepository } = require('../services/parserService');

async function analyzeRepo(req, res) {
    try {
        const { repoUrl } = req.body;

        const repoPath = await cloneRepo(repoUrl);
        const result = await parseRepository(repoPath);

        console.log(result);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Analysis failed' });
    }
}

module.exports = { analyzeRepo };