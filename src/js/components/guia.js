const wrapperMaterial = document.querySelector(".wrapper-material");

if (wrapperMaterial) {

    const observer = new IntersectionObserver(
        (entradas) => {

            const entrada = entradas[0];

            if (entrada.isIntersecting) {
                // El usuario llegó a la sección
                wrapperMaterial.classList.add("unidas");
            } else {
            
                wrapperMaterial.classList.remove("unidas");
            }

        },
        {
            threshold: 0.4
        }
    );

    observer.observe(wrapperMaterial);
}