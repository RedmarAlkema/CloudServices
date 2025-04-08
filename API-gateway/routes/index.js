const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/authMiddleware');
const axios = require('axios');
const registry = require('./registry.json');

router.all('/:apiName/:path', authMiddleware, async (req, res) => {
  console.log('Toegang toegestaan voor gebruiker:', req.user);
  try{
    const service = registry.services[req.params.apiName];
    const targetUrl = service.url;

    const response = await axios({
        method: req.method,
        url: targetUrl,
        headers: {
            'Authorization': req.headers['authorization'],
            'x-gateway-key': process.env.GATEWAY_KEY
        },
        data: req.body,
    });
    res.status(response.status).send(response.data);
} catch (err) {
  res.status(err.response?.status || 500).send(err.response?.data || { message: 'Gateway error' });
}
});

module.exports = router;
