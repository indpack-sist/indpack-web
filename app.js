const sistemaDeteccion = {
    intentosBloqueados: 0,
    intentosExitosos: 0,
    
    registrarIntento: function(tipo, detalles) {
        const timestamp = new Date().toLocaleString('es-PE', { 
            timeZone: 'America/Lima',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const registro = {
            fecha: timestamp,
            tipo: tipo,
            detalles: detalles,
            ip: 'No disponible en frontend',
            navegador: navigator.userAgent
        };
        
        console.log('═══════════════════════════════════════');
        console.log('REGISTRO DE SEGURIDAD');
        console.log('═══════════════════════════════════════');
        console.log('Fecha/Hora:', registro.fecha);
        console.log('Tipo:', registro.tipo);
        console.log('Detalles:', registro.detalles);
        console.log('Navegador:', registro.navegador);
        console.log('═══════════════════════════════════════');
        
        this.guardarEnHistorial(registro);
    },
    
    guardarEnHistorial(registro) {
        let historial = JSON.parse(localStorage.getItem('historial_seguridad') || '[]');
        historial.push(registro);
        
        if (historial.length > 100) {
            historial = historial.slice(-100);
        }
        
        localStorage.setItem('historial_seguridad', JSON.stringify(historial));
    },
    
    verHistorial: function() {
        const historial = JSON.parse(localStorage.getItem('historial_seguridad') || '[]');
        console.table(historial);
        return historial;
    },
    
    limpiarHistorial: function() {
        localStorage.removeItem('historial_seguridad');
        console.log('Historial limpiado');
    },
    
    obtenerEstadisticas: function() {
        const historial = JSON.parse(localStorage.getItem('historial_seguridad') || '[]');
        const stats = {
            total: historial.length,
            recaptchaFallidos: historial.filter(r => r.tipo === 'RECAPTCHA_FALLIDO').length,
            validacionFallida: historial.filter(r => r.tipo === 'VALIDACION_FALLIDA').length,
            enviosExitosos: historial.filter(r => r.tipo === 'ENVIO_EXITOSO').length,
            erroresEnvio: historial.filter(r => r.tipo === 'ERROR_ENVIO').length,
            llenadoSospechoso: historial.filter(r => r.tipo === 'LLENADO_SOSPECHOSO').length
        };
        
        console.log('ESTADÍSTICAS DE SEGURIDAD:');
        console.table(stats);
        return stats;
    }
};

window.seguridadIndpack = sistemaDeteccion;

document.addEventListener('DOMContentLoaded', function() {

    AOS.init({
        duration: 800,
        once: true
    });

    const SERVICE_ID = "service_u7oisbl";
    const TEMPLATE_ID = "template_ar7ykfg";
    const PUBLIC_KEY = "8LwIYfgiDFrQh95SK";

    (function() {
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS inicializado correctamente');
    })();

    const formulario = document.getElementById('contactForm');
    if (formulario) {
        formulario.addEventListener('focus', function() {
            if (!window.formularioInicioTiempo) {
                window.formularioInicioTiempo = Date.now();
            }
        }, true);
    }

    function validarNombre(nombre) {
        if (nombre.length < 3) {
            return 'El nombre debe tener al menos 3 caracteres';
        }
        if (nombre.length > 50) {
            return 'El nombre no puede exceder 50 caracteres';
        }
        return '';
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            return 'Por favor ingresa un email válido';
        }
        return '';
    }

    function validarTelefono(telefono) {
        const regex = /^9[0-9]{8}$/;
        if (!regex.test(telefono)) {
            return 'El teléfono debe comenzar con 9 y tener 9 dígitos';
        }
        return '';
    }

    function validarEmpresa(empresa) {
        if (empresa && empresa.length > 50) {
            return 'El nombre de empresa no puede exceder 50 caracteres';
        }
        return '';
    }

    function validarAsunto(asunto) {
        if (asunto.length < 5) {
            return 'El asunto debe tener al menos 5 caracteres';
        }
        if (asunto.length > 100) {
            return 'El asunto no puede exceder 100 caracteres';
        }
        return '';
    }

    function validarMensaje(mensaje) {
        if (mensaje.length < 10) {
            return 'El mensaje debe tener al menos 10 caracteres';
        }
        if (mensaje.length > 500) {
            return 'El mensaje no puede exceder 500 caracteres';
        }
        return '';
    }

    function mostrarError(inputId, mensaje) {
        const input = document.getElementById(inputId);
        const errorSpan = document.getElementById(inputId + '-error');
        
        if (input && errorSpan) { 
            if (mensaje) {
                input.classList.add('error');
                errorSpan.textContent = mensaje;
                errorSpan.classList.add('show');
            } else {
                input.classList.remove('error');
                errorSpan.classList.remove('show');
            }
        }
    }

    const nombreInput = document.getElementById('nombre');
    if (nombreInput) {
        nombreInput.addEventListener('blur', function() {
            mostrarError('nombre', validarNombre(this.value));
        });
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            mostrarError('email', validarEmail(this.value));
        });
    }

    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 0) {
                mostrarError('telefono', validarTelefono(this.value));
            }
        });
    }

    const empresaInput = document.getElementById('empresa');
    if (empresaInput) {
        empresaInput.addEventListener('blur', function() {
            mostrarError('empresa', validarEmpresa(this.value));
        });
    }

    const asuntoInput = document.getElementById('asunto');
    if (asuntoInput) {
        asuntoInput.addEventListener('blur', function() {
            mostrarError('asunto', validarAsunto(this.value));
        });
    }

    const mensajeInput = document.getElementById('mensaje');
    if (mensajeInput) {
        mensajeInput.addEventListener('input', function() {
            const count = this.value.length;
            document.getElementById('mensaje-count').textContent = count + '/500 caracteres';
            
            if (count >= 10) {
                mostrarError('mensaje', validarMensaje(this.value));
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            console.log('Formulario enviado - iniciando validación');

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const asunto = document.getElementById('asunto').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            const errorNombre = validarNombre(nombre);
            const errorEmail = validarEmail(email);
            const errorTelefono = validarTelefono(telefono);
            const errorEmpresa = validarEmpresa(empresa);
            const errorAsunto = validarAsunto(asunto);
            const errorMensaje = validarMensaje(mensaje);

            mostrarError('nombre', errorNombre);
            mostrarError('email', errorEmail);
            mostrarError('telefono', errorTelefono);
            mostrarError('empresa', errorEmpresa);
            mostrarError('asunto', errorAsunto);
            mostrarError('mensaje', errorMensaje);

            if (errorNombre || errorEmail || errorTelefono || errorEmpresa || errorAsunto || errorMensaje) {
                console.log('Errores de validación detectados');
                
                sistemaDeteccion.registrarIntento('VALIDACION_FALLIDA', {
                    errores: {
                        nombre: errorNombre,
                        email: errorEmail,
                        telefono: errorTelefono,
                        empresa: errorEmpresa,
                        asunto: errorAsunto,
                        mensaje: errorMensaje
                    }
                });
                
                const formMessage = document.getElementById('formMessage');
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Por favor corrige los errores en el formulario';
                return;
            }

            const recaptchaResponse = grecaptcha.getResponse();
            if (recaptchaResponse.length === 0) {
                console.log('reCAPTCHA no verificado');
                
                sistemaDeteccion.registrarIntento('RECAPTCHA_FALLIDO', {
                    nombre: nombre,
                    email: email
                });
                
                const formMessage = document.getElementById('formMessage');
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Por favor, completa el reCAPTCHA';
                return; 
            }

            const tiempoLlenado = Date.now() - (window.formularioInicioTiempo || Date.now());
            if (tiempoLlenado < 3000) {
                sistemaDeteccion.registrarIntento('LLENADO_SOSPECHOSO', {
                    tiempoMs: tiempoLlenado,
                    email: email,
                    nombre: nombre
                });
                console.warn('Formulario llenado muy rápido:', tiempoLlenado, 'ms');
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';
            
            const formMessage = document.getElementById('formMessage');
            formMessage.className = 'form-message info';
            formMessage.textContent = 'Enviando tu mensaje...';

            const templateParams = {
                nombre: nombre,
                from_name: nombre,
                email: email,
                telefono: telefono,
                empresa: empresa || 'No especificada',
                asunto: asunto,
                mensaje: mensaje
            };

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('¡ÉXITO!', response.status, response.text);
                    
                    sistemaDeteccion.registrarIntento('ENVIO_EXITOSO', {
                        nombre: nombre,
                        email: email,
                        empresa: empresa,
                        tiempoLlenado: tiempoLlenado
                    });
                    
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                    document.getElementById('contactForm').reset();
                    document.getElementById('mensaje-count').textContent = '0/500 caracteres';
                }, function(error) {
                    console.error('ERROR AL ENVIAR:', error);
                    
                    sistemaDeteccion.registrarIntento('ERROR_ENVIO', {
                        error: error.text || error.message || 'Error desconocido',
                        email: email,
                        nombre: nombre
                    });
                    
                    formMessage.className = 'form-message error';
                    let errorMsg = 'Error al enviar el mensaje. ';
                    if (error.text) {
                        errorMsg += error.text;
                    } else if (error.message) {
                        errorMsg += error.message;
                    } else {
                        errorMsg += 'Por favor verifica tu conexión e intenta nuevamente.';
                    }
                    formMessage.textContent = errorMsg;
                    console.log('Detalles completos del error:', JSON.stringify(error));
                })
                .finally(() => {
                    grecaptcha.reset();
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
                    }, 3000);
                });
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.getElementById('navMenu').classList.toggle('active');
        });
    }

    const navMenuLinks = document.querySelectorAll('.nav-menu a');
    if (navMenuLinks) {
        navMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('navMenu').classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('SISTEMA DE SEGURIDAD INDPACK SAC - ACTIVO');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Comandos disponibles:');
    console.log('• seguridadIndpack.verHistorial()        - Ver todos los registros');
    console.log('• seguridadIndpack.obtenerEstadisticas() - Ver estadísticas');
    console.log('• seguridadIndpack.limpiarHistorial()    - Limpiar historial');
    console.log('═══════════════════════════════════════════════════════════');
    
});




