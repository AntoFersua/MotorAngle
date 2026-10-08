function convertirAGrados(radianes) {
  return radianes * (180 / Math.PI);
}


exports.calcularAnguloCritico = (ruedas, geometria) => {
  if (!geometria || !ruedas) {
    throw new Error(
      "Es obligatorio proporcionar los objetos de geometría y ruedas",
    );
  }
  const { pesoMoto, pesoPiloto, alturaMoto, distanciaEjes } = geometria;
  const { compuesto, ruedaDelantera, ruedaTrasera } = ruedas;

  if (pesoMoto <= 0 || distanciaEjes <= 0) {
    throw new Error('Los valores dimensionales y de peso deben ser mayores a cero');
  }
  const pesoTotal= pesoMoto + pesoPiloto;
  const centroGravedadEstimado= alturaMoto * 0.45;

const anguloTeoricoRadianes = Math.atan((distanciaEjes / 2) / centroGravedadEstimado);
  let anguloGrados = convertirAGrados(anguloTeoricoRadianes);

  const presionPromedio = (ruedaDelantera.presionCaliente + ruedaTrasera.presionCaliente1) / 2;
  const factorAdherencia = presionPromedio > 2.0 ? 1.0 : 0.9; 

  const anguloFinal = parseFloat((anguloGrados * factorAdherencia).toFixed(2));


  return {
    anguloCritico: anguloFinal,
    pesoTotalKg: pesoTotal,
  };
};


exports.calcularTransferenciaCarga = (geometria, desaceleracionG) => {
  if (!geometria || desaceleracionG === undefined) {
    throw new Error('Parámetros insuficientes para calcular la transferencia de carga');
  }

  const { pesoMoto, pesoPiloto, alturaMoto, distanciaEjes } = geometria;
  const pesoTotal = pesoMoto + pesoPiloto;
  const centroGravedad = alturaMoto * 0.45;

  const cargaDelanteraExtra = (pesoTotal * desaceleracionG * centroGravedad) / distanciaEjes;

  return {
    cargaAdicionalDelanteraKg: parseFloat(cargaDelanteraExtra.toFixed(2)),
    cargaTraseraRestanteKg: parseFloat((pesoTotal - cargaAdicionalDelanteraKg).toFixed(2))
  };
};

