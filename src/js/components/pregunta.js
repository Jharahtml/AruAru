//const inputPregunta = document.getElementById("pregunta-input");

const btnAccion = document.getElementById("btn-accion");
const btnSecundario = document.getElementById("btn-secundario");

const preguntaForma = document.querySelector(".pregunta-forma");
const preguntaSection = document.querySelector(".pregunta-section");

const inputPregunta = document.getElementById("pregunta-input");
const preguntaInstruccion = document.getElementById("pregunta-instruccion");
if (!inputPregunta) {
    // No hay seccion en esta página.
} else {

let preguntaAnterior = inputPregunta.value;
let modoEdicion = false;
const CLAVE_PREGUNTA = "preguntaActual";
const preguntaGuardada = localStorage.getItem(CLAVE_PREGUNTA);

if (preguntaGuardada) {
    inputPregunta.value = preguntaGuardada;
}

btnAccion.addEventListener("click", () => {

    if (!modoEdicion) {

        //Editar
        preguntaAnterior = inputPregunta.value;

        inputPregunta.readOnly = false;
        ajustarAlturaPregunta();
        

        inputPregunta.focus();
        preguntaForma.classList.add("editando");
        preguntaSection.classList.add("editando");

        inputPregunta.setSelectionRange(
        inputPregunta.value.length,
        inputPregunta.value.length
);

        btnAccion.textContent = "Guardar";
        btnSecundario.textContent = "Cancelar";

        btnAccion.classList.add("edicion");
        btnSecundario.classList.add("edicion");

        modoEdicion = true;
        preguntaInstruccion.textContent =
    "Pulsa “Editar” para adaptar la pregunta al tema.";

    } else {

        // Guardar
        localStorage.setItem(
        CLAVE_PREGUNTA,
        inputPregunta.value
    );
        inputPregunta.readOnly = true;
        preguntaForma.classList.remove("editando");
        preguntaSection.classList.remove("editando");

        btnAccion.textContent = "Editar";
        btnSecundario.textContent = "Proyectar";

        btnAccion.classList.remove("edicion");
        btnSecundario.classList.remove("edicion");

        modoEdicion = false;
        preguntaInstruccion.textContent = "Los cambios se han guardado.";
    }
});


btnSecundario.addEventListener("click", () => {

    if (modoEdicion) {

        // Cancelar
        inputPregunta.value = preguntaAnterior;

        inputPregunta.readOnly = true;

        preguntaForma.classList.remove("editando");
        preguntaSection.classList.remove("editando");

        btnAccion.textContent = "Editar";
        btnSecundario.textContent = "Proyectar";

        btnAccion.classList.remove("edicion");
        btnSecundario.classList.remove("edicion");

        modoEdicion = false;
        preguntaInstruccion.textContent ="Los cambios se han cancelado.";

    } else {

        // Proyectar
        preguntaSection.classList.add("proyectando");
        preguntaSection.requestFullscreen();
    }
    
});

const btnSalirProyeccion = document.getElementById("btn-salir-proyeccion");
document.addEventListener("fullscreenchange", () => {

    if (document.fullscreenElement) {

        preguntaSection.classList.add("proyectando");

        requestAnimationFrame(() => {
            ajustarAlturaPregunta();
        });

    } else {

        preguntaSection.classList.remove("proyectando");

        requestAnimationFrame(() => {
            ajustarAlturaPregunta();
        });
    }

});
btnSalirProyeccion.addEventListener("click", () => {
    document.exitFullscreen();
});
function ajustarAlturaPregunta() {
    inputPregunta.style.height = "auto";
    inputPregunta.style.height = inputPregunta.scrollHeight + "px";
}
inputPregunta.addEventListener("input", ajustarAlturaPregunta);

}