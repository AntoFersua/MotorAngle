const express = require('express');
const router = express.Router();
const controller = require('../controllers/telemetry.controller');

router.get('/led-config', controller.configuracionLedUsuario);
router.put('/led-config', controller.actualizacionConfiguracionLed);
router.post('/telemetry-session', controller.guardarSesionTelemetria);

module.exports = router;    