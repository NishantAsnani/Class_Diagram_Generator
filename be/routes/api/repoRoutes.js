const express = require('express');
const router = express.Router();
const { analyzeRepo } = require('../../controllers/repoController');

router.post('/analyze', analyzeRepo);

module.exports = router;