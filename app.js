// URL del json-server
const url = "http://localhost:3000/productos";

// Referencias a elementos del DOM
const productosContenedor = document.getElementById('productos__contenedor');
const formulario = document.getElementById('formulario__producto');
const nombreProducto = document.getElementById('nombre__producto');
const precioProducto = document.getElementById('precio__producto');
const imagenProducto = document.getElementById('imagen__producto');
const noProductosMsg = document.getElementById('no-productos');

// Función para formatear precio
const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(precio);
};

// Función para validar URL de imagen
const esUrlImagenValida = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
};

// Función para obtener productos y renderizarlos
async function obtenerProductos() {
    productosContenedor.classList.add('loading');
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
    } finally {
        productosContenedor.classList.remove('loading');
    }
}

// Función para renderizar productos en la sección
function renderizarProductos(productos) {
    productosContenedor.innerHTML = '';
    
    if (productos.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.id = 'no-productos';
        mensaje.textContent = 'No hay productos disponibles';
        productosContenedor.appendChild(mensaje);
        return;
    }

    productos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'card product-card';
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" 
                 alt="${producto.nombre}" 
                 onerror="this.src='https://via.placeholder.com/200x200?text=Imagen+no+disponible'"
                 loading="lazy">
            <h3>${producto.nombre}</h3>
            <p>${typeof producto.precio === 'number' ? formatearPrecio(producto.precio) : producto.precio}</p>
            <button data-id="${producto.id}" class="eliminar-btn">Eliminar</button>
        `;
        productosContenedor.appendChild(productoDiv);
    });
}

// Función para validar el formulario
function validarFormulario(nombre, precio, imagen) {
    if (!nombre || nombre.trim().length < 3) {
        mostrarError('El nombre debe tener al menos 3 caracteres');
        return false;
    }
    
    if (!precio || precio <= 0) {
        mostrarError('El precio debe ser mayor a 0');
        return false;
    }
    
    if (!imagen || !esUrlImagenValida(imagen)) {
        mostrarError('La URL de la imagen no es válida');
        return false;
    }
    
    return true;
}

// Función para registrar un nuevo producto
async function agregarProducto(e) {
    e.preventDefault();
    
    const nombre = nombreProducto.value.trim();
    const precio = parseFloat(precioProducto.value);
    const imagen = imagenProducto.value.trim();
    
    if (!validarFormulario(nombre, precio, imagen)) {
        return;
    }
    
    const nuevoProducto = { nombre, precio, imagen };
    
    try {
        formulario.classList.add('loading');
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
    } finally {
        formulario.classList.remove('loading');
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const confirmacion = confirm('¿Estás seguro de que deseas eliminar este producto?');
        if (!confirmacion) return;

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
    mostrarToast(mensaje, 'success');
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    mostrarToast(mensaje, 'error');
}

// Función para mostrar toast
function mostrarToast(mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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