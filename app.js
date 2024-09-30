// URL del json-server
const url = "http://localhost:3000/productos";

// Referencias a elementos del DOM
const productosContenedor = document.getElementById('productos__contenedor');
const formulario = document.getElementById('formulario__producto');
const nombreProducto = document.getElementById('nombre__producto');
const precioProducto = document.getElementById('precio__producto');
const imagenProducto = document.getElementById('imagen__producto');

// Función para obtener productos y renderizarlos
async function obtenerProductos() {
  const respuesta = await fetch("http://localhost:3000/productos");
  const productos = await respuesta.json();
  renderizarProductos(productos);
};

// Función para renderizar productos en la sección
async function renderizarProductos(productos) {
  const fragmento = document.createDocumentFragment();

  if (productos.length === 0) {
    const mensaje = document.createElement('p');
    mensaje.textContent = 'No se han agregado productos.';
    fragmento.appendChild(mensaje);
  } else {
    productos.forEach(producto => {
      const productoDiv = document.createElement('div');
      productoDiv.className = 'card product-card';
      productoDiv.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button data-id="${producto.id}">Eliminar</button>
      `;
      fragmento.appendChild(productoDiv);
    });
  }

  productosContenedor.innerHTML = '';
  productosContenedor.appendChild(fragmento);
};

// Función para registrar un nuevo producto
async function agregarProducto(e) {
  e.preventDefault();
  
  // Verificar si los elementos existen antes de acceder a sus valores
  if (!nombreProducto || !precioProducto || !imagenProducto) {
    console.error('No se pudieron encontrar todos los elementos del formulario');
    console.error('nombreProducto:', nombreProducto);
    console.error('precioProducto:', precioProducto);
    console.error('imagenProducto:', imagenProducto);
    alert('Error al procesar el formulario. Por favor, recarga la página e intenta de nuevo.');
    return;
  }

  // Validar los campos del formulario
  if (!nombreProducto.value || !precioProducto.value || !imagenProducto.value) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  const nuevoProducto = {
    nombre: nombreProducto.value.trim(),
    precio: parseFloat(precioProducto.value),
    imagen: imagenProducto.value.trim()
  };
  
  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    });
    
    if (!respuesta.ok) {
      throw new Error(`Error al agregar el producto: ${respuesta.status}`);
    }

    formulario.reset();
    await obtenerProductos();
    alert('Producto agregado con éxito.');
  } catch (error) {
    console.error('Error:', error);
    alert(`Error al agregar el producto: ${error.message}`);
  }
};

// Función para eliminar un producto
async function eliminarProducto(eliminarProductoId) {
  try {
    console.log(`Intentando eliminar producto con ID: ${eliminarProductoId}`);
    const respuesta = await fetch(`${url}/${eliminarProductoId}`, {
      method: 'DELETE'
    });

    console.log('Respuesta del servidor:', respuesta);

    if (!respuesta.ok) {
      throw new Error(`Error al eliminar el producto: ${respuesta.status}`);
    }

    console.log(`Producto con ID ${eliminarProductoId} eliminado con éxito`);
    await obtenerProductos();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    alert(`No se pudo eliminar el producto: ${error.message}`);
  }
}

// Asegurarse de que el DOM esté completamente cargado antes de agregar el event listener
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado');
  if (formulario) {
    console.log('Formulario encontrado, agregando event listener');
    formulario.addEventListener('submit', agregarProducto);
  } else {
    console.error('No se pudo encontrar el formulario');
  }
  
  // Verificar si los elementos del formulario se encuentran
  console.log('nombreProducto:', nombreProducto);
  console.log('precioProducto:', precioProducto);
  console.log('imagenProducto:', imagenProducto);
});

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);

function d275() {
  // Aquí va el código que quieres que se ejecute cuando se hace clic en el botón
  console.log('Botón clickeado');
}

document.addEventListener('DOMContentLoaded', () => {
  const miBoton = document.getElementById('miBoton');
  if (miBoton) {
    miBoton.addEventListener('click', () => {
      console.log('Botón clickeado');
      // Aquí va el código que quieres que se ejecute cuando se hace clic en el botón
    });
  }
});

// Asegúrate de que esta función se llame correctamente desde tu HTML
document.addEventListener('DOMContentLoaded', () => {
  const productosContenedor = document.getElementById('productos__contenedor');
  if (productosContenedor) {
    productosContenedor.addEventListener('click', (e) => {
      if (e.target.matches('button[data-id]')) {
        const id = e.target.dataset.id;
        console.log('Botón de eliminar clickeado para el producto con ID:', id);
        eliminarProducto(id);
      }
    });
  } else {
    console.error('No se encontró el contenedor de productos');
  }
});


