// Simulamos la base de datos con variables en memoria
let configuracionLedUsuario = {
  anguloAmarillo: 35.0,     // Grados para encender LED amarillo
  anguloRojo: 45.0,        // Grados para encender LED rojo
  anguloMaximo: 54.0,        // Límite de inclinación para alerta
  duracionEncendidoms: 2000,  // Tiempo que el LED se queda encendido tras la curva
  Date: new Date().toISOString()
};

const telemetriaSesiones = [];

exports.configuracionLedUsuario = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      config: configuracionLedUsuario
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizacionConfiguracionLed = (req, res) => {
  try {
    const { anguloAmarillo, anguloRojo, anguloMaximo, duracionEncendidoms } = req.body; // se puede hacer const anguloAmarillo = req.body.anguloAmarillo;

    if (anguloAmarillo === undefined || anguloRojo === undefined || anguloMaximo === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan parámetros obligatorios (angulo Amarillo, angulo Rojo, angulo Maximo)' 
      });
    }

    configuracionLedUsuario = {
      anguloAmarillo: Number(anguloAmarillo),
      anguloRojo: Number(anguloRojo),
      anguloMaximo: Number(anguloMaximo),
      duracionEncendidoms: duracionEncendidoms ? Number(duracionEncendidoms) : configuracionLedUsuario.duracionEncendidoms,
      Date: new Date().toISOString()
    };

    console.log('[Backend] Configuración LED actualizada:', configuracionLedUsuario);

    res.status(200).json({
      success: true,
      message: 'Configuración actualizada correctamente',
      configuracionActualizada: configuracionLedUsuario
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.guardarSesionTelemetria = (req, res) => {
  try {
    const sessionData = req.body;
    
    const nuevaSesion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...sessionData
    };

    telemetriaSesiones.push(nuevaSesion);
    console.log(`[Backend] Sesión de telemetría guardada. Total: ${telemetriaSesiones.length}`);

    res.status(201).json({
      success: true,
      message: 'Tanda guardada con éxito',
      sessionId: nuevaSesion.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};