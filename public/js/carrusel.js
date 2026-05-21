const slider = document.getElementById("sliderProductos")
const btnIzquierda = document.querySelector(".izquierda")
const btnDerecha = document.querySelector(".derecha")

btnDerecha.addEventListener("click", () => {
    slider.scrollLeft += 800
})
btnIzquierda.addEventListener("click", () => {
    slider.scrollLeft -= 800
})