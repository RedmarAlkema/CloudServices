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
router.all('/:apiName/*', authMiddleware, async (req, res) => {
  const apiName = req.params.apiName;
  const service = registry.services[apiName];

  if (!service) {
    return res.status(404).json({ message: `Service "${apiName}" niet gevonden` });
  }
  console.log("registry is gevonden: ",registry.services[apiName]);

  const subPath = req.originalUrl.split('/').slice(2).join('/');
  const targetUrl = `${service.url}${subPath}`;
  console.log("target url gemaakt: ", targetUrl);

  try {
    const form = new FormData();

    for (const [key, value] of Object.entries(req.body)) {
      form.append(key, value);
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        console.log(`Bestand toegevoegd: ${file.originalname}, type: ${file.mimetype}`);
        form.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }
    console.log("voorbij lijn 43");

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
    console.log("voorbij lijn 55");

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