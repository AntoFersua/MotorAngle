const express = require('express');
const router = express.Router();
const controller = require('../controllers/setup.controller');

router.post('/setupGeometry', controller.configuracionGeometriaMasaUsuario);
router.post('/setupCompuesto', controller.configuracioncompuestoRuedas);

module.exports = router;    