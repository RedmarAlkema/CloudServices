require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/authMiddleware');
const axios = require('axios');
const registry = require('./registry.json');
const multer = require('multer');
const FormData = require('form-data'); 

const upload = multer(); 

router.use(upload.any()); 

router.delete('/delete/:apiName/:resourceId', authMiddleware, async (req, res) => {
  const { apiName, resourceId } = req.params;
  const service = registry.services[apiName];

  if (!service) {
    return res.status(404).json({ message: `Service "${apiName}" niet gevonden` });
  }

  const targetUrl = `${service.url.replace(/\/$/, '')}/${resourceId}`;
  console.log("🗑️ DELETE naar:", targetUrl);

  try {
    const response = await axios.delete(targetUrl, {
      headers: {
        'Authorization': req.headers['authorization'],
        'x-gateway-key': process.env.GATEWAY_KEY
      }
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error('❗ Fout bij DELETE-verzoek:', err);
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: 'Gateway error' };
    res.status(status).send(data);
  }
});


router.all('/:apiName/*', authMiddleware, async (req, res) => {
  const apiName = req.params.apiName;
  const service = registry.services[apiName];

  if (!service) {
    return res.status(404).json({ message: `Service "${apiName}" niet gevonden` });
  }

  const subPath = req.originalUrl.split('/').slice(2).join('/');
  const targetUrl = `${service.url}${subPath}`;

  try {
    const form = new FormData();

    for (const [key, value] of Object.entries(req.body)) {
      form.append(key, value);
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        form.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }

    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...form.getHeaders(), 
        'Authorization': req.headers['authorization'], 
        'x-gateway-key': process.env.GATEWAY_KEY 
      },
      data: form 
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error('❗ Fout bij doorsturen naar target service:', err);

    res.status(err.response?.status || 500).send(err.response?.data || { message: 'Gateway error' });
  }
});

module.exports = router;