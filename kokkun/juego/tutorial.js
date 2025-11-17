document.addEventListener('DOMContentLoaded', () => {
    const pasos = document.querySelectorAll('.paso');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const mensajeFinal = document.getElementById('mensaje-final');
    let pasoActual = 0;

    function mostrarPaso(indice) {
        
        pasos.forEach(p => p.classList.remove('activo'));
        mensajeFinal.style.display = 'none';

        
        if (indice < pasos.length) {
            pasos[indice].classList.add('activo');
            btnSiguiente.style.display = 'inline-block';
            btnAnterior.style.display = indice > 0 ? 'inline-block' : 'none';
            btnReiniciar.style.display = 'none';
        } else {
            
            mensajeFinal.style.display = 'block';
            btnSiguiente.style.display = 'none';
            btnAnterior.style.display = 'none';
            btnReiniciar.style.display = 'inline-block';
        }
    }

    btnSiguiente.addEventListener('click', () => {
        pasoActual++;
        mostrarPaso(pasoActual);
    });

    btnAnterior.addEventListener('click', () => {
        pasoActual--;
        mostrarPaso(pasoActual);
    });

    btnReiniciar.addEventListener('click', () => {
        pasoActual = 0;
        mostrarPaso(pasoActual);
    });

    
    mostrarPaso(pasoActual);
});