let calibracion = {
    compensacionPata: true,
    gananciaKalman: 0.70,
    filtroAntivibracion: 15,
    tasaTelemetria: 50,
    Date: new Date().toISOString(),
};

exports.calibracionPerfilHardware = (req, res) =>{
    try {
        const {compensacionPata, gananciaKalman, filtroAntivibracion, tasaTelemetria} = req.body;

        if (compensacionPata===undefined ||
            gananciaKalman===undefined ||
            filtroAntivibracion===undefined ||
            tasaTelemetria===undefined ) {
            
                return res.status(400).json({
                    success: false,
                    menssage: "Faltan parametros obligatorios",
                });
        }

        calibracion={
            compensacionPata: compensacionPata,
            gananciaKalman: gananciaKalman,
            filtroAntivibracion: filtroAntivibracion,
            tasaTelemetria: tasaTelemetria,

        };
        return res.status(200).json({
      success: true,
      message: "calibración efectuada correctamente",
      data: calibracion,
    });
    } catch (error) {
        return res.status(400).json({
            success: false,
            menssage: "Calibración efectuada erroneamente",
        })
    }
}