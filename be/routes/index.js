const express=require('express');
const router=express.Router()
const repoRoutes=require('./api/repoRoutes');

router.use('/repo',repoRoutes)

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports=router