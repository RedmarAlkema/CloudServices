const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/authMiddleware');

router.all('/:apiName', authMiddleware, (req, res) => {
  console.log('Toegang toegestaan voor gebruiker:', req.user);
  res.send(`API opgeroepen: ${req.params.apiName}`);
});

module.exports = router;
