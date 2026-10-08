document.addEventListener("DOMContentLoaded", ()=> {

   let payloadGeometriaMasa = {
        pesoMoto: 0,
        pesoPiloto: 0,
        alturaMoto: 0,
        distanciaEjes: 0,
        Date: new Date().toISOString(),
};

let ruedasUsuario = {
  compuestoRueda: "",
  ruedaDelantera: {
    dimension: "",
    presionCaliente: 2.3,
    marca: "",
    modelo: "",
  },
  ruedaTrasera: {
    dimension: "",
    presionCaliente: 2.6,
    marca: "",
    modelo: "",
  },
};
    const inputMoto= document.querySelector("#pesoMoto");

    inputMoto.addEventListener("input", (e)=>{ 
        const pesoMoto= inputMoto.value;
        const visual=document.querySelector("#bikeWeightDisplay");
        visual.textContent=pesoMoto + " kg";
        payloadGeometriaMasa.pesoMoto=pesoMoto;
    
    });

    const inputPiloto = document.querySelector("#pesoPiloto");

    inputPiloto.addEventListener("input", (e) => {
        const pesoPiloto= inputPiloto.value;
        const visual=document.querySelector("#pesoPilotoDisplay");
        visual.textContent=pesoPiloto + " kg";
        payloadGeometriaMasa.pesoPiloto=pesoPiloto;
    });

    const inputAltura = document.querySelector("#alturaConPiloto");

    inputAltura.addEventListener("input", (e) =>{
        payloadGeometriaMasa.alturaMoto=inputAltura.value;
    });
    
    const inputEjes = Document.querySelector("#distanciaEntreEjes");

    inputEjes.addEventListener("input", (e) =>{
        payloadGeometriaMasa.distanciaEjes=inputEjes.value;
    });

    const btnCompuesto= document.querySelectorAll("#compoundSelector button");

    btnCompuesto.forEach(boton => {
        boton.addEventListener("click", (e) =>{
            ruedasUsuario.compuesto=e.target.id;
        });
    });

    const sumbit=document.querySelector("#syncButton");
    sumbit.addEventListener("click",async (e)=>{
        e.preventDefault();
        try {
            const respuesta1 = await fetch("/setupCompuesto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ruedasUsuario)
            });
            const respuesta2 = await fetch("/setupGeometry" , {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(payloadGeometriaMasa)
            });

            if (respuesta1.ok && respuesta2.ok){
                const resultado1= await respuesta1.json();
                const resultado2=await respuesta2.json();
            }
        } catch (error) {
            console.log(error);
        }
    })

})

