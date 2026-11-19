// Variables para el cambio progresivo de color de azul claro a verde segundo a segundo
let segundosTranscurridos = 0;
let intervaloColor = null;
let intervaloBurbujas = null;
let contadorIdBurbuja = 1;

// =========================================================================
// PREGUNTA 1: USO DE DOCUMENT OBJECT MODEL (DOM) API (1 PUNTO)
// Funcion crearPecera(x) que crea un tablero x * x en la pagina HTML
// =========================================================================
function crearPecera(x) {
    if (isNaN(x) || x < 4) x = 6;

    const contenedor = document.getElementById("contenedorPecera");
    contenedor.innerHTML = "";

    // 1.1 Crear la cuadricula de la pecera usando metodos nativos del DOM
    const tablero = document.createElement("div");
    tablero.id = "tableroPecera";
    tablero.className = "tablero-pecera";
    tablero.style.gridTemplateColumns = `repeat(${x}, 90px)`;
    tablero.style.gridTemplateRows = `repeat(${x}, 90px)`;

    for (let i = 0; i < x * x; i++) {
        const celda = document.createElement("div");
        celda.className = "celda-pecera";
        tablero.appendChild(celda);
    }
    contenedor.appendChild(tablero);

    // 1.2 Crear contenedor superior de burbujas (para Pregunta 3)
    const zonaBurbujas = document.createElement("div");
    zonaBurbujas.id = "zonaBurbujas";
    contenedor.appendChild(zonaBurbujas);

    // 1.3 Crear la capa interna donde estan Nemo y Dory con sus contadores y botones
    crearAreasNemoYDory(contenedor);

    // 1.4 Iniciar el cambio de color segundo a segundo y el generador de burbujas
    iniciarCambioDeColorPecera();
    iniciarGeneradorDeBurbujas();
}

// =========================================================================
// PREGUNTA 2: USO DE WEB STORAGE API (2 PUNTOS)
// - Nemo recuerda su conteo entre peceras/pestañas -> localStorage
// - Dory solo recuerda en la misma pecera/pestaña -> sessionStorage
// - El color de la pecera pasa de azul claro a verde cada segundo
// =========================================================================
function obtenerConteoNemo() {
    const guardado = localStorage.getItem("conteoNemo");
    return guardado !== null ? parseInt(guardado, 10) : 0;
}

function incrementarNemo() {
    const nuevoValor = obtenerConteoNemo() + 1;
    localStorage.setItem("conteoNemo", nuevoValor);
    const badge = document.getElementById("contadorNemo");
    if (badge) badge.textContent = nuevoValor;
}

function obtenerConteoDory() {
    const guardado = sessionStorage.getItem("conteoDory");
    return guardado !== null ? parseInt(guardado, 10) : 0;
}

function incrementarDory() {
    const nuevoValor = obtenerConteoDory() + 1;
    sessionStorage.setItem("conteoDory", nuevoValor);
    const badge = document.getElementById("contadorDory");
    if (badge) badge.textContent = nuevoValor;
}

// Sincronizar en vivo si Nemo aumenta en otra pestaña abierta
window.addEventListener("storage", function (e) {
    if (e.key === "conteoNemo") {
        const badge = document.getElementById("contadorNemo");
        if (badge) badge.textContent = obtenerConteoNemo();
    }
});

// Cambiar progresivamente el color de las celdas de azul claro rgb(173, 216, 230) a verde segundo a segundo
function iniciarCambioDeColorPecera() {
    segundosTranscurridos = 0;
    if (intervaloColor) clearInterval(intervaloColor);

    intervaloColor = setInterval(function () {
        segundosTranscurridos++;
        // Interpolacion progresiva de Azul Claro (173, 216, 230) hacia Verde Acuario (46, 196, 120)
        const factor = Math.min(segundosTranscurridos / 30, 1);
        const r = Math.round(173 - (173 - 46) * factor);
        const g = Math.round(216 - (216 - 196) * factor);
        const b = Math.round(230 - (230 - 120) * factor);

        const celdas = document.querySelectorAll(".celda-pecera");
        celdas.forEach(function (celda) {
            celda.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        });
    }, 1000);
}

