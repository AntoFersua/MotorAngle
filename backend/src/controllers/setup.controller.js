let geometriaMasaUsuario = {
  pesoMoto: 150,
  pesoPiloto: 75,
  alturaMoto: 735,
  distanciaEjes: 1375,
  Date: new Date().toISOString(),
};

let ruedasUsuario = {
  compuesto: "",
  ruedaDelantera: {
    dimension: "205/55 R16",
    presionCaliente: 2.3,
    marca: "",
    modelo: "",
  },
  ruedaTrasera: {
    dimension1: "205/55 R16",
    presionCaliente1: 2.6,
    marca: "Michelin",
    modelo: "sport II",
  },
};

let tiposDeCompuesto = {
  slickCarreras: { coeficiente: 1.35, description: "" },
  semislicks: { coeficiente: 1.2, description: "" },
  calleDeportivo: { coeficiente: 1.05, description: "" },
  sportTouring: { coeficiente: 0.95, description: "" },
};

exports.configuracionGeometriaMasaUsuario = (req, res) => {
  try {
    const { pesoMoto, pesoPiloto, alturaMoto, distanciaEjes } = req.body;
    if (
      pesoMoto === undefined ||
      pesoPiloto === undefined ||
      alturaMoto === undefined ||
      distanciaEjes === undefined
    ) {
      return res.status(400).json({
        success: false,
        menssage:
          "Faltan parámetros obligatorios (peso moto, peso piloto, altura moto, distancia entre ejes",
      });
    }

    geometriaMasaUsuario = {
      pesoMoto: Number(pesoMoto), //poner operadores ternarios
      pesoPiloto: Number(pesoPiloto),
      alturaMoto: Number(alturaMoto),
      distanciaEjes: Number(distanciaEjes),
      Date: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: "Geometría y masas actualizadas correctamente",
      data: geometriaMasaUsuario,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Hubo un error en la configuracion",
    });
  }
};

exports.configuracioncompuestoRuedas = (req, res) => {
  try {
    const { compuestoRueda, ruedaDelantera, ruedaTrasera } = req.body;

    // Validación previa para evitar romper la destructuración si no envían las ruedas
    if (!compuestoRueda || !ruedaDelantera || !ruedaTrasera) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan objetos principales (compuestoRueda, ruedaDelantera o ruedaTrasera)",
      });
    }

    const { dimension: dimDel, presionCaliente: presDel } = ruedaDelantera;
    const { dimension: dimTras, presionCaliente: presTras } = ruedaTrasera;

    // Validar compuesto y campos de las ruedas
    if (
      !(compuestoRueda in tiposDeCompuesto) ||
      !dimDel ||
      !dimTras ||
      presDel === undefined ||
      presTras === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Compuesto no válido o falta información en los neumáticos",
      });
    }

    ruedasUsuario = {
      compuesto: compuestoRueda,
      coeficienteAgarre: tiposDeCompuesto[compuestoRueda].coeficiente, // Añadimos el coeficiente extraído
      ruedaDelantera: {
        dimension: dimDel,
        presionCaliente: Number(presDel),
        marca: ruedaDelantera.marca || "",
        modelo: ruedaDelantera.modelo || "",
      },
      ruedaTrasera: {
        dimension: dimTras,
        presionCaliente: Number(presTras),
        marca: ruedaTrasera.marca || "",
        modelo: ruedaTrasera.modelo || "",
      },
    };

    return res.status(200).json({
      success: true,
      message: "Configuración de neumáticos actualizada correctamente",
      data: ruedasUsuario,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Hubo un error en la configuracion",
    });
  }
};

//para futuro usar API de modelos de moto
exports.perfilMoto = (req, res) => {
try {
  


} catch (error) {
  
}
}