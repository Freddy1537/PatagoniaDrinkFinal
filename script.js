// Productos locales (vinos estáticos)
const productosVinos = [
    { marca: "Rutini", nombre: "Malbec", imagen: "./image/vino-malbec-rutini-750-ml.jpg" },
    { marca: "Rutini", nombre: "Cabernet Sauvignon", imagen: "./image/cabernet sauvig.jpeg" },
    { marca: "Rutini", nombre: "Cabernet Franc", imagen: "./image/vino-cabernet-franc-rutini-750-ml.jpg" },
    { marca: "Rutini", nombre: "Merlot", imagen: "./image/merlot.jpeg" },
    { marca: "Rutini", nombre: "Syrah", imagen: "./image/rutini syrah.jpg" },
    { marca: "Luigi Bosca", nombre: "Pinot Noir", imagen: "./image/LB Pinot Noir.jpeg" },
    { marca: "Luigi Bosca", nombre: "Cabernet Sauvignon", imagen: "./image/LB Cabernet Sauvignon.jpg" },
    { marca: "Luigi Bosca", nombre: "Malbec", imagen: "./image/LB_Malbec.jpg" },
    { marca: "Luigi Bosca", nombre: "Merlot", imagen: "./image/luigi_merlot.jpg" },
    { marca: "Luigi Bosca", nombre: "Syrah", imagen: "./image/luigi_sy.jpg" },
];

// Carrito inicializado desde localStorage o vacío
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Obtener datos de la API y combinarlos con los vinos locales
async function obtenerDatosAPI() {
    const apiUrl = "https://api.sampleapis.com/wines/reds";
    try {
        const respuesta = await fetch(apiUrl);
        const datosAPI = await respuesta.json();

        // Combinar productos locales con los datos de la API
        const datosCombinados = [
            ...productosVinos,
            ...datosAPI.map((vino) => ({
                marca: "", // Eliminamos el prefijo "API Producto"
                nombre: vino.wine,
                imagen: vino.image,
            })),
        ];

        console.log("Datos combinados:", datosCombinados); // Verificar datos combinados
        mostrarProductos(datosCombinados);
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);

        // Mostrar solo los vinos locales si falla la API
        mostrarProductos(productosVinos);
    }
}

// Mostrar productos en la sección API
function mostrarProductos(datos) {
    const container = document.querySelector("#main-api-section");
    container.innerHTML = "";

    datos.forEach((producto) => {
        const productoHTML = `
            <div class="vino-item">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <p>${producto.nombre}</p>
                <button class="btn-agregar" data-marca="${producto.marca}" data-nombre="${producto.nombre}" data-imagen="${producto.imagen}">Agregar al Carrito</button>
            </div>
        `;
        container.innerHTML += productoHTML;
    });

    // Asignar eventos a los botones
    document.querySelectorAll(".btn-agregar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const producto = {
                marca: e.target.getAttribute("data-marca"),
                nombre: e.target.getAttribute("data-nombre"),
                imagen: e.target.getAttribute("data-imagen"),
            };
            console.log("Producto agregado:", producto); // Verificar producto agregado
            agregarAlCarrito(producto);
        });
    });
}

// Agregar un producto al carrito
function agregarAlCarrito(producto) {
    const existe = carrito.find((item) => item.nombre === producto.nombre);
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
}

// Actualizar y mostrar el carrito
function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// Mostrar los productos en el carrito
function mostrarCarrito() {
    const carritoContainer = document.querySelector("#carrito-container");
    carritoContainer.innerHTML = "";

    console.log("Carrito actual:", carrito); // Verificar carrito actual

    carrito.forEach((producto, index) => {
        carritoContainer.innerHTML += `
            <div class="carrito-item">
                <p>${producto.nombre}</p>
                <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
                <input type="number" min="1" value="${producto.cantidad}" data-index="${index}" class="cantidad-input">
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `;
    });

    // Eventos para editar cantidades
    document.querySelectorAll(".cantidad-input").forEach((input) => {
        input.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            carrito[index].cantidad = parseInt(e.target.value, 10);
            actualizarCarrito();
        });
    });

    // Eventos para eliminar productos
    document.querySelectorAll(".btn-eliminar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            carrito.splice(index, 1);
            actualizarCarrito();
        });
    });
}

// Inicializar la página
obtenerDatosAPI();
mostrarCarrito();


