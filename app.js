// URL del json-server
const url = "http://localhost:3000/productos";

// Referencias a elementos del DOM
const productosContenedor = document.getElementById('productos__contenedor');
const formulario = document.getElementById('formulario__producto');
const nombreProducto = document.getElementById('nombre__producto');
const precioProducto = document.getElementById('precio__producto');
const imagenProducto = document.getElementById('imagen__producto');
const noProductosMsg = document.getElementById('no-productos');

// Función para obtener productos y renderizarlos
async function obtenerProductos() {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error('Error al obtener productos');
    }
    const productos = await respuesta.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error:', error);
    mostrarError('Error al cargar los productos');
  }
}

// Función para renderizar productos en la sección
function renderizarProductos(productos) {
  productosContenedor.innerHTML = '';
  noProductosMsg.style.display = productos.length === 0 ? 'block' : 'none';

  productos.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.className = 'card product-card';
    productoDiv.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/100x100?text=Error'">
      <h3>${producto.nombre}</h3>
      <p>$${typeof producto.precio === 'number' ? producto.precio.toLocaleString('es-MX') : producto.precio}</p>
      <button data-id="${producto.id}" class="eliminar-btn">Eliminar</button>
    `;
    productosContenedor.appendChild(productoDiv);
  });
}

// Función para registrar un nuevo producto
async function agregarProducto(e) {
  e.preventDefault();
  
  try {
    const nuevoProducto = {
      nombre: nombreProducto.value.trim(),
      precio: parseFloat(precioProducto.value),
      imagen: imagenProducto.value.trim()
    };

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
    mostrarExito('Producto agregado con éxito');
  } catch (error) {
    console.error('Error:', error);
    mostrarError(`Error al agregar el producto: ${error.message}`);
  }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
  try {
    const respuesta = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    });

    if (!respuesta.ok) {
      throw new Error(`Error al eliminar el producto: ${respuesta.status}`);
    }

    await obtenerProductos();
    mostrarExito('Producto eliminado con éxito');
  } catch (error) {
    console.error('Error:', error);
    mostrarError(`Error al eliminar el producto: ${error.message}`);
  }
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
  const toast = document.createElement('div');
  toast.className = 'toast error';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  obtenerProductos();
  
  if (formulario) {
    formulario.addEventListener('submit', agregarProducto);
  }

  if (productosContenedor) {
    productosContenedor.addEventListener('click', (e) => {
      if (e.target.matches('.eliminar-btn')) {
        const id = e.target.dataset.id;
        eliminarProducto(id);
      }
    });
  }
});