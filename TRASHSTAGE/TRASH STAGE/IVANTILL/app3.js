const preguntasQuiz = [
    {
        pregunta: "¿Por qué no se puede reciclar una servilleta usada o con restos de comida?",
        opciones: [
            "Porque tienen un alto contenido de cloro que daña la maquinaria.",
            "Porque la grasa y los restos orgánicos contaminan el proceso de reciclaje del papel.",
            "Porque son demasiado delgadas y se rompen al mojarse.",
            "Porque solo el cartón grueso se puede reciclar."
        ],
        respuestaCorrecta: "Porque la grasa y los restos orgánicos contaminan el proceso de reciclaje del papel.",
        explicacion: "Los aceites y restos de comida son contaminantes muy difíciles de eliminar en el proceso de reciclaje de papel, por lo que las servilletas sucias deben ir a la basura orgánica o compost."
    },
    {
        pregunta: "¿En qué contenedor se deben depositar los envases de plástico (botellas, tapas, etc.)?",
        opciones: [
            "Contenedor azul (papel y cartón).",
            "Contenedor verde (vidrio).",
            "Contenedor amarillo (envases ligeros: plástico, latas, briks).",
            "Contenedor gris (resto)."
        ],
        respuestaCorrecta: "Contenedor amarillo (envases ligeros: plástico, latas, briks).",
        explicacion: "El contenedor amarillo está destinado a los envases de plástico, latas de metal y envases de tipo brik. Recuerda siempre enjuagarlos un poco."
    },
    {
        pregunta: "El 'vidrio' (botellas, tarros) es 100% reciclable y puede reciclarse:",
        opciones: [
            "Solo una vez, luego pierde calidad.",
            "Un máximo de 10 veces.",
            "Infinitas veces sin perder sus propiedades.",
            "Solo si es de color verde."
        ],
        respuestaCorrecta: "Infinitas veces sin perder sus propiedades.",
        explicacion: "El vidrio es uno de los materiales más sostenibles, ya que se puede reciclar repetidamente sin que pierda calidad ni cantidad."
    }
]
const mainContainer = document.querySelector('.Cuestionario_preguntas'); 
const preguntaElement = document.querySelector('#pregunta');
const respuestasDiv = document.querySelector('#respuestas');
const enviarButton = document.querySelector('#enviar');
const resultadoDiv = document.querySelector('#resultado');
const resultadoTexto = document.querySelector('#resultado-texto');

let indicePreguntaActual = 0;
let seleccionUsuario = null;
let puedeSeleccionar = true;

function cargarPregunta() {
    if (indicePreguntaActual >= preguntasQuiz.length) {
        mostrarMensajeFinal();
        return;
    }

    const preguntaActual = preguntasQuiz[indicePreguntaActual];
    
    preguntaElement.innerText = `P${indicePreguntaActual + 1}: ${preguntaActual.pregunta}`;
    
    respuestasDiv.innerHTML = '';
    seleccionUsuario = null;
    puedeSeleccionar = true;

    resultadoDiv.classList.add('oculto');
    enviarButton.innerText = 'Responder';
    enviarButton.disabled = false;
    enviarButton.style.display = 'block';

    preguntaActual.opciones.forEach(opcion => {
        const divOpcion = document.createElement('div');
        divOpcion.classList.add('opcion');
        divOpcion.innerText = opcion;
        divOpcion.addEventListener('click', () => seleccionarRespuesta(divOpcion, opcion));
        respuestasDiv.appendChild(divOpcion);
    });
    
    enviarButton.removeEventListener('click', cargarSiguienteOChequearFinal); 
    enviarButton.addEventListener('click', verificarRespuesta); 
}

function seleccionarRespuesta(elementoSeleccionado, textoOpcion) {
    if (!puedeSeleccionar) return;

    respuestasDiv.querySelectorAll('.opcion').forEach(op => op.classList.remove('seleccionada'));

    elementoSeleccionado.classList.add('seleccionada');
    seleccionUsuario = textoOpcion;
}

function verificarRespuesta() {
    if (!seleccionUsuario) {
        alert("Por favor, seleccioná una respuesta antes de continuar.");
        return;
    }

    const preguntaActual = preguntasQuiz[indicePreguntaActual];
    const esCorrecta = (seleccionUsuario === preguntaActual.respuestaCorrecta);
    const opcionesElementos = respuestasDiv.querySelectorAll('.opcion');
    
    enviarButton.disabled = true;
    puedeSeleccionar = false;

    opcionesElementos.forEach(opcion => {
        opcion.style.pointerEvents = 'none';

        if (opcion.innerText === preguntaActual.respuestaCorrecta) {
            opcion.classList.add('correcta');
        } else if (opcion.classList.contains('seleccionada')) {
            opcion.classList.add('incorrecta');
        }
    });
    
    resultadoDiv.classList.remove('oculto');
    if (esCorrecta) {
        resultadoTexto.innerHTML = `<span class="feedback-icon" style="color: #38a798;">✔</span> Correcto.`;
        resultadoTexto.style.color = '#1a5c9a';
    } else {
        resultadoTexto.innerHTML = `<span class="feedback-icon" style="color: #c62828;">✖</span> Incorrecto. Pero no pasa nada. <br><br>La respuesta correcta era: **${preguntaActual.respuestaCorrecta}Explicación: ${preguntaActual.explicacion}_`;
        resultadoTexto.style.color = '#c62828';
    }

    enviarButton.innerText = 'Siguiente Pregunta';
    enviarButton.disabled = false;
    
    enviarButton.removeEventListener('click', verificarRespuesta);
    enviarButton.addEventListener('click', cargarSiguienteOChequearFinal);
}

function cargarSiguienteOChequearFinal() {
    indicePreguntaActual++;
    cargarPregunta();
}

function mostrarMensajeFinal() {
    mainContainer.classList.add('oculto'); 
    enviarButton.style.display = 'none';

    resultadoDiv.classList.remove('oculto');
    resultadoDiv.style.textAlign = 'center';
    
    resultadoTexto.innerHTML = `<span class="feedback-icon" style="color: #38a798;">🌎</span> **Cuestionario Terminado**. <br><br>Has revisado ${preguntasQuiz.length} formas de cuidarnos. ¡Gracias por tu participación y por aprender a reciclar mejor!`;
    resultadoTexto.style.color = '#1a5c9a';
    resultadoDiv.style.padding = '40px';
}

cargarPregunta();