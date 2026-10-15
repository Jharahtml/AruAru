const arbolSection = document.querySelector(".arbol-section");
const btnEditar = document.getElementById("btn-editar-arbol");
const btnAgregar = document.getElementById("btn-agregar-arbol");
const btnEliminar = document.getElementById("btn-eliminar-arbol");
const btnGuardar = document.getElementById("btn-guardar-arbol");
const btnCancelar = document.getElementById("btn-cancelar-arbol");
const btnProyectar = document.getElementById("btn-proyectar-arbol");
const btnImprimir = document.getElementById("btn-imprimir-arbol");

const btnSalirProyeccionArbol =
    document.getElementById("btn-salir-proyeccion-arbol");

const instruccionArbol = document.getElementById("arbol-instruccion");

if (!arbolSection) {
    // Esta página no tiene Árbol de Ideas.
} else {

/* -------------------------
   ESTADO
------------------------- */

let modoEdicion = false;
let modoEliminar = false;

let ideasAnteriores = [];
const CLAVE_ARBOL = "arbolIdeas";
let ideasSeleccionadas = [];
function actualizarBotonEliminar() {
    btnEliminar.textContent = `Eliminar (${ideasSeleccionadas.length})`;
}

let ideaMovida = null;
let elementoArrastre = null;
let desplazamientoX = 0;
let desplazamientoY = 0;

/* -------------------------
   FUNCIONES 
------------------------- */

function guardarArbolLocalmente() {

    const wrappers = document.querySelectorAll(".idea-wrapper");

    const datos = [];

    const contenedor = document.querySelector(".arbol-ideas");

    wrappers.forEach((wrapper) => {

        const idea = wrapper.querySelector(".idea");

        const left = (wrapper.offsetLeft / contenedor.clientWidth) * 100;
        const top = (wrapper.offsetTop / contenedor.clientHeight) * 100;

        datos.push({
            texto: idea.value,
            left: `${left}%`,
            top: `${top}%`
        });

    });

    localStorage.setItem(CLAVE_ARBOL, JSON.stringify(datos));
}


function cargarArbolLocalmente() {

    const datosGuardados = localStorage.getItem(CLAVE_ARBOL);

    if (!datosGuardados) {
        return;
    }

    const datos = JSON.parse(datosGuardados);

    const contenedorIdeas = document.querySelector(".arbol-ideas");

    contenedorIdeas.innerHTML = "";

    datos.forEach((dato) => {

        const wrapper = document.createElement("div");
wrapper.classList.add("idea-wrapper");
const mover = document.createElement("span");
mover.classList.add("icono-mover");

wrapper.style.left = dato.left;
wrapper.style.top = dato.top;


const idea = document.createElement("input");

idea.type = "text";
idea.classList.add("idea");

idea.value = dato.texto;
idea.readOnly = true;


const checkbox = document.createElement("input");

checkbox.type = "checkbox";
checkbox.classList.add("idea-checkbox");

wrapper.appendChild(mover);
wrapper.appendChild(idea);
wrapper.appendChild(checkbox);

contenedorIdeas.appendChild(wrapper);

ajustarAnchoIdea(idea);

    });

}

function ajustarAnchoIdea(idea) {

    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d");

    const estilos = window.getComputedStyle(idea);

    contexto.font = `${estilos.fontWeight} ${estilos.fontSize} ${estilos.fontFamily}`;

    const anchoTexto = contexto.measureText(idea.value || " ").width;

    const padding =
        parseFloat(estilos.paddingLeft) +
        parseFloat(estilos.paddingRight);

    const bordes =
        parseFloat(estilos.borderLeftWidth) +
        parseFloat(estilos.borderRightWidth);

    const anchoMinimo = window.innerWidth <= 768 ? 70 : 140;

    idea.style.width =
        `${Math.max(anchoMinimo, anchoTexto + padding + bordes + 10)}px`;
}
document.addEventListener("fullscreenchange", () => {

    const ideas = document.querySelectorAll(".idea");

    ideas.forEach((idea) => {
        ajustarAnchoIdea(idea);
    });

});
document.addEventListener("input", (evento) => {
    const idea = evento.target.closest(".idea");

    if (!idea) {
        return;
    }

    ajustarAnchoIdea(idea);
});
/* -------------------------
   MODO EDICIÓN
------------------------- */

btnEditar.addEventListener("click", () => { //btnEditar rev

    modoEdicion = true;
    modoEliminar = false;
    ideasSeleccionadas = [];

    arbolSection.classList.add("editando");
    arbolSection.classList.remove("eliminando");

    ideasAnteriores = [];

    const ideas = document.querySelectorAll(".idea");
    ideas.forEach((idea) => {

         ideasAnteriores.push({
            texto: idea.value,
            left: idea.closest(".idea-wrapper").style.left,
            top: idea.closest(".idea-wrapper").style.top
        });

        idea.readOnly = false;
        idea.classList.remove("seleccionada");
ajustarAnchoIdea(idea);

    });

    actualizarBotonEliminar();

    instruccionArbol.textContent =
        "Modifica las palabras, agrega nuevas ideas, arrástralas para organizarlas.";  


});

/* -------------------------
   AGREGAR IDEA
------------------------- */
btnAgregar.addEventListener("click", () => {

    modoEliminar = false;
    ideasSeleccionadas = [];

    arbolSection.classList.remove("eliminando");

    actualizarBotonEliminar();

    const contenedorIdeas = document.querySelector(".arbol-ideas");

    const wrapper = document.createElement("div");
    wrapper.classList.add("idea-wrapper", "idea-nueva");

    const mover = document.createElement("span");
    mover.classList.add("icono-mover");

    const nuevaIdea = document.createElement("input");

    wrapper.style.top = "0%";
    wrapper.style.left = "0%";

    nuevaIdea.classList.add("idea");
    nuevaIdea.type = "text";

    nuevaIdea.readOnly = false;
    nuevaIdea.value = "Nueva idea";


const checkbox = document.createElement("input");

checkbox.type = "checkbox";
checkbox.classList.add("idea-checkbox");

wrapper.appendChild(mover);
wrapper.appendChild(nuevaIdea);
wrapper.appendChild(checkbox);

contenedorIdeas.appendChild(wrapper);
const left =
    ((contenedorIdeas.clientWidth - wrapper.offsetWidth) / 2 /
        contenedorIdeas.clientWidth) * 100;

const top =
    ((contenedorIdeas.clientHeight - wrapper.offsetHeight) / 2 /
        contenedorIdeas.clientHeight) * 100;

wrapper.style.left = `${left}%`;
wrapper.style.top = `${top}%`;

    nuevaIdea.select();
    ajustarAnchoIdea(nuevaIdea);

    instruccionArbol.textContent =
        "Escribe una nueva idea y arrástrala al lugar que prefieras.";

});
/* -------------------------
   MOVER IDEAS
------------------------- */
document.addEventListener("pointerdown", (evento) => {

    const elemento = evento.target.closest(".icono-mover");

    if (!elemento || !modoEdicion || modoEliminar) {
        return;
    }

    ideaMovida = elemento.closest(".idea-wrapper");
    ///nuevo
    elemento.setPointerCapture(evento.pointerId);

    const contenedor = document.querySelector(".arbol-ideas");
    const rectContenedor = contenedor.getBoundingClientRect();
    const rectIdea = ideaMovida.getBoundingClientRect();

    const porcentajeX =
    ((rectIdea.left - rectContenedor.left) / rectContenedor.width) * 100;

    ideaMovida.style.right = "auto";
    ideaMovida.style.left = `${porcentajeX}%`;

    const rect = ideaMovida.getBoundingClientRect();

    desplazamientoX = evento.clientX - rect.left;
    desplazamientoY = evento.clientY - rect.top;

    //ideaMovida.setPointerCapture(evento.pointerId);

    const idea = ideaMovida.querySelector(".idea");

    if (idea) {
        idea.style.cursor = "grabbing";
    }

});


document.addEventListener("pointermove", (evento) => {

    if (!ideaMovida) {
        return;
    }

    const contenedor = document.querySelector(".arbol-ideas");
    const rectContenedor = contenedor.getBoundingClientRect();

    const anchoIdea = ideaMovida.offsetWidth;
    const altoIdea = ideaMovida.offsetHeight;

    let x =
        evento.clientX -
        rectContenedor.left -
        desplazamientoX;

    let y =
        evento.clientY -
        rectContenedor.top -
        desplazamientoY;

    const limiteX = rectContenedor.width - anchoIdea;
    const limiteY = rectContenedor.height - altoIdea;

    x = Math.max(0, Math.min(x, limiteX));
    y = Math.max(0, Math.min(y, limiteY));

    const porcentajeX = (x / contenedor.clientWidth) * 100;
    const porcentajeY = (y / contenedor.clientHeight) * 100;

    ideaMovida.style.top = `${porcentajeY}%`;
    ideaMovida.style.left = `${porcentajeX}%`;
    

});


document.addEventListener("pointerup", () => {

    if (!ideaMovida) {
        return;
    }

    const idea = ideaMovida.querySelector(".idea");

    if (idea) {
        idea.style.cursor = "text";
    }

    ideaMovida = null;

});

/* -------------------------
    ELIMINAR
------------------------- */    

btnEliminar.addEventListener("click", () => {

    /* Entrar al modo eliminar */

    if (!modoEliminar) {

        modoEliminar = true;
        ideasSeleccionadas = [];

        arbolSection.classList.add("eliminando");

        const ideas = document.querySelectorAll(".idea");

        ideas.forEach((idea) => {
            idea.readOnly = true;
        });

        actualizarBotonEliminar();

        instruccionArbol.textContent =
            "Marca las palabras que deseas eliminar y luego haz clic en “Eliminar”.";

        return;
    }


    /* Salir si no hay palabras seleccionadas */

    if (ideasSeleccionadas.length === 0) {

        modoEliminar = false;

        arbolSection.classList.remove("eliminando");

        const ideas = document.querySelectorAll(".idea");

        ideas.forEach((idea) => {
            idea.readOnly = false;
        });

        actualizarBotonEliminar();

        instruccionArbol.textContent =
            "Modifica las palabras, agrega nuevas ideas, arrástralas para organizarlas o elimínalas.";

        return;
    }


    /* Eliminar wrappers seleccionados */

    ideasSeleccionadas.forEach((wrapper) => {
       wrapper.classList.add("eliminando-idea");

        setTimeout(() => {
            wrapper.remove();
        }, 250);
    });

    ideasSeleccionadas = [];
    modoEliminar = false;

    arbolSection.classList.remove("eliminando");

    const ideas = document.querySelectorAll(".idea");

    ideas.forEach((idea) => {
        idea.readOnly = false;
    });

    actualizarBotonEliminar();

    instruccionArbol.textContent =
        "Modifica las palabras, agrega nuevas ideas, arrástralas para organizarlas o elimínalas.";

});
/* -------------------------
   SELECCIONAR IDEAS
------------------------- */
document.addEventListener("change", (evento) => {

    if (!modoEliminar) {
        return;
    }

    const checkbox = evento.target.closest(".idea-checkbox");

    if (!checkbox) {
        return;
    }

    const wrapper = checkbox.closest(".idea-wrapper");

    if (!wrapper) {
        return;
    }

    if (checkbox.checked) {

        ideasSeleccionadas.push(wrapper);

    } else {

        const indice = ideasSeleccionadas.indexOf(wrapper);

        if (indice !== -1) {
            ideasSeleccionadas.splice(indice, 1);
        }

    }
    actualizarBotonEliminar();

});
/* -------------------------
   GUARDAR
------------------------- */
btnGuardar.addEventListener("click", () => {

    const ideas = document.querySelectorAll(".idea");

    ideas.forEach((idea) => {
        idea.readOnly = true;

    });
    guardarArbolLocalmente();

    modoEdicion = false;
    modoEliminar = false;
    ideasSeleccionadas = [];


    arbolSection.classList.remove("editando");
    arbolSection.classList.remove("eliminando");


    actualizarBotonEliminar();

    instruccionArbol.textContent =
        "Los cambios se han guardado.";

});
/* -------------------------
   CANCELAR
------------------------- */

btnCancelar.addEventListener("click", () => {

    const contenedorIdeas = document.querySelector(".arbol-ideas");

    /* Eliminar las ideas actuales */

    contenedorIdeas.innerHTML = "";

    /* Restaurar las ideas originales */

    ideasAnteriores.forEach((ideaAnterior) => {

        const wrapper = document.createElement("div");
        wrapper.classList.add("idea-wrapper");

        wrapper.style.left = ideaAnterior.left;
        wrapper.style.top = ideaAnterior.top;

        const mover = document.createElement("span");
        mover.classList.add("icono-mover");

        const idea = document.createElement("input");

        idea.type = "text";
        idea.classList.add("idea");

        idea.value = ideaAnterior.texto;
        idea.readOnly = true;

        const checkbox = document.createElement("input");


        checkbox.type = "checkbox";
        checkbox.classList.add("idea-checkbox");

        wrapper.appendChild(mover);
        wrapper.appendChild(idea);
        wrapper.appendChild(checkbox);

        contenedorIdeas.appendChild(wrapper);

        ajustarAnchoIdea(idea);

    });

    modoEdicion = false;
    modoEliminar = false;
    ideasSeleccionadas = [];

    arbolSection.classList.remove("editando");
    arbolSection.classList.remove("eliminando");

    actualizarBotonEliminar();

    instruccionArbol.textContent =
        "Los cambios se han cancelado.";

});
cargarArbolLocalmente();
/*     INPUTS HTML*/
const ideasIniciales = document.querySelectorAll(".idea");

ideasIniciales.forEach((idea) => {
    ajustarAnchoIdea(idea);
});

/* -------------------------
   PROYECTAR
------------------------- */
btnProyectar.addEventListener("click", () => {

    const contenedor = document.querySelector(".arbol-contenedor");
    contenedor.requestFullscreen();
});
btnSalirProyeccionArbol.addEventListener("click", () => {
    document.exitFullscreen();
});
btnImprimir.addEventListener("click", () => {
    window.print();
});
}