require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/authMiddleware');
const axios = require('axios');
const registry = require('./registry.json');

router.all('/:apiName/*', authMiddleware, async (req, res) => {
  console.log('🔐 Toegang toegestaan voor gebruiker:', req.user);

  const apiName = req.params.apiName;
  const service = registry.services[apiName];

  if (!service) {
    console.error(`❌ Service "${apiName}" niet gevonden in registry.`);
    return res.status(404).json({ message: `Service "${apiName}" niet gevonden` });
  }

  const subPath = req.originalUrl.split('/').slice(2).join('/');
  const targetUrl = `${service.url}${subPath}`;

  try {
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
    console.error('❗ Fout bij doorsturen naar target service:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });

    res.status(err.response?.status || 500).send(err.response?.data || { message: 'Gateway error' });
  }
});

module.exports = router;
