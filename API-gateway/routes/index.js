require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const express = require('express');
const router = express.Router();
const authMiddleware = require('../../auth/middleware/authMiddleware');
const axios = require('axios');
const registry = require('./registry.json');
const multer = require('multer');
const FormData = require('form-data'); // Zorg ervoor dat FormData is geïmporteerd

const upload = multer(); // Gebruik multer zonder configuratie voor bestandshantering

router.use(upload.any()); // Gebruik .any() om meerdere bestandsvelden toe te staan

router.all('/:apiName/*', authMiddleware, async (req, res) => {
  const apiName = req.params.apiName;
  const service = registry.services[apiName];

  // Als de service niet bestaat in de registry, stuur een 404 terug
  if (!service) {
    return res.status(404).json({ message: `Service "${apiName}" niet gevonden` });
  }

  const subPath = req.originalUrl.split('/').slice(2).join('/');
  const targetUrl = `${service.url}${subPath}`;

  try {
    const form = new FormData();

    // Voeg de velden uit de body toe aan FormData (zoals userId, targetId)
    for (const [key, value] of Object.entries(req.body)) {
      form.append(key, value);
    }

    // Voeg de bestanden toe aan de FormData als ze aanwezig zijn
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // We gebruiken file.buffer in plaats van file.stream
        console.log(`Bestand toegevoegd: ${file.originalname}, type: ${file.mimetype}`);
        form.append(file.fieldname, file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
      });
    }

    // Voer de request uit naar de target microservice
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...form.getHeaders(), // Voeg de juiste headers toe voor FormData
        'Authorization': req.headers['authorization'], // Voeg de Authorization header toe
        'x-gateway-key': process.env.GATEWAY_KEY // Voeg de Gateway Key toe voor authenticatie
      },
      data: form // Zend de FormData als body van de request
    });

    // Stuur het antwoord van de target microservice terug naar de client
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