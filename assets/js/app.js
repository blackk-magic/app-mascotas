// Variables Globales
const modal = document.getElementById('modalLogin');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const spanClose = document.getElementsByClassName('close')[0];
const userInfo = document.getElementById('userInfo');
const userNameDisplay = document.getElementById('userName');

let DATOS_USUARIOS = [];
let USUARIO_ACTUAL = null; 

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    startHeroSlider();
    await cargarDatos();
});

async function cargarDatos() {
    try {
        const response = await fetch('./data/usuarios.json');
        
        if (!response.ok) throw new Error("No se pudo leer el archivo JSON");
        
        DATOS_USUARIOS = await response.json();
    } catch (error) {
        console.warn('Usando datos de respaldo (Fetch falló o es local):', error);

        // Datos Dummy de respaldo por si falla el fetch local
        DATOS_USUARIOS = [
            { id_usuario: 1, nombre: "Juan Pérez", correo: "juan@email.com", password: "123", tipo: "donante" },
            { id_usuario: 2, nombre: "Refugio Patitas", correo: "contacto@patitas.org", password: "admin", tipo: "beneficiario" }
        ];
    }
}


// Gestión Usuarios Login/Logout
function login(usuario) {
    USUARIO_ACTUAL = usuario;
    actualizarInterfazLogin(true);
}

function logout() {
    USUARIO_ACTUAL = null;
    actualizarInterfazLogin(false);
    document.getElementById('formLogin').reset();
    document.getElementById('formRegister').reset();    
}

function actualizarInterfazLogin(estaLogueado) {
    if (estaLogueado) {
        modal.classList.add('hidden');
        btnLogin.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userNameDisplay.textContent = USUARIO_ACTUAL.nombre;
    } else {
        btnLogin.classList.remove('hidden');
        userInfo.classList.add('hidden');
        userNameDisplay.textContent = '';
    }
}

// Evento Logout
if(btnLogout) {
    btnLogout.onclick = () => logout();
}


// Logica Modal Auth/Register
// Abrir Modal
if(btnLogin) btnLogin.onclick = () => {
    modal.classList.remove('hidden');
    toggleAuth('login');
};

// Cerrar Modal (X)
if(spanClose) spanClose.onclick = () => modal.classList.add('hidden');

// Switch entre Tabs del Modal (Login vs Registro)
window.toggleAuth = function(mode) {
    const loginForm = document.getElementById('formLogin');
    const registerForm = document.getElementById('formRegister');
    const loginBtn = document.getElementById('tabLoginBtn');
    const registerBtn = document.getElementById('tabRegisterBtn');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
}

// Proceso de Login
document.getElementById('formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]').value;
    const passwordInput = e.target.querySelector('input[type="password"]').value;

    const usuarioEncontrado = DATOS_USUARIOS.find(u => 
        u.correo === emailInput && u.password === passwordInput
    );

    if (usuarioEncontrado) {
        login(usuarioEncontrado);
    } else {
        alert('Credenciales incorrectas. Verifica o regístrate.');
    }
});

// Proceso de Registro Simulado
document.getElementById('formRegister').addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('regNombre').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    const passConfirm = document.getElementById('regPassConfirm').value;

    if (pass !== passConfirm) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const existe = DATOS_USUARIOS.find(u => u.correo === email);
    if (existe) {
        alert('Este correo ya existe en el sistema actual.');
        return;
    }

    const nuevoUsuario = {
        id_usuario: DATOS_USUARIOS.length + 1,
        nombre: nombre,
        correo: email,
        password: pass,
        tipo: "donante" // Default
    };

    DATOS_USUARIOS.push(nuevoUsuario);
    alert('¡Cuenta creada! Sesión iniciada automáticamente.');
    login(nuevoUsuario);
});


// Funcionalidades del sitio (Tabs, Formularios, Hero) ---
// Cambiar Tabs (Donar / Pedir)
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const target = document.getElementById(`tab-${tabName}`);
    if(target) target.classList.remove('hidden');
    
    const buttons = document.querySelectorAll('.tab-btn');
    if (buttons.length > 0) {
        if(tabName === 'donar') buttons[0].classList.add('active');
        else buttons[1].classList.add('active');
    }
}

// Slider del Hero
function startHeroSlider() {
    const slides = document.querySelectorAll('.hero-bg');
    if(slides.length === 0) return;
    
    let currentSlide = 0;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Manejo visual de formularios principales
const formDonacion = document.getElementById('formDonacion');
if(formDonacion) {
    formDonacion.addEventListener('submit', (e) => {
        e.preventDefault();
        if(!USUARIO_ACTUAL) {
            alert('Debes iniciar sesión para realizar una donación.');
            modal.classList.remove('hidden');
            return;
        }
        alert(`¡Gracias ${USUARIO_ACTUAL.nombre}! Tu solicitud de donación ha sido registrada. Nos pondremos en contacto contigo.`);
        e.target.reset();
    });
}

const formSolicitud = document.getElementById('formSolicitud');
if(formSolicitud) {
    formSolicitud.addEventListener('submit', (e) => {
        e.preventDefault();
        if(!USUARIO_ACTUAL) {
            alert('Debes iniciar sesión para solicitar ayuda.');
            modal.classList.remove('hidden');
            return;
        }
        alert('Solicitud enviada. Nos pondremos en contacto contigo.');
        e.target.reset();
    });
}

// Inicializar iconos
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}