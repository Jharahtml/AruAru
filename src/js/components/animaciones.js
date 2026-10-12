// ANIMACIONES AL CARGAR

// Entrada de botones
function animarBotonesActividad() {

    const botones = document.querySelectorAll(".boton-actividad");

    if (!botones.length) return;

    botones.forEach((boton) => {
        boton.classList.add("animar-entrada");
    });
}


// ANIMACIONES AL HACER SCROLL
function iniciarAnimacionesScroll() {

    const elementosAnimados = document.querySelectorAll(".animar-scroll");

    if (!elementosAnimados.length) return;

    const observerAnimaciones = new IntersectionObserver(
        (entradas, observer) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visible");

                    // La animación ocurre una sola vez
                    observer.unobserve(entrada.target);
                }

            });

        },
        {
            threshold: 0.2
        }
    );

    elementosAnimados.forEach((elemento) => {
        observerAnimaciones.observe(elemento);
    });
}


// ANIMACIÓN DE SILUETAS
function iniciarAnimacionSiluetas() {

    const siluetas = document.querySelectorAll(".silueta");

    if (!siluetas.length) return;

    const observerSiluetas = new IntersectionObserver(
        (entradas, observer) => {

            entradas.forEach((entrada) => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("silueta-visible");

                    observer.unobserve(entrada.target);
                }

            });

        },
        {
            threshold: 0.2
        }
    );

    siluetas.forEach((silueta) => {
        observerSiluetas.observe(silueta);
    });
}


// INICIAR

function iniciarAnimaciones() {
    animarBotonesActividad();
    iniciarAnimacionesScroll();
    iniciarAnimacionSiluetas();
}

iniciarAnimaciones();