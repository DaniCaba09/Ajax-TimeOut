
let alimentos = {}; //objeto que contiene los alimentos leídos por xmlhttprequest o fetch

let contVegetal=0; /*contador y mensaje para informar de que cada comida ha de tener un vegetal*/
const mensaje = document.getElementById('mensajeV');

let  alimentosAñadidos = []; 
const MAX_CALORIAS = 2000; // ahora es constante después se pide a usuario

const alimentosContainer = document.getElementById('alimentosContainer'); 

/*TOTALES*/
let totalCalorias = 0,
totalHidratos = 0,
totalProteinas = 0,
totalGrasas = 0;

class Alimento {
    constructor(nombre, tipo, calorias, hidratos, proteinas, grasas) {
        this._nombre = nombre;
        this._tipo = tipo;
        this._calorias = calorias;
        this._hidratos = hidratos;
        this._proteinas = proteinas;
        this._grasas = grasas;
        this._cantidadGramos = 0;  //  Atributo para la cantidad de gramos
    }

    // Getters
    get nombre() {
        return this._nombre;
    }

    get tipo() {
        return this._tipo;
    }

    get calorias() {
        return this._calorias;
    }

    get hidratos() {
        return this._hidratos;
    }

    get proteinas() {
        return this._proteinas;
    }

    get grasas() {
        return this._grasas;
    }

    // Setters
    set nombre(nombre) {
        this._nombre = nombre;
    }

    set tipo(tipo) {
        this._tipo = tipo;
    }

    set calorias(calorias) {
        this._calorias = calorias;
    }

    set hidratos(hidratos) {
        this._hidratos = hidratos;
    }

    set proteinas(proteinas) {
        this._proteinas = proteinas;
    }

    set grasas(grasas) {
        this._grasas = grasas;
    }

    // OTROS MÉTODOS
    /**Devuelve la suma total de macronutrientes (hidratos + proteínas + grasas)
     * 
     * @returns {number}
     */
    getTotalMacro() {
        return this._hidratos + this._proteinas + this._grasas;
    }
    /**Usa la función getTotalMacro para calcular el porcentaje
     * 
     * @returns {number}
     */
    getprcntGrasas() {
        return (this._grasas / this.getTotalMacro() * 100).toFixed(2);
    }
    getprcntHidratos() {
        return (this._hidratos / this.getTotalMacro() * 100).toFixed(2);
    }
    getprcntProteinas() {
        return (this._proteinas / this.getTotalMacro() * 100).toFixed(2);
    }

   /**Método para añadir alimento y mostrar totales
     * 
     * @param {Alimento} alimento - El alimento a añadir
     */
    addAlimento(cantidadGramos) {
        // Verificar si añadir el nuevo alimento supera la cantidad máxima de calorías
        if (totalCalorias + (this.calorias * cantidadGramos / 100) <= MAX_CALORIAS) {
            this.cantidadGramos = cantidadGramos;  // Asignar la cantidad de gramos al objeto Alimento
 
            alimentosAñadidos.push(this);
            totalCalorias += (this.calorias * cantidadGramos / 100);
            totalHidratos += (this.hidratos * cantidadGramos / 100);
            totalProteinas += (this.proteinas * cantidadGramos / 100);
            totalGrasas += (this.grasas * cantidadGramos / 100);
    
            if (this.tipo === 'Vegetal' || this.tipo === 'Fruta') contVegetal++;
    
            // Ocultar el mensaje si se supera el límite de alimentos vegetales
            if (contVegetal > 0) {
                mensaje.style.display = 'none';
            }
    
            actualizarTotales();
            actualizarCesta();
        } else {
            console.log("¡Superaste la cantidad máxima de calorías permitidas!");
        }
    }

    // Método para quitar el alimento de la cesta
    quitar() {
        const index = alimentosAñadidos.indexOf(this);
    
        if (index !== -1) {
            alimentosAñadidos.splice(index, 1);
    
            totalCalorias -= this.calorias * (this.cantidadGramos / 100);
            totalHidratos -= this.hidratos * (this.cantidadGramos / 100);
            totalProteinas -= this.proteinas * (this.cantidadGramos / 100);
            totalGrasas -= this.grasas * (this.cantidadGramos / 100);
    
            actualizarTotales();
            actualizarCesta();
        }
    }

}

    // Función para actualizar los totales y mostrar en el contenedor
