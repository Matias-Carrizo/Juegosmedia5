const questions = [
    {
        question: "¿De que está compuesta el agua?",
        answers: [
            { text: "De Oxígeno", correct: false },
            { text: "De Carbono", correct: false },
            { text: "De Hidrogeno y Oxígeno", correct: true },
            { text: "De Nitrogeno", correct: false },
            { text: "De Hielo o carbono", correct: false },
            { text: "De Nitrogeno o hielo", correct: false },
            { text: "De Nitrogeno o oxigeno", correct: false },
            { text: "De Nidrogeno y carbono", correct: false }
        ],
        imagen:"fade1.jpg"
    },
    {
        question: "¿Cuál es el porcentaje de agua que que se contamina al dia?",
        answers: [
            { text: "40%", correct: false },
            { text: "No se conoce un porcentaje global de agua que se contamina al día", correct: true },
            { text: "25%", correct: false },
            { text: "90%", correct: false },
            {text: "67%", correct: false},
            {text: "89%" , correct : false},
            {text: "67%" , correct : false},
            {text: "857%" , correct : false}
        ],
        imagen:"fade2.jpg"
    },
    {
        question: "¿Cuál es el río más contaminado?",
        answers: [
            { text: "Citarum ", correct: true },
            { text: "Amazonas", correct: false },
            { text: "Yangtsé", correct: false },
            { text: "Misisipi", correct: false }
        ],
        imagen:"fade3.jpg"
    },
    {
        question: "¿Cuantos metodos hay para descontaminar el agua?",
        answers: [
           { text: " métodos 3", correct:true },
            { text: "metodos56", correct: false },
            { text: "metodos 5", correct: false },
            { text: "metodos 9", correct: false },
            { text: "metodos 93", correct: false },
             {text: "metodos 45" , correct : false},
             {text: "metodos 23" , correct : false}
        ],
        imagen:"fade7.jpg"
    },
    {
        question: "¿Como se llama el metodo que usa la filtracion?",
        answers: [
            { text: "Oro", correct: false },
            { text: "fisico", correct: true },
            { text: "quimico", correct: false },
            { text: "biologico", correct: false },
             {text: "fisico quimico" , correct : false}
        ],
        imagen:"fade5.jpg"
    },
    {
        question: "¿Como se llama el metodo de usa el agua como ENERGIA?",
        answers: [
            { text: "Solar", correct: false },
            { text: "Eolica", correct: false },
            { text: "Hidraulica", correct: true },
            { text: "Nuclear", correct: false },
            {text: "fisica" , correct : false}
        ],
        imagen:"fade5.jpg"
    },
    {
        question: "¿Por cuantos millones de toneladas de agua se contaminan aproximadamente durante un año en todo el mundo?",
        answers: [
            { text: "2 millones", correct: true },
            { text: "78 millones", correct: false },
            { text: "8 millones", correct: false },
            { text: "67 millones", correct: false },
            {text: "455millones" , correct : false},
            {text: "23millones" , correct : false},
            {text: "89millones" , correct : false}
        ],
        imagen:"fade6.jpg"
    },
    {
        question: "¿Como cuidar el agua?",
        answers: [
            { text: "No tirando basura rios y lagos", correct: true },
            { text: "Tirar basura a los rios y lagos", correct: false },
            { text: "Deja que los papeles y plasticos a los mares", correct: false },
            { text: "No hacer nada", correct: false }
        ],
        imagen:"fade7.jpg"
    },
    {
        question: "¿Hay suficiente agua potable en el planeta?",
        answers: [
            { text: " En la Tierra no hay suficiente agua potable disponible para todos", correct: true },
            { text: "Hay suficientes", correct: false },
            { text: "Hay lo justo", correct: false },
            { text: "Hay de sobra", correct: false }
        ],
        imagen:"fade8.jpg"
    },
    {
        question: "¿Cuáles son las causas de la escasez de agua'?",
        answers: [
            { text: "El cambio climático", correct: true },
            { text: "Nada", correct: false },
            { text: "Voz que no cuidas", correct: false },
            { text: "Algun inorante", correct: false }
        ],
        imagen:"fade9.jpg"
    },
    {
        question: "¿Cómo llega el agua potable a mi casa?",
        answers: [
            { text: "Cerrando la canilla", correct: false },
            { text: "Resando algun santo", correct: false },
            { text: "Magicamente", correct: false },
            { text: "El agua potable llega a nuestros hogares mediante un proceso de cuatro etapas", correct: true }
        ],
        imagen:"fade10.jpg"
    },
    {
        question: "¿Cuánta agua usa una persona en su hogar diariamente?",
        answers: [
            { text: " 100 y 150 litros", correct: true },
            { text: "500 litros", correct: false },
            { text: "3468732467 litros", correct: false },
            { text: "12 litros", correct: false }
        ],
        imagen:"fade11.jpg"
    },
    {
        question: "¿En qué consiste el ciclo del agua?",
        answers: [
            { text: "El ciclo del agua es el proceso continuo de movimiento del agua en la Tierra, que cambia de estado y lugar gracias a la energía del sol", correct: true },
            { text: "Cosite en solo el proceso de mover el agua de rios a otros lados para la explotacion de minerales", correct: false },
            { text: "Solo el comercio del agua.de como se paga y se compra", correct: false },
            { text: "No tiene nada no exite", correct: false }
        ],
        imagen:"fade12.jpg"
    },
        {
            question: "¿cual es el metodo que usa las plantas y micro organismos?",
            answers: [
                { text: "metodo fisico", correct: false },
                { text: "bartolito lo dijo", correct: false },
                { text: "Ometodo  biologico", correct: true },
                { text: "metodo quimico", correct: false }
            ],
        imagen:"fade13.jpg"
        },
        {
            question: "¿cual es el metod que usa el cloro y ozono?",
            answers: [
                { text: "metodo fisico", correct: false },
                { text: "metodo quimico ", correct: true },
                { text: "metodo biologico", correct: false },
                { text: "caperusita se olvuida la canasta en un lago", correct: false }
            ],
        imagen:"fade14.jpg"
        },
        {
            question: "¿¿Cuanta agua hay en la tierra??",
            answers: [
                { text: "8millones de kilometros cubicos", correct: false },
                { text: " 234millones de kilometros cubicos", correct: false },
                { text: "1.386 millones de kilómetros cúbicos", correct: true },
                { text: "5684 millones de kilometros cubicos", correct: false }
            ],
        imagen:"fade15.jpg"
        },
        {
            question: "¿Qué nombre se le da al agua que se encuentra debajo de la tierra?",
            answers: [
                { text: " Agua aeria", correct: false },
                { text: " Agua subterránea", correct: true },
                { text: "Agua corriente", correct: false },
                { text: "Agua roja", correct: false }
            ],
        imagen:"fade16.jpg"
        },
        {
            question: "¿que agua se puede tomar?",
            answers: [
                { text: "agua dulce", correct: true },
                { text: "agua salda", correct: false },
                { text: "agua sucia", correct: false },
                { text: "agua con pintura", correct: false }
            ],
        imagen:"fade17.jpg"
        },
        {
            question: "¿En qué consiste el estado sólido del aguajfacla?",
            answers: [
                { text: " Ni idea", correct: false },
                { text: "No tiene como tal el estado solido", correct: false },
                { text: "Consiste en que las moléculas de agua se organizan en una estructura cristalina ordenada que ocupa más espacio que el agua líquida, lo que resulta en una menor densidad", correct: true },
                { text: "Se vulve solido y punto", correct: false }
            ],
        imagen:"fade18.jpg"
        },
        {
            question: "¿Que tipo de agua exite?",
            answers: [
                { text: "El agua dulce, el agua salada (de océanos y mares) y el agua salobre", correct: true },
                { text: "Agua dulce y salada", correct: false },
                { text: "Solo agua salada", correct: false },
                { text: "Solo agua dulce", correct: false }
            ],
        imagen:"fade19.jpg"
        },
        {
            question: "¿Qué características tiene el agua pura?",
            answers: [
                { text: "Agua es de color rosa", correct: false },
                { text: "Agua es incolora con sabor a frutilla", correct: false },
                { text: "El agua pura es inodora (sin olor), insípida (sin sabor) e incolora (sin color). ", correct: true },
                { text: "El agua es indolora pero tiene sabor a manos y color negro", correct: false }
            ],
        imagen:"fade20.jpg"
        },
        {
            question: "¿Qué es la hidrósfera aguajfacla?",
            answers: [
                { text: " La hidrósfera es la capa de la Tierra que contiene toda el agua, incluyendo océanos, lagos, ríos y agua subterránea. ", correct: true },
                { text: "Se una comida de centro america", correct: false },
                { text: " Es otra manera de llamar Europa", correct: false },
                { text: "Es una de las capas de la atmofera", correct: false }
            ],
        imagen:"fade1.jpg"
        },
        {
            question: "¿Cuál es el símbolo químico del agua aguajfacla?",
            answers: [
                { text: "O2", correct: false },
                { text: "H2O", correct: true },
                { text: "HO2", correct: false },
                { text: "CO2", correct: false }
            ],
        imagen:"fade17.jpg"
        }

    
];



let currentQuestionIndex = 0;
let errores=0;
const contarError=document.getElementById('errores');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const imagen=document.getElementById("imagen");

function startGame() {
    currentQuestionIndex = 0;
    nextButton.classList.add('hide');
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    imagen.src=question.imagen;
    imagen.style.display="block";
    answerButtons.innerHTML = ''; // Limpiar respuestas anteriores
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
}

function selectAnswer(answer) {
    const correct = answer.correct;
    if (correct) {
        alert('¡Correcto!');
        nextButton.classList.remove('hide');// Mostrar el botón de siguiente
    } else {
        if (errores==3){
            alert('¡Perdiste: Llegaste al limite de errores!');
            setTimeout(function(){
                location.href="main.html";
            },1000);
        }
        else{
        alert('Incorrecto. Intenta de nuevo.');
        errores+=1;
        contarError.innerText = `Errores: ${errores}`;
    }
    }
    
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.classList.add('hide'); // Ocultar el botón de siguiente
    } else {
        alert('¡Has completado el juego!');
        setTimeout(function(){
            location.href="main.html";
        },1000);
        // Aquí puedes reiniciar el juego o deshabilitar el botón
    }
});

startGame();
