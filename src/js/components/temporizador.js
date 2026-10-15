const temporizador = document.querySelector(".temporizador");

if (temporizador) {

    let tiempoInicial = 10 * 60;
    let intervalo = null;
    const sonidoAviso = new Audio(
    "../src/assets/audio/temporizador.mp3");
    sonidoAviso.addEventListener("canplaythrough", () => {
    console.log("Audio cargado correctamente");
});

sonidoAviso.addEventListener("error", () => {
    console.error("Error al cargar el audio:", sonidoAviso.error);
});
    sonidoAviso.preload = "auto";

function reproducirAviso() {
    sonidoAviso.currentTime = 0;

    sonidoAviso.play().catch((error) => {
        console.error("No se pudo reproducir el aviso:", error);
    });
}


    let tiempoRestante = tiempoInicial;

const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

const btnIniciar = document.getElementById("btn-iniciar");
const btnPausar = document.getElementById("btn-pausar");
const btnReiniciar = document.getElementById("btn-reiniciar");

const btnRestar = document.getElementById("btn-restar");
const btnSumar = document.getElementById("btn-sumar");

const tiempoSeleccionado = document.getElementById("tiempo-seleccionado");
const botonesTiempo = document.querySelectorAll(".tiempos-rapidos button");


function actualizarTemporizador() {

    const minutosRestantes = Math.floor(tiempoRestante / 60);
    const segundosRestantes = tiempoRestante % 60;

    minutos.textContent = String(minutosRestantes).padStart(2, "0");
    segundos.textContent = String(segundosRestantes).padStart(2, "0");
}


function iniciarTemporizador() {
    if (intervalo !== null) return;

    intervalo = setInterval(() => {
    if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        intervalo = null;
        return;
    }

    tiempoRestante--;
    actualizarTemporizador();

    if (tiempoRestante === 0) {
        pausarTemporizador();
        reproducirAviso();
    }
}, 1000);
}


function pausarTemporizador() {

    clearInterval(intervalo);
    intervalo = null;
}


function reiniciarTemporizador() {

    pausarTemporizador();

    tiempoRestante = tiempoInicial;

    actualizarTemporizador();
}


function cambiarTiempo(cantidad) {

    pausarTemporizador();

    tiempoInicial += cantidad * 60;

    if (tiempoInicial < 60) {
        tiempoInicial = 60;
    }

    tiempoRestante = tiempoInicial;

    actualizarTiempoSeleccionado();
    actualizarTemporizador();
}


function establecerTiempo(minutos) {

    pausarTemporizador();

    tiempoInicial = minutos * 60;
    tiempoRestante = tiempoInicial;

    actualizarTiempoSeleccionado();
    actualizarTemporizador();
}


function actualizarTiempoSeleccionado() {

    tiempoSeleccionado.textContent =
        `${tiempoInicial / 60} min`;
}


btnIniciar.addEventListener("click", iniciarTemporizador);
btnPausar.addEventListener("click", pausarTemporizador);
btnReiniciar.addEventListener("click", reiniciarTemporizador);

btnRestar.addEventListener("click", () => {
    cambiarTiempo(-1);
});

btnSumar.addEventListener("click", () => {
    cambiarTiempo(1);
});
botonesTiempo.forEach((boton) => {

    boton.addEventListener("click", () => {

        const minutos = Number(boton.dataset.tiempo);

        establecerTiempo(minutos);

    });

});

actualizarTemporizador();

}