// Construye con DOM API las tarjetas de Nemo y Dory y configura sus zonas de Drop
function crearAreasNemoYDory(contenedor) {
    const capaPeces = document.createElement("div");
    capaPeces.id = "capaPeces";

    // --- AREA DE NEMO (localStorage + Drop de burbujas naranjas) ---
    const zonaNemo = document.createElement("div");
    zonaNemo.id = "zonaNemo";
    zonaNemo.className = "zona-pez";
    zonaNemo.innerHTML = `
        <div class="nombre-pez" style="color:#e85d04;">Nemo (Pez Payaso)</div>
        <div class="memoria-tag">Excelente memoria (<code>localStorage</code>)</div>
        <svg class="svg-pez" viewBox="0 0 120 80">
            <ellipse cx="60" cy="40" rx="38" ry="24" fill="#fb8500" stroke="#000" stroke-width="2"/>
            <polygon points="22,40 4,22 4,58" fill="#fb8500" stroke="#000" stroke-width="2"/>
            <path d="M50,17 Q55,40 50,63" stroke="#fff" stroke-width="8" fill="none"/>
            <path d="M72,20 Q76,40 72,60" stroke="#fff" stroke-width="7" fill="none"/>
            <circle cx="84" cy="34" r="5" fill="#fff"/><circle cx="85" cy="34" r="2.5" fill="#000"/>
        </svg>
        <div id="contadorNemo" class="contador-box contador-nemo">${obtenerConteoNemo()}</div>
        <button id="btnNemo" class="btn-aleta btn-aleta-nemo">Golpear con aleta (+1)</button>
    `;

    // --- AREA DE DORY (sessionStorage + Drop de burbujas azules) ---
    const zonaDory = document.createElement("div");
    zonaDory.id = "zonaDory";
    zonaDory.className = "zona-pez";
    zonaDory.innerHTML = `
        <div class="nombre-pez" style="color:#023e8a;">Dory (Pez Cirujano)</div>
        <div class="memoria-tag">Memoria de corto plazo (<code>sessionStorage</code>)</div>
        <svg class="svg-pez" viewBox="0 0 120 80">
            <ellipse cx="60" cy="40" rx="38" ry="25" fill="#0077b6" stroke="#000" stroke-width="2"/>
            <polygon points="22,40 5,24 5,56" fill="#ffd166" stroke="#000" stroke-width="2"/>
            <path d="M35,28 Q60,18 75,38 L45,42 Z" fill="#023e8a"/>
            <circle cx="84" cy="34" r="5" fill="#fff"/><circle cx="85" cy="34" r="2.5" fill="#000"/>
        </svg>
        <div id="contadorDory" class="contador-box contador-dory">${obtenerConteoDory()}</div>
        <button id="btnDory" class="btn-aleta btn-aleta-dory">Golpear con aleta (+1)</button>
    `;

    capaPeces.appendChild(zonaNemo);
    capaPeces.appendChild(zonaDory);
    contenedor.appendChild(capaPeces);

    // Eventos click de los botones de cada pez (Pregunta 2)
    zonaNemo.querySelector("#btnNemo").addEventListener("click", incrementarNemo);
    zonaDory.querySelector("#btnDory").addEventListener("click", incrementarDory);

    // Configurar eventos Drag and Drop sobre las areas de Nemo y Dory (Pregunta 3)
    configurarZonaDrop(zonaNemo, "nemo", "drag-over-nemo", incrementarNemo);
    configurarZonaDrop(zonaDory, "dory", "drag-over-dory", incrementarDory);
}

// =========================================================================
// PREGUNTA 3: USO DE HTML DRAG AND DROP API (2 PUNTOS)
// - Cada 2 segundos emergen burbujas flotantes desde la parte superior
//   (naranjas para Nemo y azules para Dory).
// - Si aterrizan sobre su pez correspondiente, el contador aumenta y la
//   burbuja desaparece. Si se suelta en el area equivocada o fuera, vuelve
//   a su posicion inicial.
// =========================================================================
function iniciarGeneradorDeBurbujas() {
    if (intervaloBurbujas) clearInterval(intervaloBurbujas);

    // Crear una primera burbuja de inmediato y luego cada 2 segundos
    crearBurbujaFlotante();
    intervaloBurbujas = setInterval(crearBurbujaFlotante, 2000);
}

function crearBurbujaFlotante() {
    const zonaBurbujas = document.getElementById("zonaBurbujas");
    if (!zonaBurbujas) return;

    // Limitar maximo de burbujas simultaneas en pantalla para mantener orden visual
    if (zonaBurbujas.children.length >= 10) return;

    // Elegir aleatoriamente si la burbuja es naranja (Nemo) o azul (Dory)
    const tipoPez = Math.random() < 0.5 ? "nemo" : "dory";
    const burbuja = document.createElement("div");
    const idUnico = "burbuja-" + (contadorIdBurbuja++);

    burbuja.id = idUnico;
    burbuja.className = "burbuja " + (tipoPez === "nemo" ? "burbuja-nemo" : "burbuja-dory");
    burbuja.textContent = tipoPez === "nemo" ? "N" : "D";

    // Atributo nativo para habilitar el arrastre con HTML Drag and Drop API
    burbuja.setAttribute("draggable", "true");
    burbuja.dataset.tipo = tipoPez;

    // Evento dragstart: guardamos el ID y el tipo de burbuja en dataTransfer
    burbuja.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", JSON.stringify({
            id: idUnico,
            tipo: tipoPez
        }));
        e.dataTransfer.effectAllowed = "move";
    });

    zonaBurbujas.appendChild(burbuja);
}

function configurarZonaDrop(elementoZona, tipoEsperado, claseEfecto, funcionIncrementar) {
    // dragover: OBLIGATORIO llamar a e.preventDefault() para permitir el evento drop
    elementoZona.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        elementoZona.classList.add(claseEfecto);
    });

    elementoZona.addEventListener("dragleave", function () {
        elementoZona.classList.remove(claseEfecto);
    });

    // drop: verificamos si la burbuja soltada corresponde a este pez
    elementoZona.addEventListener("drop", function (e) {
        e.preventDefault();
        elementoZona.classList.remove(claseEfecto);

        const rawData = e.dataTransfer.getData("text/plain");
        if (!rawData) return;

        try {
            const datos = JSON.parse(rawData);
            // Solo si el color/tipo de la burbuja coincide con el pez correspondiente:
            if (datos.tipo === tipoEsperado) {
                const burbujaElem = document.getElementById(datos.id);
                if (burbujaElem) {
                    // Aumenta el contador personal del pez y la burbuja desaparece
                    funcionIncrementar();
                    burbujaElem.remove();
                }
            }
            // Si no coincide (o si se suelta fuera), no se elimina y permanece en su posicion inicial
        } catch (err) {
            console.error(err);
        }
    });
}

// Inicializar la pecera 6x6 al cargar la pagina
window.onload = function () {
    crearPecera(6);
};
