const express = require('express');
const router = express.Router();
const controller = require('../controllers/calibration.controller');

router.post('/calibracionPerfilHardware', controller.calibracionPerfilHardware);

module.exports = router;    