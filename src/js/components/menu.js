const menu = document.getElementById("menu");

const estamosEnPages = window.location.pathname.includes("/pages/");

const rutaInicio = estamosEnPages ? "../index.html" : "index.html";
const rutaPages = estamosEnPages ? "./" : "pages/";
const rutaAssets = estamosEnPages ? "../src/assets/" : "src/assets/";

menu.innerHTML = `
    <nav class="menu">
        <div class="container">

            <a href="${rutaInicio}" class="logo">
                <img src="${rutaAssets}img/logo-icon.svg" alt="AruAru logo">
            </a>

            <div class="menu-enlaces">
                <a href="${rutaInicio}">Inicio</a>
                <a href="${rutaPages}guia.html">Guía</a>

                <div class="menu-dropdown">
                 <button class="menu-dropdown-boton">Actividades</button>
                 <div class="menu-dropdown-contenido">
                 <a href="${rutaPages}actividad-tablero.html">Actividad 1</a>
                 <a href="${rutaPages}actividad-personajes.html">Actividad 2</a>
                 <a href="${rutaPages}actividad-historia.html">Actividad 3</a>
        </div>
    </div>

                <a href="${rutaPages}temporizador.html">Temporizador</a>
                <a href="${rutaPages}recursos.html">Recursos</a>
            </div>
            <button class="menu-toggle" aria-label="Abrir menú">
                <img src="${rutaAssets}img/toggle.svg" alt="">
            </button>

        </div>
    </nav>
`;

const botonMenu = document.querySelector(".menu-toggle");
const enlacesMenu = document.querySelector(".menu-enlaces");
const iconoMenu = botonMenu.querySelector("img");

const botonActividades = document.querySelector(".menu-dropdown-boton");
const dropdownActividades = document.querySelector(".menu-dropdown-contenido");


/* MENÚ PRINCIPAL */
botonMenu.addEventListener("click", () => {

    const abierto = enlacesMenu.classList.toggle("menu-abierto");

    iconoMenu.classList.toggle("icono-rotado", abierto);

    iconoMenu.src = abierto
        ? `${rutaAssets}img/cerrar-negro.svg`
        : `${rutaAssets}img/toggle.svg`;

    botonMenu.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );

});


/* DROPDOWN ACTIVIDADES */
botonActividades.addEventListener("click", () => {

    dropdownActividades.classList.toggle("dropdown-abierto");
});


/* CERRAR AL HACER CLIC FUERA */
document.addEventListener("click", (evento) => {

    const menuAbierto = enlacesMenu.classList.contains("menu-abierto");

    if (
        menuAbierto &&
        !enlacesMenu.contains(evento.target) &&
        !botonMenu.contains(evento.target)
    ) {

        enlacesMenu.classList.remove("menu-abierto");

        iconoMenu.src = `${rutaAssets}img/toogle.svg`;
        iconoMenu.classList.remove("icono-rotado");

        botonMenu.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        dropdownActividades.classList.remove("dropdown-abierto");
    }

});