function actualizarTotales() {
        let porcentajeCal = totalCalorias / MAX_CALORIAS * 100;
        // Mostrar totales en el contenedor
        const calculosContainer = document.getElementById('calculosContainer');
        const kcal = document.getElementById('kcal');
        const hid = document.getElementById('hid');
        const prot = document.getElementById('prot');
        const gra = document.getElementById('gra');

        if (porcentajeCal < 100) {
            setProgress(porcentajeCal);
            kcal.innerHTML = `${Math.round(totalCalorias)} kcal `;
            hid.innerHTML = `<strong>Hidratos: </strong>${totalHidratos.toFixed(2)} gr <div id="hid-progress" class="progress-value"></div>`;
            prot.innerHTML = `<strong>Proteínas: </strong>${totalProteinas.toFixed(2)} gr <div id="prot-progress" class="progress-value"></div>`;
            gra.innerHTML = `<strong>Grasas: </strong>${totalGrasas.toFixed(2)}  gr <div id="gra-progress" class="progress-value"></div>`;
            updateProgressBar("hid-progress", totalHidratos);
            updateProgressBar("prot-progress", totalProteinas);
            updateProgressBar("gra-progress", totalGrasas);
        }
    }
    //Función para actualizar la barra de progreso.
function updateProgressBar(progressBarId, value) {
        var progressBar = document.getElementById(progressBarId);
        if (!progressBar) {
            console.error("Element with ID '" + progressBarId + "' not found.");
            return;
        }    
        var newValue = Math.min(value, 100);
        progressBar.style.width = newValue + "%";
    }

// Crear instancias de la clase Alimento
let alimentosData = [];

fetch('alimentos.php')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error de lectura del archivo: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    alimentosData = data;
    alimentos = alimentosData.map(item => new Alimento(
      item.nombre,
      item.tipo,
      item.calorias,
      item.hidratos,
      item.proteinas,
      item.grasas
    ));
    alimentos.sort((a, b) => a.calorias - b.calorias);
    // Agregar divs independientes para cada alimento
    alimentos.forEach(alimento => {
      const div = document.createElement('div');
      div.className = 'alimento';
      div.innerHTML = `
        <b>${alimento.nombre}</b><br>
        ${alimento.calorias}<br>Kcal
        <img src="./img/${alimento.nombre}.png" alt="${alimento.nombre}">
      `;
      div.onclick = function () {
        openModal(alimento);
      };
      alimentosContainer.appendChild(div);
    });
  })
  .catch(error => {
    console.error('Error de lectura del archivo:', error.message);
  });


// Función para abrir el modal con la información del alimento
function openModal(alimento) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <b>${alimento.nombre}</b><br><br>
        <strong>Tipo:</strong> ${alimento.tipo}<br>
        <strong>Calorías:</strong> ${alimento.calorias} kcal<br>
        <strong>Hidratos (%):</strong> ${alimento.getprcntHidratos()}<br>
        <strong>Proteínas (%):</strong> ${alimento.getprcntProteinas()}<br>
        <strong>Grasas (%):</strong> ${alimento.getprcntGrasas()}<br>
        <img src="./img/${alimento.nombre}.png" alt="${alimento.nombre}">
        <br>
        <br>
        <label for="gramosInput" style="margin-top:2px;">Ingrese la cantidad en gramos:</label>
        <br>
        <br>
        <input type="number" id="gramosInput" placeholder="100gr por defecto...">
        <span class="add" id="addButton">&plus;</span>
    `;
    modal.style.display = 'block';

        // Asignar el evento onclick usando JavaScript
        const addButton = document.getElementById('addButton');
        addButton.onclick = function () {
            const gramosInput = document.getElementById('gramosInput');
            const cantidadGramos = gramosInput.value ? parseFloat(gramosInput.value) : 100; // Valor predeterminado a 100 gramos si no se ingresa nada
            alimento.addAlimento(cantidadGramos);

        };
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Cerrar modal haciendo clic fuera del contenido
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
}


const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

// Establecer la longitud inicial del círculo
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// Actualizar el valor del círculo
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Función para recargar la página con el nuevo orden de alimentos
function recargarPagina() {
    // Obtén la URL actual y agrega el parámetro de consulta 'orden' con el valor del criterio de ordenación
    const criterio = document.getElementById('ordenarSelect').value;
    const url = new URL(window.location.href);
    url.searchParams.set('orden', criterio);
  
    // Recarga la página con la nueva URL
    window.location.href = url.href;
  }
  
  // Función para ordenar los alimentos según el criterio seleccionado
  function ordenarAlimentos() {
    const ordenarSelect = document.getElementById('ordenarSelect');
    const criterio = ordenarSelect.value;
  
    if (criterio === 'alfabeto') {
      alimentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (criterio === 'calorias') {
      alimentos.sort((a, b) => a.calorias - b.calorias);
    }else if (criterio === 'caloriasdecreciente') {
      alimentos.sort((a, b) => b.calorias - a.calorias);
    }
  
    // Limpiar el contenedor antes de agregar los alimentos ordenados
    alimentosContainer.innerHTML = '';
  
    // Agregar divs independientes para cada alimento después de ordenar
    alimentos.forEach(alimento => {
      const div = document.createElement('div');
      div.className = 'alimento';
      div.innerHTML = `
        <b>${alimento.nombre}</b><br>
        ${alimento.calorias}<br>Kcal
        <img src="./img/${alimento.nombre}.png" alt="${alimento.nombre}">
      `;
      div.onclick = function () {
        openModal(alimento);
      };
      alimentosContainer.appendChild(div);
    });
  }

  // Verifica si hay un parámetro 'orden' en la URL al cargar la página
  window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenParam = urlParams.get('orden');
  
    if (ordenParam) {
      // Si hay un parámetro 'orden', selecciona la opción correspondiente en el menú desplegable y ordena los alimentos
      document.getElementById('ordenarSelect').value = ordenParam;
      ordenarAlimentos();
    }
  };

// Función para quitar el alimento de la cesta
function quitar(nombreAlimento) {
    const alimentoEncontrado = alimentosAñadidos.find(alimento => alimento.nombre === nombreAlimento);

    if (alimentoEncontrado) {
        alimentoEncontrado.quitar();
        if (alimentoEncontrado.tipo === 'Vegetal' || alimentoEncontrado.tipo === 'Fruta') {
            contVegetal--;
        }

        if (contVegetal <= 3) {
            mensaje.style.display = 'block';
        }
    }
}
// Función para actualizar la cesta después de quitar un alimento
function actualizarCesta() {
    const cestaContainer = document.getElementById('cesta');
    cestaContainer.innerHTML = ''; // Limpiar la cesta antes de volver a mostrar los alimentos

    alimentosAñadidos.forEach(alimento => {
        const cestaItem = document.createElement('div');
        const quitarButton = document.createElement('button');
        quitarButton.className = 'quitarButton';
        quitarButton.innerHTML = '&times;';

        const imagenAlimento = document.createElement('img');
        imagenAlimento.src = `./img/${alimento.nombre}.png`;
        imagenAlimento.alt = alimento.nombre;
        imagenAlimento.width = 50;
        imagenAlimento.height = 50;

        quitarButton.addEventListener('click', () => {
            quitar(alimento.nombre);

        });
        cestaItem.appendChild(imagenAlimento);
        cestaItem.appendChild(document.createTextNode(`${alimento.nombre} `));
        cestaItem.appendChild(quitarButton);
        cestaContainer.appendChild(cestaItem);

    });
}

//función para añadir a Desayuno, Almuerzo, Snack o Cena
function addMenu(seleccion) {
    const cestaContainer = document.getElementById('cesta');
    const selectedDiv = document.getElementById(seleccion);

    if (!selectedDiv) {
        console.log('Selecciona donde añadir');
        return;
    }

    alimentosAñadidos.forEach(alimento => {
        const cestaItem = document.createElement('div');
        const imagenAlimento = document.createElement('img');
        const peso = document.createElement("p");

        peso.innerText = `${alimento.cantidadGramos} gramos`;
        imagenAlimento.src = `./img/${alimento.nombre}.png`;
        imagenAlimento.alt = alimento.nombre;
        imagenAlimento.width = 50;
        imagenAlimento.height = 50;

        cestaItem.appendChild(imagenAlimento);
        cestaItem.appendChild(document.createTextNode(`${alimento.nombre} `));
        cestaItem.appendChild(peso);
        selectedDiv.appendChild(cestaItem);
    });

    cestaContainer.innerHTML = '';
    alimentosAñadidos = [];
}